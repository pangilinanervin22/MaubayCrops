"use client";
import { useAuthenticated } from "@/hooks/Authentication";
import { useRouter } from "next/navigation";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { isAdmin, isLoading, logout } = useAuthenticated();
    const router = useRouter();


    if (isAdmin === false && isLoading === false)
        router.push('/admin');

    return (
        <>
            <h1>admin</h1>
            <button onClick={() => router.push('/admin/orders')}>Orders</button>
            <button onClick={() => router.push('/admin/accounts')}>Accounts</button>
            {isAdmin && <button onClick={logout}>Logout</button>}
            {children}
        </>
    );
}
