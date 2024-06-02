"use client";

import {
  IconMenu2,
  IconSearch,
  IconHeart,
  IconShoppingCart,
  IconUserCircle,
} from "@tabler/icons-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Brand } from "./Brand";
import { Sidebar } from "./Sidebar";
import { useAuthenticated } from "@/hooks/Authentication";
import { useGetWishListProduct } from "@/hooks/WishList";
import { useGetCartList } from "@/hooks/Cart";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const { isAuthenticated, accountId, logout } = useAuthenticated();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const { wishList } = useGetWishListProduct(accountId || "0");
  const { cartList } = useGetCartList(accountId || "0");
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div>
      <nav className="h-16 w-full flex items-center lg:justify-around space-x-4 bg-gradient-to-r from-light-green to-light-blue">
        <button className="p-3 lg:hidden" onClick={toggleSidebar}>
          <IconMenu2 className="h-10 w-10" />
        </button>
        <Brand />
        <section className="hidden lg:block">
          <div className="flex justify-between relative">
            <input
              className="rounded-md p-2 pr-10" // Add padding to the right to make space for the icon
              type="text"
              placeholder="Search"
            />
            <IconSearch className="absolute top-1/2 transform -translate-y-1/2 right-2" />{" "}
          </div>
        </section>
        <section className="hidden lg:flex space-x-6">
          {isAuthenticated ? (
            <button className="btn-green" onClick={logout}>
              Logout
            </button>
          ) : (
            <button
              className="btn-green"
              onClick={() => {
                router.push("/login");
              }}
            >
              Login
            </button>
          )}
          <div
            className="relative cursor-pointer"
            onClick={() => router.push("/wishlist")}
          >
            <IconHeart className="h-10 w-10" />
            <span className="absolute bg-dark-green text-white top-0 left-5 py-0.5 px-2 rounded-full">
              {wishList.length}
            </span>
          </div>
          <div
            className="relative cursor-pointer"
            onClick={() => {
              router.push("/cart");
            }}
          >
            <IconShoppingCart className="h-10 w-10" />
            <span className="absolute bg-dark-green text-white top-0 left-5 py-0.5 px-2 rounded-full">
              {cartList.length}
            </span>
          </div>
          <IconUserCircle
            className="h-10 w-10 cursor-pointer"
            onClick={() => {
              router.push("/profile");
            }}
          />
        </section>
      </nav>
      <Sidebar isVisible={isSidebarVisible} sidebarToggler={toggleSidebar} />
    </div>
  );
};

export { Navbar };
