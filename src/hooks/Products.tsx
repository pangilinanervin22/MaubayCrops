import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { getAuth } from "firebase/auth";

import Account from "@/interfaces/Account";
import { Product } from "@/interfaces/Product";
import { firebaseDB, firebaseStorage } from "@/config/FirebaseConfig";

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
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { products, isLoading };
}

export function useGetSellerProducts(sellerId: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!sellerId) return;

    const q = query(
      collection(firebaseDB, "products"),
      where("sellerId", "==", sellerId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) =>
        Product.fromFirestore(doc.id, doc.data())
      );

      setProducts(data);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [sellerId]);

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

export function useAddSellerProduct() {
  const auth = getAuth();
  const user = auth.currentUser;

  const addSellerProduct = async (product: Product) => {
    try {
      if (!user) {
        return { error: true, message: "User not authenticated" };
      }

      const q = query(
        collection(firebaseDB, "accounts"),
        where("uid", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length > 0) {
        const check = await verifyProductExists(product.title);

        if (check) {
          return { error: true, message: "Product name already exists" };
        }

        const newProduct = product.copyWith({
          sellerId: querySnapshot.docs[0].id,
          sellerName: (querySnapshot.docs[0].data() as Account).name,
        });

        await addDoc(
          collection(firebaseDB, "products"),
          newProduct.toFirestore()
        );

        return { error: false, message: "Product added successfully" };
      }
      return { error: true, message: "User data not found" };
    } catch (e) {
      console.error(e);
      return {
        error: true,
        message: "An error occurred while adding the product",
      };
    }
  };

  const updateSellerProduct = async (
    productId: string,
    updatedProduct: Product
  ) => {
    try {
      if (!user) {
        return { error: true, message: "User not authenticated" };
      }

      const q = query(
        collection(firebaseDB, "accounts"),
        where("uid", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length > 0) {
        const productDoc = doc(firebaseDB, "products", productId);

        await updateDoc(productDoc, updatedProduct.toFirestore());

        return { error: false, message: "Product updated successfully" };
      }
      return { error: true, message: "User data not found" };
    } catch (e) {
      console.error(e);
      return {
        error: true,
        message: "An error occurred while updating the product",
      };
    }
  };

  const uploadImage = async (file: File, productId: string) => {
    console.log("uploading image");
    try {
      const storageRef = ref(
        firebaseStorage,
        `product_images/${file.name.replace(/\s+/g, "_").toLowerCase()}`
      );

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return { success: true, downloadURL };
    } catch (error) {
      console.error(error);
      return { error: true, message: error };
    }
  };
  const deleteImage = async (imageUrl: string) => {
    try {
      const storageRef = ref(firebaseStorage, imageUrl);
      await deleteObject(storageRef);
      return { success: true };
    } catch (error) {
      console.error(error);
      return { error: true, message: error };
    }
  };

  return { addSellerProduct, updateSellerProduct, uploadImage, deleteImage };
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
      const productRef = doc(firebaseDB, "products", updatedProduct._id);
      //TODO: Update product data
      // await updateDoc(productRef, { name: updatedProduct.title });

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

export async function verifyProductExists(
  productName: string
): Promise<boolean> {
  try {
    const snapshot = await getDocs(collection(firebaseDB, "products"));
    const foundProduct = snapshot.docs.find(
      (doc) => doc.data().name === productName
    );

    return !!foundProduct;
  } catch (e) {
    return false;
  }
}
