"use client";

import { Hero } from "../components/Hero";
import { Featured } from "../components/Featured";

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
