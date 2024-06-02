"use client";

import { Featured } from "@/components/Featured";
import { Hero } from "@/components/Hero";



export default function Home() {
  return (
    <main className="min-h-screen">
      <article>
        <Hero />
        <Featured />
      </article>
    </main>
  );
}
