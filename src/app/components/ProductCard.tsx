"use client";

import { IconHeart, IconStar, IconShoppingCart } from "@tabler/icons-react";

import { IProduct } from "../interfaces/Product";

interface ProductCardProps {
  key: string;
  product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ key, product }) => {
  return (
    <section
      key={key}
      className=" h-fit relative bg-white transition-transform hover:-translate-y-2 rounded-md"
    >
      <span className="absolute text-white bg-green-900 p-2 rounded-md mt-5 ml-5 bg-opacity-65">
        Best Seller
      </span>
      {/* HEART BUTTON */}
      <button className="absolute h-12 w-12 top-0 right-0 grid place-content-center">
        <IconHeart className="" color="red" />
      </button>
      <img
        className="rounded-t-md h-60 w-full object-cover"
        src={product.imgUrl}
        alt=""
      />
      <section className="flex flex-col space-y-2 p-2">
        <span className="line-clamp-3 ">{product.title}</span>
        <div className="flex space-x-2 rounded-sm bg-dark-green text-white w-fit p-2">
          <span>{`${product.rating}`}</span>
          <IconStar fill="white" />
        </div>

        <h6>₱{product.price}</h6>

        <button className="mt-auto btn-green flex justify-center w-full">
          <span>
            <IconShoppingCart />
          </span>
          <span>Add to Cart</span>
        </button>
      </section>
    </section>
  );
};

export { ProductCard };
