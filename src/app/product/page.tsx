"use client";
import React from 'react'
import { useGetProducts } from './useProduct';

export default function Page() {

    const { products, isLoading } = useGetProducts();

    return (
        <div>
            <h2>Products</h2>
            {isLoading && <p>Loading...</p>}
            <ul>
                {products.map((product) => (
                    <li key={product.id}>{product.title}</li>
                ))}
            </ul>
        </div>
    )
}
