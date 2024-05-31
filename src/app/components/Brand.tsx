"use client";

import { useRouter } from "next/navigation";

interface BrandProps {}

const Brand: React.FC<BrandProps> = ({}) => {
  const router = useRouter();

  return (
    <span
      className="text-2xl font-bold cursor-pointer"
      onClick={() => {
        router.push("/");
      }}
    >
      <span className="text-primary">Agro</span>
      <span className="text-dark-brown">Stores</span>
    </span>
  );
};

export { Brand };
