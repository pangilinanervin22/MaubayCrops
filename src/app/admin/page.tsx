"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuthenticated, useLogin } from "@/hooks/Authentication";
import { ShowPassword } from "@/components/ShowPassword";

export default function Page() {
  const router = useRouter();
  const { isAdmin, isAuthenticated, isLoading } = useAuthenticated();
  const { login } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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

      const res = await login(email, password);

      if (res.success === true) toast.success(res.message);
      else toast.error(res.message);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (isAuthenticated && isAdmin) {
    router.push("/admin/orders");
  }

  return (
    <main>
      <article className="min-h-screen p-5 md:grid md:place-items-center bg-extra-light-green">
        <form
          className="flex flex-col space-y-4 rounded-md p-8 w-full md:w-[28rem] h-fit bg-white"
          onSubmit={handleLogin}
        >
          <h1 className="text-center font-bold text-3xl">Admin Login</h1>
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
          <div className="flex justify-between relative">
            <input
              className="w-full border-2 border-gray-300 rounded-md p-2"
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              name="password"
              required
              value={password}
              onChange={handleFormChange}
            />
            <ShowPassword
              handlePasswordVisibility={() => {
                setIsPasswordVisible(!isPasswordVisible);
              }}
              isPasswordVisible={isPasswordVisible}
            />
          </div>

          {/* <h2
                        className="underline font-bold text-primary cursor-pointer"
                        onClick={() => {
                            router.push("/forgot-password");
                        }}
                    >
                        Forgot Password?
                    </h2> */}

          <button className="btn-blue w-full p-3" type="submit">
            LOGIN
          </button>
        </form>
      </article>
    </main>
  );
}
