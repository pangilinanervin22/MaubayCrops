"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Product } from "../interfaces/Product";

interface SellerProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const SellerProductCard: React.FC<SellerProductCardProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  const isOutOfStock = product.quantity === 0;
  const router = useRouter();

  return (
    <section
      className={`h-auto w-60 relative bg-white transition-transform hover:-translate-y-2 rounded-md mb-4 ${
        isOutOfStock && "brightness-50"
      }`}
    >
      <Image
        className="rounded-t-md object-cover cursor-pointer"
        src={product.imgUrl}
        alt="product image"
        width={240}
        height={240}
        style={{ width: "100%", height: "15rem" }}
        onClick={() => {
          router.push(`/products/${product._id}`);
        }}
      />
      <section className="flex flex-col space-y-2 p-2">
        <span className="line-clamp-2">{product.title}</span>
        <span className="line-clamp-2">
          <span className="text-blue-950 font-bold">Seller:</span>{" "}
          {product.sellerName}
        </span>
        <span className="line-clamp-2">
          <span className="text-blue-950 font-bold">Stock:</span>{" "}
          {product.quantity}
        </span>
        <h6>₱{product.price}</h6>
        <button
          className="btn-light mt-auto flex justify-center w-full font-bold"
          onClick={() => {
            onEdit(product);
          }}
        >
          Edit Product
        </button>
        <button
          className="btn-red mt-auto flex justify-center w-full font-bold"
          onClick={() => {
            onDelete(product);
          }}
        >
          Delete Product
        </button>
      </section>
    </section>
  );
};

export { SellerProductCard };
