"use client";

import { IconHeart, IconStar, IconShoppingCart } from "@tabler/icons-react";

import { IProduct } from "../interfaces/Product";
import { useAddWishList } from "@/hooks/WishList";
import { useAddToCart } from "@/hooks/Cart";

interface ProductCardProps {
  key: string;
  product: IProduct;
  accountId: string;
  isWishList: boolean;
  isCart: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  key,
  product,
  accountId,
  isWishList,
  isCart,
}) => {
  const { addWishList } = useAddWishList(accountId || "");
  const { addToCart } = useAddToCart(accountId || "");

  return (
    <section
      key={key}
      className=" h-fit relative bg-white transition-transform hover:-translate-y-2 rounded-md"
    >
      <span className="absolute text-white bg-green-900 p-2 rounded-md mt-5 ml-5 bg-opacity-65">
        Best Seller
      </span>
      <button
        className="absolute h-12 w-12 top-0 right-0 grid place-content-center"
        onClick={() => {
          addWishList(product);
        }}
      >
        <IconHeart color="red" fill={isWishList ? "red" : "transparent"} />
      </button>
      <img
        className="rounded-t-md h-60 w-full object-cover"
        src={product.imgUrl}
        alt="product image"
      />
      <section className="flex flex-col space-y-2 p-2">
        <span className="line-clamp-3 ">{product.title}</span>
        <div className="flex space-x-2 rounded-sm bg-dark-green text-white w-fit p-2">
          <span>{`${product.rating}`}</span>
          <IconStar fill="white" />
        </div>

        <h6>₱{product.price}</h6>

        {isCart ? (
          <button className="mt-auto btn-red flex justify-center w-full">
            <span>
              <IconShoppingCart />
            </span>
            <span onClick={() => {
              addToCart(product);
            }}>Remove from Cart</span>
          </button>
        ) : (
          <button className="mt-auto btn-green flex justify-center w-full">
            <span>
              <IconShoppingCart />
            </span>
            <span onClick={() => {
              addToCart(product);
            }}>Add to Cart</span>
          </button>
        )}
      </section>
    </section>
  );
};

export { ProductCard };
