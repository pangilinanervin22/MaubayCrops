import React, { useEffect, useState } from "react";
import { firebaseDB } from "@/config/FirebaseConfig";
import { collection, deleteDoc, doc, getDocs, onSnapshot } from "firebase/firestore";
import { Product } from "@/interfaces/Product";


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

export function useGetProduct(productId: string) {
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            doc(firebaseDB, "products", productId),
            (doc) => {
                if (doc.exists()) {
                    setProduct(Product.fromFirestore(doc.id, doc.data()));
                } else {
                    setProduct(null);
                }
                setIsLoading(false); // Set loading to false after data is received
            }
        );

        return () => unsubscribe();
    }, [productId]);

    return { product, isLoading };
}

export function useAddProduct() {
    const addProduct = async (name: string) => {
        try {

            const check = await verifyProductExists(name);
            if (check) {
                return { error: true, message: "Product name already exists" };
            }
            //TODO: Add product data
            // await addDoc(collection(firebaseDB, "products"), { name });
            return { ok: true, message: "Product added successfully" };
        } catch (e) {
            console.log(e);
            return { error: true, message: "Error adding product" };
        }
    };

    return { addProduct };
}

export function useUpdateProduct() {
    const updateProduct = async (updatedProduct: Product) => {
        if (!updatedProduct || !updatedProduct._id) {
            return { error: true, message: "Invalid product id" };
        }

        const check = await verifyProductExists(updatedProduct._id);
        if (check) {
            return { error: true, message: "Product name already exists" };
        }

        try {
            const productRef = doc(firebaseDB, 'products', updatedProduct._id);
            //TODO: Update product data
            // await updateDoc(productRef, { name: updatedProduct.title });
            console.log('Product updated', productRef.id, productRef, updatedProduct);

            return { ok: true, message: "Product updated successfully" };
        } catch (e) {
            console.error(e);
            return { error: true, message: "Error updating product" };
        }
    };

    return { updateProduct };
}

export function useDeleteProduct() {
    const deleteProduct = async (_id: string) => {

        try {
            const productRef = doc(firebaseDB, "products", _id);
            await deleteDoc(productRef);
            return { ok: true, message: `Product deleted successfully` };
        } catch (e) {
            return { error: true, message: "Error deleting product" };
        }
    };

    return { deleteProduct };
}


export async function verifyProductExists(productName: string): Promise<boolean> {
    try {
        const snapshot = await getDocs(collection(firebaseDB, "products"));
        const foundProduct = snapshot.docs.find((doc) => doc.data().name === productName);

        return !!foundProduct;
    } catch (e) {
        console.log(e);
        return false;
    }
}