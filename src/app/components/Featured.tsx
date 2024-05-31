"use client";

import { useRouter } from "next/navigation";

interface FeaturedProps {}

const Featured: React.FC<FeaturedProps> = ({}) => {
  const router = useRouter();
  return (
    <section className="min-h-full p-6 bg-extra-light-green">
      <h3 className="text-3xl text-center font-bold mb-5">
        Featured Categories
      </h3>
      <div className="h-1 w-40 mx-auto bg-primary mb-5"></div>
      <section className="grid grid-cols-categories gap-4 place-content-center">
        <section
          className="relative cursor-pointer"
          onClick={() => {
            router.push("/products");
          }}
        >
          <span className="absolute text-primary bg-white font-bold text-2xl z-30 w-full text-center top-1/2">
            Fertilizers
          </span>
          <img
            className="filter brightness-150 hover:brightness-100 transition duration-150 rounded-md"
            src="https://res.cloudinary.com/dvuh4fz9d/image/upload/v1648390941/fertilizers1_hdthei.jpg"
            alt=""
          />
        </section>
      </section>
    </section>
  );
};

export { Featured };
