import React, { useEffect, useState } from "react";
import { firebaseDB } from "@/config/FirebaseConfig";
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, setDoc } from "firebase/firestore";
import { Product } from "@/interfaces/Product";
import { CartItem } from "@/interfaces/Account";
import { toast } from "react-toastify";

export function useGetCartItems(accountId: string) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(firebaseDB, `/accounts/${accountId}/cart`), async (snapshot) => {
            const newCartItems: CartItem[] = [];

            for (let currentDoc of snapshot.docs) {
                const productId = currentDoc.id;
                const userRef = doc(firebaseDB, `/products/${productId}`);
                const docSnap = await getDoc(userRef);

                if (docSnap.exists()) {
                    newCartItems.push({
                        productId: productId,
                        quantity: currentDoc.data().quantity,
                        ...docSnap.data()
                    } as CartItem);
                }
            }

            setCartItems(newCartItems);
            setIsLoading(false);
        });

        // Clean up the subscription on unmount
        return () => unsubscribe();
    }, [accountId]); // Depend on userId so it reruns the effect when userId changes

    return { cartItems, isLoading };
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
            await setDoc(docRef, { ...product });
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

