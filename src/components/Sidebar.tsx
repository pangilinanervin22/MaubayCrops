"use client";

import { useRouter } from "next/navigation";

import { IconX } from "@tabler/icons-react";
import { Brand } from "./Brand";

interface SidebarProps {
  isVisible: boolean;
  sidebarToggler: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible, sidebarToggler }) => {
  const router = useRouter();
  return (
    <div
      className={`fixed inset-0 z-50 transition-transform duration-500 transform ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <aside className="bg-extra-light-green w-64 h-full p-4 shadow-lg">
        <section className="flex justify-between items-center mb-4">
          <Brand />

          <IconX className="cursor-pointer" onClick={sidebarToggler} />
        </section>
        <nav>
          <ul className="space-y-4">
            <li className="cursor-pointer p-2 rounded-md duration-500 transition-all hover:bg-green-50">
              Show All Products
            </li>
            <li className="cursor-pointer p-2 rounded-md duration-500 transition-all hover:bg-green-50">
              Search Products
            </li>
            <li className="cursor-pointer p-2 rounded-md duration-500 transition-all hover:bg-green-50">
              Cart (0)
            </li>
            <li className="cursor-pointer p-2 rounded-md duration-500 transition-all hover:bg-green-50">
              Wishlist(10)
            </li>
            <li className="cursor-pointer p-2 rounded-md duration-500 transition-all hover:bg-green-50">
              Profile
            </li>
            <li className="mt-2">
              <button
                className="btn-green px-4 py-2"
                onClick={() => {
                  router.push("/login");
                }}
              >
                Login
              </button>
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
