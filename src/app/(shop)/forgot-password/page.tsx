"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleResetPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO: Implement reset password logic here
  };

  return (
    <main className="min-h-screen bg-extra-light-green">
      <article className="p-5 md:grid md:place-items-center">
        <form
          className="flex flex-col space-y-4 rounded-md p-8 w-full md:w-[28rem] h-fit bg-white"
          onSubmit={handleResetPassword}
        >
          <h1 className="text-center font-bold text-3xl">Forgot Password</h1>
          <label htmlFor="email">
            Email<span className="text-red-700">*</span>
          </label>
          <input
            className="border-2 border-gray-300 rounded-md p-2"
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <button className="btn-blue w-full p-3" type="submit">
            Reset Password
          </button>
          <button
            className="font-bold text-primary bg-white p-3 w-full rounded-md transition-colors duration-200 hover:bg-extra-light-green"
            onClick={() => {
              router.push("/register");
            }}
            type="button"
          >
            Create New Account &gt;
          </button>
        </form>
      </article>
    </main>
  );
}
