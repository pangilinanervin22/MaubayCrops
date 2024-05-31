"use client";

import React, { useState } from "react";
import { firebaseAuth } from "@/config/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useAuthenticated from "@/hooks/useAuthenticated";

import { Navbar } from "../components/Navbar";

interface LoginProps {
  // Add any props you need for the login component
}

export default function Page() {
  const router = useRouter();
  const { auth, isAuthenticated } = useAuthenticated();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "email":
        setEmail(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      case "rememberMe":
        setRememberMe(e.target.checked);
        break;
      default:
        break;
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!email || !password) {
        toast.error("Please enter username and password");
        return;
      }

      if (isAuthenticated) {
        toast.error("User already logged in this session will be logged out!");
        auth.signOut();
      }
      const res = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );

      // TODO: men need pa dito mag query add to `users` collection para malagyan yun, sa auth lang kasi mapupunta pag hindi nag add to users collection
      alert("User logged in successfully!");
    } catch (error) {
      alert("Error logging in:");
      toast.error("Error logging in");
    }
  };

  return (
    <main>
      <Navbar />

      <article className="min-h-screen p-5 md:grid md:place-items-center bg-extra-light-green">
        <form
          className="flex flex-col space-y-4 rounded-md p-8 w-full md:w-[28rem] h-fit bg-white"
          onSubmit={handleLogin}
        >
          <h1 className="text-center font-bold text-3xl">Login</h1>
          <label htmlFor="email">
            Email <span className="text-red-700">*</span>
          </label>
          <input
            className="border-2 border-gray-300 rounded-md p-2"
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={handleFormChange}
          />
          <label htmlFor="password">
            Password <span className="text-red-700">*</span>
          </label>
          <input
            className="border-2 border-gray-300 rounded-md p-2"
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={handleFormChange}
          />

          <h2
            className="underline font-bold text-primary cursor-pointer"
            onClick={() => {
              router.push("/forgot-password");
            }}
          >
            Forgot Password?
          </h2>
          <div className="flex gap-1">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={rememberMe}
              onChange={handleFormChange}
            />
            <label htmlFor="rememberMe">Remember Me</label>
          </div>
          <button className="btn-green w-full p-3" type="submit">
            LOGIN
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
