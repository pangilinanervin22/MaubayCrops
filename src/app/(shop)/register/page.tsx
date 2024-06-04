"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import Account from "@/interfaces/Account";
import { useAuthenticated, useRegisterAccount } from "@/hooks/Authentication";
import { ShowPassword } from "@/components/ShowPassword";

export default function Page() {
  const { registerAccount } = useRegisterAccount();
  const { isAuthenticated } = useAuthenticated();

  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("Farmer");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [willAcceptTerms, setWillAcceptTerms] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      firstName.trim().length === 0 ||
      lastName.trim().length === 0 ||
      email.trim().length === 0 ||
      password.trim().length === 0 ||
      repeatPassword.trim().length === 0
    ) {
      toast.error("Fields cannot be empty");
      return;
    }

    // check if email is valid
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email address");
      return;
    } else if (password !== repeatPassword) {
      toast.error("Passwords do not match");
      return;
    } else if (!willAcceptTerms) {
      toast.error("Please accept terms and conditions");
      return;
    }

    try {
      const account: Account = {
        email,
        password,
        name: `${firstName} ${lastName}`,
        userType: userType as "Farmer" | "Seller", // Update the type of userType
        address: [],
      };

      const res = await registerAccount(account);
      if (res.success) {
        toast.success(res.message);
        router.push("/login");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Error registering user");
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "firstName":
        setFirstName(e.target.value);
        break;
      case "lastName":
        setLastName(e.target.value);
        break;
      case "email":
        setEmail(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      case "repeatPassword":
        setRepeatPassword(e.target.value);
        break;
      case "termsAndCondition":
        setWillAcceptTerms(e.target.checked);
        break;
      default:
        break;
    }
  };

  const handlePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  useEffect(() => {
    if (isAuthenticated) router.push("/");
  }, [isAuthenticated]);

  return (
    <main>
      {/* <Navbar /> */}

      <article className="min-h-screen p-5 md:grid md:place-items-center bg-extra-light-green">
        <form
          className="flex flex-col space-y-2 rounded-md p-8 w-full md:w-[28rem] h-fit bg-white"
          onSubmit={handleFormSubmit}
        >
          <h1 className="text-center font-bold text-3xl">Sign Up</h1>
          <label htmlFor="firstName">
            First Name<span className="text-red-700">*</span>
          </label>
          <input
            className="border-2 border-gray-300 rounded-md p-2"
            type="text"
            id="firstName"
            name="firstName"
            required
            value={firstName}
            onChange={handleFormChange}
          />
          <label htmlFor="lastName">
            Last Name<span className="text-red-700">*</span>
          </label>
          <input
            className="border-2 border-gray-300 rounded-md p-2"
            type="text"
            id="lastName"
            name="lastName"
            required
            value={lastName}
            onChange={handleFormChange}
          />
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
            onChange={handleFormChange}
          />
          <label htmlFor="userType">
            User Type:<span className="text-red-700">*</span>
          </label>
          <select
            className="border-2 border-gray-300 rounded-md p-2"
            name="userType"
            id="userType"
            required
            value={userType}
            onChange={(e) => {
              console.log(e.target.value);
              setUserType(e.target.value);
            }}
          >
            <option value="Farmer">Farmer</option>
            <option value="Seller">Seller</option>
          </select>
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
              handlePasswordVisibility={handlePasswordVisibility}
              isPasswordVisible={isPasswordVisible}
            />
          </div>
          <label htmlFor="repeatPassword">
            Repeat Password <span className="text-red-700">*</span>
          </label>
          <div className="flex justify-between relative">
            <input
              className="w-full border-2 border-gray-300 rounded-md p-2"
              type={isPasswordVisible ? "text" : "password"}
              id="repeatPassword"
              name="repeatPassword"
              required
              value={repeatPassword}
              onChange={handleFormChange}
            />
            <ShowPassword
              handlePasswordVisibility={handlePasswordVisibility}
              isPasswordVisible={isPasswordVisible}
            />
          </div>

          <div className="flex gap-1">
            <input
              type="checkbox"
              id="termsAndCondition"
              name="termsAndCondition"
              required
              checked={willAcceptTerms}
              onChange={handleFormChange}
            />
            <label htmlFor="termsAndCondition">
              I accept all Terms and Conditions{" "}
              <span className="text-red-700">*</span>
            </label>
          </div>
          <button className="btn-blue w-full p-3" type="submit">
            Create New Account
          </button>
          <button
            className="btn-light"
            onClick={() => {
              router.push("/login");
            }}
            type="button"
          >
            Already have an account? &gt;
          </button>
        </form>
      </article>
    </main>
  );
}
