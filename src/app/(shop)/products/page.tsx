"use client";
import React, { useState } from "react";
import { useGetProducts } from "@/hooks/Products";
import { useAuthenticated } from "@/hooks/Authentication";
import { useGetWishListProduct } from "@/hooks/WishList";
import { useAddToCart, useGetCartList } from "@/hooks/Cart";
import { ProductCard } from "@/components/ProductCard";

export default function Page() {
  const { accountId } = useAuthenticated();
  const { wishList } = useGetWishListProduct(accountId || "0");
  const { cartList } = useGetCartList(accountId || "0");
  const { products, isLoading } = useGetProducts();
  const [priceRange, setPriceRange] = useState("1500");
  // const [categories, setCategories] = useState(new Set());
  const [rating, setRating] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [hideOutOfStock, setHideOutOfStock] = useState(false);

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

  const clearFilters = () => {
    setPriceRange("1500");
    // setCategories(new Set());
    setSortBy("");
    setHideOutOfStock(false);
  };

  let filteredProducts = structuredClone(products.filter((product) => {
    const price = product.price;
    // const hasCategory = categories.size
    //   ? categories.has(product.categoryName.toLowerCase())
    //   : true;
    const isAvailable = hideOutOfStock
      ? product.quantity > 0
      : true;

    return (
      price <= parseInt(priceRange) &&
      // hasCategory &&
      isAvailable
    );
  }).sort((a, b) => {
    if (sortBy === "asc") {
      return a.price - b.price;
    } else if (sortBy === "desc") {
      return b.price - a.price;
    } else {
      return 0;
    }
  }));

  return (
    <main className="min-h-screen bg-extra-light-green">
      <section className="flex">
        <aside className="bg-medium-green hidden md:block w-80 p-6 m-5 sticky top-0 rounded-md h-fit">
          <section className="flex justify-between">
            <h1>Filters</h1>

            <button onClick={clearFilters}>Clear</button>
          </section>
          <div className="flex flex-col">
            <label htmlFor="priceRange">Price in P{priceRange}</label>
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
        <section className="w-full p-2 grid place-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {filteredProducts.map((product) => {
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
