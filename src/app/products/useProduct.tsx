import React, { useEffect, useState } from "react";
import { firebaseDB } from "@/config/FirebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

import { Product } from "../interfaces/Product";

export function useGetProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firebaseDB, "products"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) =>
          Product.fromFirestore(doc.id, doc.data())
        );

        setProducts(data);
        setIsLoading(false); // Set loading to false after data is received
      }
    );

    return () => unsubscribe();
  }, []);

  return { products, isLoading };
}
