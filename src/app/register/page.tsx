"use client";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "@/config/FirebaseConfig";
import { toast } from "react-toastify";
import useAuthenticated from "@/hooks/useAuthenticated";
import { useRouter } from "next/navigation";
import { Navbar } from "../components/Navbar";

export default function Page() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("Farmer");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [willAcceptTerms, setWillAcceptTerms] = useState(false);

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
      console.log("User registered successfully!");
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error("Error registering user");
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (firstName.trim().length === 0 || lastName.trim().length === 0) {
      toast.error("Fields cannot be empty");
      return;
    }

    if (password !== repeatPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // call handle register or move the logic here

    console.log({
      firstName,
      lastName,
      email,
      userType,
      password,
      repeatPassword,
      willAcceptTerms,
    });
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

  return (
    <main>
      <Navbar />

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
          <input
            className="border-2 border-gray-300 rounded-md p-2"
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={handleFormChange}
          />
          <label htmlFor="repeatPassword">
            Repeat Password <span className="text-red-700">*</span>
          </label>
          <input
            className="border-2 border-gray-300 rounded-md p-2"
            type="password"
            id="repeatPassword"
            name="repeatPassword"
            required
            value={repeatPassword}
            onChange={handleFormChange}
          />

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
          <button className="btn-green w-full p-3" type="submit">
            Create New Account
          </button>
          <button
            className="font-bold text-primary bg-white p-3 w-full rounded-md transition-colors duration-200 hover:bg-extra-light-green"
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
