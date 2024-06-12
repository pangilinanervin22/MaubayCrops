"use client";

import { useState } from "react";
import { IconMenu2, IconBuildingStore, IconUsers } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import { Brand } from "@/components/Brand";
import { Sidebar } from "@/components/Sidebar";
import { useAuthenticated } from "@/hooks/Authentication";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isSeller, isLoading } = useAuthenticated();
  const router = useRouter();

  if (isSeller === false && !isLoading) router.push("/seller");

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const { isAuthenticated, logout } = useAuthenticated();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div>
      <nav className="h-16 w-full flex items-center lg:justify-around space-x-4 bg-light-blue">
        <button className="p-3 lg:hidden" onClick={toggleSidebar}>
          <IconMenu2 className="h-10 w-10" />
        </button>
        <Brand />
        <section className="hidden lg:flex space-x-6">
          <div
            className="relative cursor-pointer"
            onClick={() => router.push("/seller/products")}
          >
            <IconBuildingStore className="h-10 w-10" />
          </div>
          <div
            className="relative cursor-pointer"
            onClick={() => {
              router.push("/seller/orders");
            }}
          >
            <IconUsers className="h-10 w-10" />
          </div>
          {isAuthenticated ? (
            <button className="btn-blue" onClick={logout}>
              Logout
            </button>
          ) : (
            <button
              className="btn-blue w-fit py-3 px-2"
              onClick={() => {
                router.push("/register");
              }}
            >
              Create Seller Account
            </button>
          )}
        </section>
      </nav>
      <Sidebar isVisible={isSidebarVisible} sidebarToggler={toggleSidebar} />
    </div>
  );
};

export { Navbar };
