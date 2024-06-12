import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  writeBatch,
} from "firebase/firestore";

import { Product } from "@/interfaces/Product";
import { Order, OrderItem } from "@/interfaces/Account";
import { Address } from "@/interfaces/Account";
import { firebaseDB } from "@/config/FirebaseConfig";

export function useGetAccountOrderList(accountId: string) {
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!accountId) return;
    const unsubscribe = onSnapshot(
      collection(firebaseDB, `/accounts/${accountId}/orders`),
      async (snapshot) => {
        const newOrderList = snapshot.docs.map((doc) => {
          return {
            ...doc.data(),
          };
        });

        setOrderList(newOrderList as Order[]); // Convert OrderItem[] to Order[]
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [accountId]);

  return { orderList, isLoading };
}

export function useGetAllOrder() {
  const [orders, setOrderList] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firebaseDB, `/accounts`),
      async (snapshot) => {
        // get all orders from all accounts
        let allOrders: Order[] = [];
        for (let account of snapshot.docs) {
          const accountOrders = await getDocs(
            collection(firebaseDB, `/accounts/${account.id}/orders`)
          );

          allOrders = allOrders.concat(
            accountOrders.docs.map((doc) => {
              return {
                ...doc.data(),
              } as Order;
            })
          );
        }

        setOrderList(allOrders);
        setIsLoading(false);
      }
    );

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []); // Depend on accountId so it reruns the effect when accountId changes

  return { orders, isLoading };
}

export function useGetOrdersBySeller(sellerId: string) {
  const [orders, setOrderList] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!sellerId) return;
    const fetchOrders = async () => {
      setIsLoading(true);
      let allOrders: Order[] = [];
      const accountsSnapshot = await getDocs(
        collection(firebaseDB, `/accounts`)
      );

      for (let account of accountsSnapshot.docs) {
        const accountOrdersSnapshot = await getDocs(
          collection(firebaseDB, `/accounts/${account.id}/orders`)
        );

        accountOrdersSnapshot.forEach((doc) => {
          const orderData = doc.data() as Order;
          const orderItemsBySeller = orderData.orderItems.filter(
            (item) => item.sellerId === sellerId
          );

          if (orderItemsBySeller.length > 0) {
            allOrders.push({
              ...orderData,
              orderItems: orderItemsBySeller,
            });
          }
        });
      }

      setOrderList(allOrders);
      setIsLoading(false);
    };

    fetchOrders();
  }, [sellerId]);

  return { orders, isLoading };
}

export function usePlaceOrder() {
  const placeOrder = async (accountId: string, address: Address) => {
    try {
      if (!accountId) {
        toast.error("User does not exist");
        return;
      }

      const cartRef = collection(firebaseDB, `/accounts/${accountId}/cart`);
      const cartSnap = await getDocs(cartRef);

      const orderItemList: OrderItem[] = [];
      const productRefArray: any[] = [];

      const batch = writeBatch(firebaseDB);

      for (let cartItem of cartSnap.docs) {
        const productRef = doc(
          firebaseDB,
          `/products/${cartItem.data().productId}`
        );
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const newQuantity =
            productSnap.data().quantity - cartItem.data().cartItemQuantity;

          if (
            newQuantity < 0 ||
            cartItem.data().cartItemQuantity > productSnap.data().quantity
          ) {
            toast.error("No enough stock for " + productSnap.data().title);
            return { ok: false, message: "Not enough stock" };
          }

          productRefArray.push(productRef);
          orderItemList.push({
            ...Product.fromFirestore(productSnap.id, productSnap.data()),
            productId: cartItem.data().productId,
            orderItemQuantity: cartItem.data().cartItemQuantity,
          });

          batch.update(productRef, { quantity: newQuantity });
          batch.delete(
            doc(firebaseDB, `/accounts/${accountId}/cart/${cartItem.id}`)
          );
        }
      }

      let totalPrice = orderItemList.reduce(
        (acc, product) => acc + product.price,
        0
      );
      if (totalPrice < 1000) totalPrice = totalPrice + 100; // Add delivery fee if total price is less than 1000

      const ordersCollectionRef = collection(
        firebaseDB,
        `/accounts/${accountId}/orders`
      );
      const newOrderRef = doc(ordersCollectionRef);
      const order: Order = {
        _id: newOrderRef.id,
        orderItems: orderItemList.map((item) => ({
          ...item,
          _id: item._id,
          productId: item.productId,
          orderItemQuantity: item.orderItemQuantity,
          price: item.price,
          // Add other fields here as necessary and ensure they are defined
        })),
        orderTotal: totalPrice,
        orderStatus: "Pending",
        orderDate: new Date(),
        orderAddress: { ...address },
      };

      await setDoc(newOrderRef, order);
      await batch.commit();

      toast.success("Order placed successfully");
      return { ok: true, message: "Order placed successfully" };
    } catch (e) {
      toast.error("Failed to place order");
      return { ok: false, message: "Failed to place order" };
    }
  };

  return { placeOrder };
}

// export function useCancelOrder(accountId: string) {
//     const cancelOrder = async (productId: string) => {
//         try {
//             await deleteDoc(doc(firebaseDB, `/accounts/${accountId}/orders/${productId}`));
//             toast.warning("Order cancelled");
//             return { ok: true, message: "Order cancelled" };
//         } catch (e) {
//             return { ok: false, message: "Failed to cancel order" };
//         }
//     };

//     return { cancelOrder };
// }
