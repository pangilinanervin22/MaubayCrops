'use client';

import { IconX } from "@tabler/icons-react";
import { Brand } from "./Brand";

 
interface SidebarProps {
    isVisible: boolean,
    sidebarToggler: () => void
}
 
const Sidebar: React.FC<SidebarProps> = ({isVisible, sidebarToggler
}) => {
  return <div
  className={`fixed inset-0 z-50 transition-transform duration-500 transform ${
    isVisible ? "translate-x-0" : "-translate-x-full"
  }`}
>
  <aside className="bg-extra-light-green w-64 h-full p-4 shadow-lg">
    <section className="flex justify-between items-center">
      <Brand />

      <IconX className="cursor-pointer" onClick={sidebarToggler} />
    </section>
    <nav>
      <ul>
        <li>
          <a href="#">Show All Products</a>
        </li>
        <li>
          <a href="#">Search Products</a>
        </li>
        <li>
          <a href="#">Cart (0)</a>
        </li>
        <li>
          <a href="#">Wishlist (10)</a>
        </li>
        <li>
          <a href="#">My Profile</a>
        </li>
        <li className="mt-2">
          <a className="btn-green p-2" href="#">Login</a>
        </li>
      </ul>
    </nav>
  </aside>
  <div
    className="flex-1 bg-gray-800 bg-opacity-75"
    onClick={sidebarToggler}
  ></div>
</div>
};
 
export { Sidebar };