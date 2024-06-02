"use client";

import { IconShoppingCartX } from "@tabler/icons-react";

import { CartItem } from "@/interfaces/Account";
import { useAddToCart } from "@/hooks/Cart";
import { useAuthenticated } from "@/hooks/Authentication";

interface ProductCheckoutProps {
  product: CartItem;
  quantity: number;
  onQuantityChange: (id: string, newQuantity: number) => void;
}

const ProductCheckout: React.FC<ProductCheckoutProps> = ({
  product,
  quantity,
  onQuantityChange,
}) => {
  const { accountId } = useAuthenticated();
  const { addToCart } = useAddToCart(accountId || "");
  return (
    <section className="flex flex-col md:flex-row items-center mb-4">
      <img
        className="h-32 w-32 object-cover mr-4 rounded-md"
        src={product.imgUrl}
        alt=""
      />
      <section className="flex flex-col">
        <h2 className="text-lg font-semibold text-center md:text-left mb-2">
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
            onChange={(e) => {
              if (parseInt(e.target.value) > product.quantity) {
                e.target.value = product.quantity.toString();
                return;
              }

              onQuantityChange(product._id, parseInt(e.target.value));
            }}
            className="w-16 p-1 border"
          />
        </section>
        <h3 className="text-lg font-bold text-black mb-2">₱{product.price}</h3>
        <button
          className="bg-white w-full justify-center md:w-fit text-primary transition-colors duration-200 hover:bg-extra-light-green py-1 px-3 rounded flex items-center gap-2"
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
