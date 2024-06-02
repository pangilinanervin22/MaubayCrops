import React, { useEffect, useState } from "react";
import { firebaseDB } from "@/config/FirebaseConfig";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, setDoc, updateDoc, writeBatch } from "firebase/firestore";
import { Product } from "@/interfaces/Product";
import { toast } from "react-toastify";
import { Order, OrderItem } from "@/interfaces/Account";
import { Address } from "@/interfaces/Account";

export function useGetOrderList(accountId: string) {
    const [orderList, setOrderList] = useState<OrderItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(firebaseDB, `/accounts/${accountId}/order`),
            async (snapshot) => {
                const newOrderList = snapshot.docs.map((doc) => {
                    return {
                        ...doc.data(),
                        _id: doc.id,
                        orderItemQuantity: doc.data().orderItemQuantity,
                    } as OrderItem;
                });

                setOrderList(newOrderList);
                setIsLoading(false);
            }
        );

        // Clean up the subscription on unmount
        return () => unsubscribe();
    }, [accountId]); // Depend on accountId so it reruns the effect when accountId changes

    return { orderList, isLoading };
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
                const productRef = doc(firebaseDB, `/products/${cartItem.data().productId}`);
                const productSnap = await getDoc(productRef);

                if (productSnap.exists()) {
                    const newQuantity = productSnap.data().quantity - cartItem.data().quantity;

                    if (newQuantity < 0 || cartItem.data().quantity > productSnap.data().quantity) {
                        toast.error("Not enough stock for product " + productSnap.data().name);
                        return { ok: false, message: "Not enough stock" };
                    }

                    productRefArray.push(productRef);
                    orderItemList.push({
                        ...productSnap.data() as Product,
                        _id: productSnap.id,
                        productId: productSnap.data().productId,
                        orderItemQuantity: cartItem.data().quantity,
                    });

                    batch.update(productRef, { quantity: newQuantity });
                    batch.delete(doc(firebaseDB, `/accounts/${accountId}/cart/${cartItem.id}`));
                }
            }

            await batch.commit();
            let totalPrice = orderItemList.reduce((acc, product) => acc + product.price, 0);
            if (totalPrice < 1000) totalPrice = totalPrice + 100; // Add delivery fee if total price is less than 1000

            const order: Order = {
                _id: "",
                orderItems: orderItemList,
                orderTotal: totalPrice,
                orderStatus: "Pending",
                orderDate: new Date(),
                orderAddress: address,
            };

            await addDoc(collection(firebaseDB, `/accounts/${accountId}/order`), order);
            toast.success("Order placed successfully");
            return { ok: true, message: "Order placed successfully" };
        } catch (e) {
            console.log(e);

            toast.error("Failed to place order");
            return { ok: false, message: "Failed to place order" };
        }
    };

    return { placeOrder };
}

export function useCancelOrder(accountId: string) {
    const cancelOrder = async (productId: string) => {
        try {
            await deleteDoc(doc(firebaseDB, `/accounts/${accountId}/order/${productId}`));
            toast.warning("Order cancelled");
            return { ok: true, message: "Order cancelled" };
        } catch (e) {
            return { ok: false, message: "Failed to cancel order" };
        }
    };

    return { cancelOrder };
}
