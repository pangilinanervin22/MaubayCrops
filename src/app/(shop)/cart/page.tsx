"use client";

import React, { useState, useEffect } from "react";
import { useAuthenticated } from "@/hooks/Authentication";
import { useRouter } from "next/navigation";
import { useGetWishListProduct } from "@/hooks/WishList";
import { useGetCartList } from "@/hooks/Cart";
import { ProductCheckout } from "@/components/ProductCheckout";

interface Quantity {
  [key: string]: number;
}
export default function Page() {
  const router = useRouter();
  const { isAuthenticated, isLoading, accountId } = useAuthenticated();
  const { cartList } = useGetCartList(accountId || "0");

  const [quantities, setQuantities] = useState<Quantity>({});

  useEffect(() => {
    if (cartList.length > 0) {
      console.log(cartList);
      const initialQuantities = cartList.reduce((acc: Quantity, item) => {
        acc[item._id] = 1; // initial quantity is 1
        return acc;
      }, {});
      setQuantities(initialQuantities);
    }
  }, [cartList]);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: newQuantity > 0 ? newQuantity : 1,
    }));
  };

  const totalPrice = cartList.reduce((total, item) => {
    return total + item.price * (quantities[item._id] || 1);
  }, 0);

  const deliveryCharge = totalPrice > 1000 ? 0 : 100;
  const finalTotal = totalPrice + deliveryCharge;

  if (!isAuthenticated && !isLoading) {
    router.push("/login");
  }

  console.log(quantities);

  return (
    <main className="min-h-screen flex flex-col bg-extra-light-green">
      <h1 className="text-center text-primary font-bold text-2xl md:text-4xl p-6">
        {cartList.length === 0 ? "Your Cart is Empty" : "Shopping Cart"}
      </h1>
      <article className="flex flex-col items-center p-4">
        <section className="flex flex-col bg-white p-4 shadow-md w-full md:w-2/3 lg:w-1/2">
          {cartList.map((cartItem) => (
            <ProductCheckout
              key={cartItem._id}
              product={cartItem}
              quantity={quantities[cartItem._id]}
              onQuantityChange={handleQuantityChange}
            />
          ))}
          <section className="bg-white p-4 shadow-md w-full mt-4">
            <h4 className="text-lg font-semibold mb-2">Price Details</h4>
            <div className="flex justify-between mb-2">
              <span>Price ({cartList.length} Items)</span>
              <span>₱{totalPrice}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Delivery Charge</span>
              <span>₱{deliveryCharge}</span>
            </div>
            <div className="flex justify-between mb-4 text-xl font-bold text-green-600">
              <span>Total Amount</span>
              <span>₱{finalTotal}</span>
            </div>
            <div className="text-center text-purple-600 mb-4">
              FREE Home Delivery on orders above ₱1000
            </div>
            <button
              className="btn-green text-white py-2 px-4 rounded w-full"
              onClick={() => {
                // TODO: checkout logic
              }}
            >
              PROCEED TO CHECKOUT
            </button>
          </section>
        </section>
      </article>
    </main>
  );
}
