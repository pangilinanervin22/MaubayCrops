"use client";
import { Navbar } from '@/components/Navbar';
import { useAuthenticated } from '@/hooks/Authentication';
import { useGetWishListProduct } from '@/hooks/WishList';
import { useRouter } from 'next/navigation';
import React from 'react'

export default function Page() {
    const router = useRouter();
    const { isAuthenticated, isLoading, accountId } = useAuthenticated();
    const { wishList } = useGetWishListProduct(accountId || "0");



    console.log(wishList, accountId);
    console.log(wishList[0]);

    if (!isAuthenticated && !isLoading) {
        router.push("/login");
    }

    return (
        <div>
            <Navbar />
            <h1>Wishlist</h1>
            <ul>
                {wishList.map((product: any) => (
                    <li key={product._id}>
                        {product.title}
                        <h1>wew</h1>
                    </li>
                ))}
            </ul>
        </div>
    )
}
