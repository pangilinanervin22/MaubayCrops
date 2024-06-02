"use client";

import { IconHeart, IconShoppingCart } from "@tabler/icons-react";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useAuthenticated } from "@/hooks/Authentication";
import { useGetProduct } from "@/hooks/Products";
import { useAddWishList, useGetWishListProduct } from "@/hooks/WishList";
import { useAddToCart, useGetCartList } from "@/hooks/Cart";

export default function Page({ params }: { params: { productId: string } }) {
  const { accountId } = useAuthenticated();
  const { isLoading, product } = useGetProduct(params.productId);
  const { addWishList } = useAddWishList(accountId || "0");
  const { wishList } = useGetWishListProduct(accountId || "0");
  const { cartList } = useGetCartList(accountId || "0");
  const { addToCart } = useAddToCart(accountId || "0");

  if (isLoading) {
    // loading.tsx does not work idk
    return <LoadingSpinner />;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const isWishList = wishList.some((item) => item._id === product._id);
  const isCart = cartList.some((item) => item._id === product._id);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center px-5 lg:px-10 xl:px-20 py-6 bg-extra-light-green">
      <div className="w-full text-center">
        <img
          src={product.imgUrl}
          alt="Product Image"
          className="h-96 w-96 object-cover rounded-md mx-auto"
        />
      </div>
      <div className="w-full max-w-7xl mt-6 bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800">{product.title}</h1>
        <div className="text-lg bg-dark-green text-white w-fit py-1 px-2  rounded-sm mt-2">
          {product.rating} ★
        </div>
        <div className="text-gray-600 mt-2">
          Category: {product.categoryName}
        </div>
        <div className="flex items-center mt-4">
          <span className="text-2xl font-bold text-green-700">
            ₱{product.price}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-6">
          {isCart ? (
            <button
              className="mt-auto flex w-full font-bold bg-white text-primary min-w-fit flex-1 justify-center items-center md:max-w-10 p-2 md:px-4 md:py-2 rounded gap-1 transition-colors duration-200 hover:bg-extra-light-green hover:text-black"
              onClick={() => {
                addToCart(product);
              }}
            >
              <span>
                <IconShoppingCart />
              </span>
              <span>Remove from Cart</span>
            </button>
          ) : (
            <button
              className="flex w-full font-bold bg-green-700 text-white min-w-fit flex-1 justify-center items-center md:max-w-10 p-2 md:px-4 md:py-2 rounded gap-1 transition-colors duration-200 hover:bg-extra-light-green hover:text-black"
              onClick={() => {
                addToCart(product);
              }}
            >
              <span>
                <IconShoppingCart />
              </span>
              <span>Add to Cart</span>
            </button>
          )}
          <button
            className="text-primary border-black min-w-fit flex-1 border-2 justify-center items-center md:max-w-10 p-2 md:px-4 md:py-2 flex gap-1 rounded-md transition-colors duration-200 hover:bg-extra-light-green"
            onClick={() => {
              addWishList(product);
            }}
          >
            <IconHeart fill={isWishList ? "red" : "white"} color="red" />
            {isWishList ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Product Description</h2>
          <p className="text-gray-700 mt-2">{product.description}</p>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Product Details</h2>
          <p className="text-gray-700 mt-2">
            <strong>Brand:</strong> {product.productDetails.Brand ?? "Unknown"}
          </p>
          <p className="text-gray-700">
            <strong>Material:</strong>{" "}
            {product.productDetails.Material ?? "Unknown"}
          </p>
          <p className="text-gray-700">
            <strong>Color :</strong> {product.productDetails.Color ?? "Unknown"}
          </p>
        </div>
      </div>
    </div>
  );
}
