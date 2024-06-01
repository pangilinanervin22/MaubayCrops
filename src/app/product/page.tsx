"use client";
import { useGetProducts } from '@/hooks/Products';
import React from 'react'

export default function Page() {
    const { products, isLoading } = useGetProducts();
    return (
        <div>
            <h2>Products</h2>
            {isLoading && <p>Loading...</p>}
            <ul>
                {products.map((product) => (
                    <li key={product._id}>{product.title}</li>
                ))}
            </ul>
        </div>
    )
}
