"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center bg-extra-light-green p-6">
      <section className="flex flex-col items-center justify-center mb-8 bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-4xl font-bold mb-4 text-green-700">My Profile</h1>
        <Image
          className="rounded-[100%] h-40 w-40 object-cover mb-4 border-4"
          alt="Profile Image"
          src={
            "https://static.vecteezy.com/system/resources/thumbnails/022/963/918/small_2x/ai-generative-cute-cat-isolated-on-solid-background-photo.jpg"
          }
          height={200}
          width={200}
        />
        <section className="flex flex-wrap space-y-1">
          <button
            className="btn-green w-full py-3"
            onClick={() => {
              router.push("/cart");
            }}
          >
            Go to Cart
          </button>
          <button
            className="btn-light"
            onClick={() => {
              router.push("/wishlist");
            }}
          >
            Go to Wishlists
          </button>
        </section>
      </section>

      <section className="flex flex-col items-start mb-8 bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4 text-green-700">
          Contact Information
        </h2>
        <p className="text-gray-700 mb-2">
          <strong>Email:</strong> myemail@example.com
        </p>
        <p className="text-gray-700">
          <strong>Phone:</strong> (123) 456-7890
        </p>
      </section>

      <section className="flex flex-col items-start bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4 text-green-700">
          Pending Orders
        </h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Order #12345</li>
          <li>Order #67890</li>
          <li>Order #12345</li>
          <li>Order #67890</li>
        </ul>
      </section>
    </main>
  );
}
