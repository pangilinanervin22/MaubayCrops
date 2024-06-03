"use client";

import { useRouter } from "next/navigation";
import { IconX } from "@tabler/icons-react";

import { Brand } from "./Brand";
import { useAuthenticated } from "@/hooks/Authentication";
import { useGetWishListProduct } from "@/hooks/WishList";
import { useGetCartList } from "@/hooks/Cart";

interface SidebarProps {
  isVisible: boolean;
  sidebarToggler: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible, sidebarToggler }) => {
  const { accountId, isAuthenticated, logout } = useAuthenticated();
  const { wishList } = useGetWishListProduct(accountId || "0");
  const { cartList } = useGetCartList(accountId || "0");

  const router = useRouter();

  return (
    <div
      className={`fixed inset-0 z-50 transition-transform duration-500 transform ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <aside className="bg-light-blue w-64 h-full p-4 shadow-lg">
        <section className="flex justify-between items-center mb-4">
          <Brand />

          <IconX className="cursor-pointer" onClick={sidebarToggler} />
        </section>
        <nav>
          <ul className="space-y-4">
            <li
              className="cursor-pointer p-2 rounded-md duration-500 transition-all hover:bg-green-50"
              onClick={() => {
                router.push("/products");
              }}
            >
              Show All Products
            </li>
            <li
              className="cursor-pointer p-2 rounded-md duration-500 transition-all hover:bg-green-50"
              onClick={() => {
                router.push("/cart");
              }}
            >
              {`Cart (${cartList.length})`}
            </li>
            <li
              className="cursor-pointer p-2 rounded-md duration-500 transition-all hover:bg-green-50"
              onClick={() => {
                router.push("/wishlist");
              }}
            >
              {`Wishlist (${wishList.length})`}
            </li>
            <li
              className="cursor-pointer p-2 rounded-md duration-500 transition-all hover:bg-green-50"
              onClick={() => {
                router.push("/profile");
              }}
            >
              Profile
            </li>
            <li className="mt-2">
              {isAuthenticated ? (
                <button className="btn-blue" onClick={logout}>
                  Logout
                </button>
              ) : (
                <button
                  className="btn-blue"
                  onClick={() => {
                    router.push("/login");
                  }}
                >
                  Login
                </button>
              )}
            </li>
          </ul>
        </nav>
      </aside>
      <div
        className="flex-1 bg-gray-800 bg-opacity-75"
        onClick={sidebarToggler}
      ></div>
    </div>
  );
};

export { Sidebar };
