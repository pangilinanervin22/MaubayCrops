"use client";

import { Hero } from "../components/Hero";
import { Featured } from "../components/Featured";
import { Navbar } from "../components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <article>
        <Hero />
        <Featured />
      </article>
    </main>
  );
}
