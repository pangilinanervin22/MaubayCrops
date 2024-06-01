import React, { useEffect, useState } from "react";
import { firebaseDB } from "@/config/FirebaseConfig";
import { collection, deleteDoc, doc, getDocs, onSnapshot, setDoc } from "firebase/firestore";
import { Product } from "@/interfaces/Product";
import { Wishlist } from "@/interfaces/Account";


export function useGetWishListProduct(userId: string) {
    const [wishList, setWishList] = useState<Wishlist[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(firebaseDB, `/accounts/${userId}/wishlist`), (snapshot) => {
            const newWishList: Wishlist[] = snapshot.docs.map((doc) => ({
                _id: doc.id,
                ...doc.data()
            } as Wishlist));

            setWishList(newWishList);
            setIsLoading(false);
        });

        // Clean up the subscription on unmount
        return () => unsubscribe();
    }, [userId]); // Depend on userId so it reruns the effect when userId changes

    return { wishList, isLoading };
}

export function useAddWishList(userId: string) {
    const addWishList = async (product: Product) => {
        try {
            // check if product already exists in wishlist
            const querySnapshot = await getDocs(collection(firebaseDB, `/accounts/${userId}/wishlist`));
            const existingProduct = querySnapshot.docs.find((doc) => doc.id === product._id);
            if (existingProduct) {
                // remove product from wishlist
                await deleteDoc(doc(firebaseDB, `/accounts/${userId}/wishlist/${product._id}`));
                return { ok: true, message: "Product removed from wishlist" };
            }

            const docRef = doc(firebaseDB, `/accounts/${userId}/wishlist/${product._id}`);
            await setDoc(docRef, { ...product });
            return { ok: true, message: "Product added to wishlist" };
        } catch (e) {
            return { ok: false, message: "Failed to add product to wishlist" };
        }
    };

    return { addWishList };
}

export function useRemoveWishList(userId: string) {
    const removeWishList = async (productId: string) => {
        try {
            await deleteDoc(doc(firebaseDB, `/accounts/${userId}/wishlist/${productId}`));
            return { ok: true, message: "Product removed from wishlist" };
        } catch (e) {
            return { ok: false, message: "Failed to remove product from wishlist" };
        }
    };

    return { removeWishList };
}
