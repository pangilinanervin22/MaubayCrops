import { firebaseDB } from '@/config/FirebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'

interface Product {
    id: string;
    title: string;
}

export function useGetProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(firebaseDB, "products"), (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setProducts(data as Product[]);
            setIsLoading(false); // Set loading to false after data is received
        });

        return () => unsubscribe();
    }, []);

    return { products, isLoading };
}
