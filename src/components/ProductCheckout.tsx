"use client";

import Image from "next/image";
import { IconShoppingCartX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import { CartItem } from "@/interfaces/Account";
import { useAddToCart, useUpdateCart } from "@/hooks/Cart";
import { useAuthenticated } from "@/hooks/Authentication";

interface ProductCheckoutProps {
  product: CartItem;
  quantity: number;
}

const ProductCheckout: React.FC<ProductCheckoutProps> = ({
  product,
  quantity,
}) => {
  const { accountId } = useAuthenticated();
  const { addToCart } = useAddToCart(accountId || "");
  const { updateCart } = useUpdateCart();
  const router = useRouter();

  return (
    <section className="flex flex-col md:flex-row items-center mb-4">
      <Image
        className="h-32 w-32 xl:h-60 xl:w-60 object-contain mr-4 rounded-md cursor-pointer"
        src={product.imgUrl}
        alt="Product Image"
        onClick={() => {
          router.push(`/products/${product._id}`);
        }}
        width={200}
        height={200}
      />
      <section className="flex flex-col">
        <h2 className="text-lg font-semibold text-left mb-2">
          {product.title}
        </h2>
        <section className="flex items-center mb-2">
          <label htmlFor={`quantity-${product._id}`} className="mr-2">
            Quantity:
          </label>
          <input
            type="number"
            id={`quantity-${product._id}`}
            value={quantity}
            max={product.quantity}
            min={1}
            onChange={async (e) => {
              const inputQuantity = parseInt(e.target.value);
              if (inputQuantity > product.quantity) {
                return;
              }

              await updateCart(accountId, product._id, inputQuantity);
            }}
            className="w-16 p-1 border"
          />
        </section>
        <h3 className="text-lg font-bold text-black mb-2">₱{product.price}</h3>
        <button
          className="btn-light w-full justify-center md:w-fit py-1 px-3 rounded flex items-center gap-2"
          onClick={() => {
            addToCart(product);
          }}
        >
          <IconShoppingCartX />
          <span>Remove</span>
        </button>
      </section>
    </section>
  );
};

export { ProductCheckout };
