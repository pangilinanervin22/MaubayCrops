"use client";

import { useAuthenticated } from "@/hooks/Authentication";
import { useRouter } from "next/navigation";

import { Featured } from "@/components/Featured";
import { Hero } from "@/components/Hero";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function Home() {
  const router = useRouter();
  const { isSeller, isLoading, isAuthenticated } = useAuthenticated();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated && isSeller) {
    router.push("/seller");
  }

  return (
    <main className="min-h-screen">
      <article>
        <Hero />
        <Featured />
      </article>
    </main>
  );
}
