"use client";

import { useRouter } from "next/navigation";

interface HeroProps {}

const Hero: React.FC<HeroProps> = ({}) => {
  const router = useRouter();
  return (
    <section>
      <div className="bg-hero bg-cover bg-center h-hero bg-no-repeat flex items-center justify-center">
        <section className="h-full p-5 flex flex-col items-center space-y-6 lg:space-y-16">
          <h1 className="text-center text-dark-brown text-3xl font-bold lg:text-5xl ">
            One Stop Solution for your farming needs
          </h1>
          <h2 className="text-center text-blue-950 text-2xl font-bold lg:text-4xl">
            Buy Fertilizers, Insectisides, Seeds & other Agriculture Products
          </h2>
          <button
            className="bg-gradient-button px-6 py-4 text-center transition duration-500 bg-[length:200%_auto] hover:border-white hover:border-2 text-white shadow-button shadow-white rounded-md whitespace-nowrap border-2 border-primary w-40 text-xl"
            onClick={() => {
              router.push("/products");
            }}
          >
            SHOP NOW
          </button>
        </section>
      </div>
    </section>
  );
};

export { Hero };
