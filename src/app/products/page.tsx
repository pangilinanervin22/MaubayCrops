"use client";
import React, { useState } from "react";
import { Navbar } from "../../components/Navbar";
import { ProductCard } from "../../components/ProductCard";
import { useGetProducts } from "@/hooks/Products";
import { useAuthenticated } from "@/hooks/Authentication";
import { useGetWishListProduct } from "@/hooks/WishList";

export default function Page() {
  const { accountId } = useAuthenticated();
  const { wishList } = useGetWishListProduct(accountId || "0");
  console.log(wishList, accountId);


  const { products, isLoading } = useGetProducts();
  const [priceRange, setPriceRange] = useState("1000");
  const [categories, setCategories] = useState(new Set());
  const [rating, setRating] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [hideOutOfStock, setHideOutOfStock] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "priceRange":
        setPriceRange(e.target.value);
        break;
      case "categories[]":
        if (!e.target.checked && categories.has(e.target.id)) {
          categories.delete(e.target.id);
          setCategories(new Set(categories));
        } else if (e.target.checked && !categories.has(e.target.id)) {
          categories.add(e.target.id);
          setCategories(new Set(categories));
        }
        break;
      case "ratings[]":
        setRating(e.target.id);
        break;
      case "availability":
        setHideOutOfStock(e.target.checked);
        break;
    }

    console.log({
      priceRange,
      categories,
      rating,
      sortBy,
      hideOutOfStock,
    });
  };

  const clearFilters = () => {
    setPriceRange("1000");
    setCategories(new Set());
    setRating("");
    setSortBy("");
    setHideOutOfStock(false);
  };

  return (
    <main className="min-h-screen bg-extra-light-green">
      <Navbar />
      <section className="flex">
        <aside className="bg-medium-green w-80 p-6 m-5 sticky top-0 rounded-md h-fit">
          <section className="flex justify-between">
            <h1>Filters</h1>

            <button onClick={clearFilters}>Clear</button>
          </section>
          <div className="flex flex-col">
            <label htmlFor="priceRange">Price in P</label>
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
          <section>
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
          </section>
          <section>
            <h3>Ratings</h3>
            <ul>
              <li>
                <input
                  type="radio"
                  name="ratings[]"
                  id="4^"
                  checked={rating === "4^"}
                  onChange={handleFormChange}
                />
                <label htmlFor="4^">4 stars & above</label>
              </li>
              <li>
                <input
                  type="radio"
                  name="ratings[]"
                  id="3^"
                  checked={rating === "3^"}
                  onChange={handleFormChange}
                />
                <label htmlFor="3^">3 stars & above</label>
              </li>
              <li>
                <input
                  type="radio"
                  name="ratings[]"
                  id="2^"
                  checked={rating === "2^"}
                  onChange={handleFormChange}
                />
                <label htmlFor="2^">2 stars & above</label>
              </li>
              <li>
                <input
                  type="radio"
                  name="ratings[]"
                  id="1^"
                  checked={rating === "1^"}
                  onChange={handleFormChange}
                />
                <label htmlFor="1^">1 star & above</label>
              </li>
            </ul>
          </section>
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
        <section className="w-full grid grid-cols-3 gap-4 mt-5 mr-5 mb-5">
          {products.map((product) => {
            const isWishList = wishList.some((wish) => wish._id === product._id);

            return (
              <ProductCard
                key={product._id}
                product={product}
                accountId={accountId}
                isWishList={isWishList}
              />
            );
          })}
        </section>
      </section>
    </main>
  );
}
