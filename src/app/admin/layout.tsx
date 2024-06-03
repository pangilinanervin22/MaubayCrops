"use client";

import { IconMenu2, IconBuildingStore, IconUsers } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Brand } from "@/components/Brand";
import { Sidebar } from "@/components/Sidebar";
import { useAuthenticated } from "@/hooks/Authentication";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAdmin, isLoading, isAuthenticated } = useAuthenticated();
  const router = useRouter();

  if (isAdmin === false && isLoading === false) router.push("/admin");

  return (
    <>
      {isAuthenticated && isAdmin && <Navbar />}
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
            onClick={() => router.push("/admin/orders")}
          >
            <IconBuildingStore className="h-10 w-10" />
          </div>
          <div
            className="relative cursor-pointer"
            onClick={() => {
              router.push("/admin/accounts");
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
              className="btn-blue"
              onClick={() => {
                router.push("/login");
              }}
            >
              Login
            </button>
          )}
        </section>
      </nav>
      <Sidebar isVisible={isSidebarVisible} sidebarToggler={toggleSidebar} />
    </div>
  );
};

export { Navbar };
