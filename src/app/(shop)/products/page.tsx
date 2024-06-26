"use client";
import React, { useState, useMemo } from "react";

import { useGetProducts } from "@/hooks/Products";
import { useAuthenticated } from "@/hooks/Authentication";
import { useGetWishListProduct } from "@/hooks/WishList";
import { useGetCartList } from "@/hooks/Cart";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/interfaces/Product";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function Page() {
  const { accountId } = useAuthenticated();
  const { wishList } = useGetWishListProduct(accountId || "0");
  const { cartList } = useGetCartList(accountId || "0");
  const { products, isLoading } = useGetProducts();
  const [priceRange, setPriceRange] = useState("1500");
  // const [categories, setCategories] = useState(new Set());
  const [sortBy, setSortBy] = useState("");
  const [hideOutOfStock, setHideOutOfStock] = useState(false);
  const [search, setSearch] = useState("");

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "priceRange":
        setPriceRange(e.target.value);
        break;
        // case "categories[]":
        //   if (!e.target.checked && categories.has(e.target.id)) {
        //     categories.delete(e.target.id);
        //     setCategories(new Set(categories));
        //   } else if (e.target.checked && !categories.has(e.target.id)) {
        //     categories.add(e.target.id);
        //     setCategories(new Set(categories));
        //   }
        break;
      case "availability":
        setHideOutOfStock(e.target.checked);
        break;
    }
  };

  // ? might need for later
  const clearFilters = () => {
    setPriceRange("1500");
    // setCategories(new Set());
    setSortBy("");
    setHideOutOfStock(false);
  };

  const filteredProducts = useMemo(() => {
    return JSON.parse(
      JSON.stringify(
        products
          .filter((product) => {
            const price = product.price;
            const isAvailable = hideOutOfStock ? product.quantity > 0 : true;
            const isSearchMatch = product.title
              .toLowerCase()
              .includes(search.toLowerCase());

            return (
              price <= parseInt(priceRange) && isAvailable && isSearchMatch
            );
          })
          .sort((a, b) => {
            if (sortBy === "asc") {
              return a.price - b.price;
            } else if (sortBy === "desc") {
              return b.price - a.price;
            } else {
              return 0;
            }
          })
      )
    );
  }, [products, priceRange, hideOutOfStock, search, sortBy]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (products.length === 0) {
    return (
      <main className="min-h-screen bg-extra-light-green">
        <section className="flex justify-center items-center h-screen">
          <h1 className="text-2xl">No Products yet.</h1>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-extra-light-green">
      <section className="flex">
        <aside className="bg-light-blue text-black hidden md:block w-80 p-6 m-5 sticky top-0 rounded-md h-fit">
          <section>
            <h4>Search Product</h4>
            <input
              type="text"
              name="search"
              placeholder="Search..."
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="border border-gray-300 rounded-md p-2 mb-4"
            />
          </section>
          <div className="flex flex-col">
            <label htmlFor="priceRange">Price in ₱{priceRange}</label>
            <input
              type="range"
              name="priceRange"
              min="200"
              max="2000"
              value={priceRange}
              id="priceRange"
              className="p-0"
              onChange={handleFormChange}
            />
          </div>
          {/* <section>
            <h2>Categories</h2>
            <ul>
              <li>
                <input
                  type="checkbox"
                  id="fertilizers"
                  name="categories[]"
                  checked={categories.has("fertilizers")}
                  onChange={handleFormChange}
                />
                <label htmlFor="fertilizers">Fertilizers</label>
              </li>
              <li>
                <input
                  type="checkbox"
                  id="pesticides"
                  name="categories[]"
                  checked={categories.has("pesticides")}
                  onChange={handleFormChange}
                />
                <label htmlFor="pesticides">Pesticides</label>
              </li>
            </ul>
          </section> */}
          <section>
            <h4>Sort By Price</h4>
            <select
              name="sort"
              id="sort"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
              }}
              className="border border-gray-300 rounded-md p-4 mb-4"
            >
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </section>
          <section>
            <h5>Product Availability</h5>
            <ul>
              <li>
                <input
                  type="checkbox"
                  name="availability"
                  id="out-of-stock"
                  checked={hideOutOfStock}
                  onChange={handleFormChange}
                />
                <label htmlFor="out-of-stock">Hide out of Stock</label>
              </li>
            </ul>
          </section>
        </aside>
        <section className="w-full p-2 grid place-items-center grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product: Product) => {
            const isWishList = wishList.some(
              (wish) => wish._id === product._id
            );

            const isCartList = cartList.some(
              (cart) => cart.productId === product._id
            );
            return (
              <ProductCard
                key={product._id}
                product={product}
                accountId={accountId}
                isWishList={isWishList}
                isCart={isCartList}
              />
            );
          })}
        </section>
      </section>
    </main>
  );
}
