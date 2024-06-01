import React, { useEffect, useState } from "react";
import { firebaseDB } from "@/config/FirebaseConfig";
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, setDoc } from "firebase/firestore";
import { Product } from "@/interfaces/Product";
import { CartItem } from "@/interfaces/Account";
import { toast } from "react-toastify";
import { log } from "console";

export function useGetCartList(accountId: string) {
    const [cartList, setCartList] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribes: (() => void)[] = [];

        const cartUnsubscribe = onSnapshot(collection(firebaseDB, `/accounts/${accountId}/cart`), async (snapshot) => {
            const cartDocs = snapshot.docs;

            const newCartItems = await Promise.all(cartDocs.map(async (currentDoc) => {
                const productId = currentDoc.id;
                const productRef = doc(firebaseDB, `/products/${productId}`);
                const productSnapshot = await getDoc(productRef);

                if (productSnapshot.exists()) {
                    return {
                        ...productSnapshot.data(),
                        quantity: currentDoc.data().quantity,
                        productId: productId,
                        _id: productId
                    } as CartItem;
                }

                return null;
            }));

            setCartList(newCartItems.filter(item => item !== null) as CartItem[]);
            setIsLoading(false);
        });

        unsubscribes.push(cartUnsubscribe);

        // Clean up the subscriptions on unmount
        return () => {
            unsubscribes.forEach(unsubscribe => unsubscribe());
        };
    }, [accountId]);

    return { cartList, isLoading };
}


export function useAddToCart(accountId: string) {
    const addToCart = async (product: Product) => {
        try {
            if (!accountId) {
                toast.error("User not login");
                return { ok: false, message: "User does not exist" };
            }

            // check user if exists
            const userRef = doc(firebaseDB, `/accounts/${accountId}`);
            const docSnap = await getDoc(userRef);

            if (!docSnap.exists()) {
                toast.error("User not exist");
                return { ok: false, message: "User does not exist" };
            }

            // check if product already exists in cart
            const querySnapshot = await getDocs(collection(firebaseDB, `/accounts/${accountId}/cart`));
            const existingProduct = querySnapshot.docs.find((doc) => doc.id === product._id);
            if (existingProduct) {
                // remove product from cart
                await deleteDoc(doc(firebaseDB, `/accounts/${accountId}/cart/${product._id}`));
                toast.warning("Product removed from cart");
                return { ok: true, message: "Product removed from cart" };
            }

            const docRef = doc(firebaseDB, `/accounts/${accountId}/cart/${product._id}`);
            await setDoc(docRef, { quantity: 1, productId: product._id });
            toast.success("Product added to cart");
            return { ok: true, message: "Product added to cart" };
        } catch (e) {
            toast.error("Failed to add product to cart");
            return { ok: false, message: "Failed to add product to cart" };
        }
    };

    return { addToCart };
}

export function useUpdateCart(accountId: string, productId: string, quantity: number) {

    if (!accountId) {
        toast.error("User not login");
        return { ok: false, message: "User does not exist" };
    }

    const updateCart = async (quantity: number) => {
        try {

            const userRef = doc(firebaseDB, `/accounts/${accountId}`);
            const docSnap = await getDoc(userRef);

            if (!docSnap.exists()) {
                toast.error("User not exist");
                return { ok: false, message: "User does not exist" };
            }

            // check if product is out of stock
            const productRef = doc(firebaseDB, `/products/${productId}`);
            const productSnap = await getDoc(productRef);
            if (!productSnap.exists()) {
                toast("Product does not exist", { type: "error", toastId: productId });
                return;
            }

            if (productSnap.data().stock < quantity) {
                toast("Product out of stock", { type: "error", toastId: productId });
                return;
            }

            const docRef = doc(firebaseDB, `/accounts/${accountId}/cart/${productId}`);
            await setDoc(docRef, { quantity: quantity }, { merge: true });
            return;
        } catch (e) {
            return;
        }
    };

    return { updateCart };
}

export function useRemoveFromCart(accountId: string) {
    const removeFromCart = async (productId: string) => {
        try {
            await deleteDoc(doc(firebaseDB, `/accounts/${accountId}/cart/${productId}`));
            return { ok: true, message: "Product removed from cart" };
        } catch (e) {
            return { ok: false, message: "Failed to remove product from cart" };
        }
    };

    return { removeFromCart };
}

