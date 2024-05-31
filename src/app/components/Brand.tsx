"use client";

interface BrandProps {}

const Brand: React.FC<BrandProps> = ({}) => {
  return (
    <span className="text-2xl font-bold">
      <span className="text-primary">Agro</span>
      <span className="text-dark-brown">Stores</span>
    </span>
  );
};

export { Brand };
