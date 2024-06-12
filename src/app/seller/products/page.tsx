"use client";

import { useRouter } from "next/navigation";
import {
  useAddSellerProduct,
  useDeleteProduct,
  useGetProducts,
  useGetSellerProducts,
} from "@/hooks/Products";

import { useState } from "react";
import { Product } from "@/interfaces/Product";
import { SellerProductCard } from "@/components/SellerProductCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { AddProductModal } from "@/components/AddProductModal";
import { useAuthenticated } from "@/hooks/Authentication";

export default function Page() {
  const router = useRouter();
  const { isSeller, isAuthenticated, accountId } = useAuthenticated();
  const { products, isLoading } = useGetSellerProducts(accountId || "0");
  const { deleteProduct } = useDeleteProduct();
  const { addSellerProduct, deleteImage, updateSellerProduct } =
    useAddSellerProduct();
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    router.push("/login");
  }

  if (isAuthenticated && !isSeller) {
    router.push("/");
  }

  return (
    <article className="relative">
      <h1 className="text-3xl font-semibold text-center p-3">
        {products.length > 0
          ? "My Products"
          : "You don't have any products yet."}
      </h1>
      <section className="w-full p-2 grid place-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {products.map((product: Product) => {
          return (
            <SellerProductCard
              key={product._id}
              product={product}
              onEdit={(product) => {
                setProductToEdit(product);
                setShowAddProductModal(true);
              }}
              onDelete={async (product) => {
                if (confirm("Are you sure you want to delete this product?")) {
                  if (product.imgUrl) {
                    await deleteImage(product.imgUrl);
                  }
                  deleteProduct(product._id);
                }
              }}
            />
          );
        })}
      </section>

      {showAddProductModal && (
        <AddProductModal
          editProduct={productToEdit}
          onClose={() => {
            setShowAddProductModal(false);
            setProductToEdit(null);
          }}
          onSave={(newProduct) => {
            if (productToEdit) {
              updateSellerProduct(newProduct._id, newProduct);
            } else {
              addSellerProduct(newProduct);
            }

            setProductToEdit(null);
            setShowAddProductModal(false);
          }}
        />
      )}
      <button
        onClick={() => setShowAddProductModal(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full font-bold py-3 px-5 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
      >
        +
      </button>
    </article>
  );
}
