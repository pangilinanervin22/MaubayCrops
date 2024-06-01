"use client";
import React from "react";
import { useAuthenticated } from "@/hooks/Authentication";
import { useRouter } from "next/navigation";

import { ProductCard } from "@/components/ProductCard";
import { useGetWishListProduct } from "@/hooks/WishList";

export default function Page() {
  const router = useRouter();
  const { isAuthenticated, isLoading, accountId } = useAuthenticated();
  const { wishList } = useGetWishListProduct(accountId || "0");

  console.log(wishList, accountId);
  console.log(wishList[0]);

  if (!isAuthenticated && !isLoading) {
    router.push("/login");
  }

  return (
    <main className="flex flex-col">
      <h1 className="text-center font-bold text-2xl md:text-4xl p-6">
        My Wishlist ({wishList.length})
      </h1>
      <section className="w-full p-2 grid place-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {wishList.map((product) => {
          const isWishList = wishList.some((wish) => wish._id === product._id);

          return (
            <ProductCard
              key={product._id}
              product={product}
              accountId={accountId}
              isWishList={isWishList}
            />
          );
        })}
      </section>
    </main>
  );
}
