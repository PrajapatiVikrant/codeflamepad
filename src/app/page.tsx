"use client";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [actionType, setActionType] = useState<"login" | "signup" | null>(null);
  const router = useRouter()
  const validateUsername = (name: string) => {
    if (!name.trim()) return "Username is required";
    if (name.length < 3) return "Username must be at least 3 characters";
    if (name.length > 20) return "Username must be less than 20 characters";
    if (!/^[a-zA-Z0-9]+$/.test(name))
      return "Username can only contain letters and numbers";
    return "";
  };

  const validatePassword = (pass: string) => {
    if (!pass.trim()) return "Password is required";
    if (pass.length < 6) return "Password must be at least 6 characters";
    if (pass.length > 20) return "Password must be less than 20 characters";
    if (!/[A-Z]/.test(pass))
      return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(pass))
      return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(pass))
      return "Password must contain at least one number";
    if (!/[!@#$%^&*()_+\-=[\]{};':\"\\|,.<>/?]/.test(pass))
      return "Password must contain at least one special character";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    setErrors({
      username: usernameError,
      password: passwordError,
    });

    if (usernameError || passwordError || !actionType) return;

    const endpoint = actionType === "login" ? "/api/Login" : "/api/Signup";

    const toastId = toast.loading(
      actionType === "login" ? "Logging in..." : "Signing up..."
    );

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (actionType === "login") {
        if (data.token) {
          localStorage.setItem("token", data.token);
          toast.success("Login successful", { id: toastId });
          localStorage.setItem("username",username)
          router.push("/Codeflamepad")
        } else {
          toast.error(data.error || "Login failed", { id: toastId });
        }
      } else if (actionType === "signup") {
        if (data.message) {
          toast.success(data.message, { id: toastId });
        } else {
          toast.error(data.error || "Signup failed", { id: toastId });
        }
      }
    } catch (error) {
      toast.error("Something went wrong", { id: toastId });
    }

    setActionType(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 px-4">
      <Toaster  position="top-center" />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 space-y-6"
      >
        <h1 className="text-4xl font-bold text-center text-gray-800">
          CodeflamePad
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`w-full px-4 py-3 border-b outline-none text-lg ${
            errors.username ? "border-red-500" : ""
          }`}
        />
        {errors.username && (
          <p className="text-red-500 text-sm mt-1">{errors.username}</p>
        )}

        {/* Password Field with Eye Toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-3 border-b outline-none text-lg pr-12 ${
              errors.password ? "border-red-500" : ""
            }`}
          />
          <span
            className="absolute right-4 top-3.5 text-xl text-gray-600 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}

        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            type="submit"
            onClick={() => setActionType("login")}
            className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            Login
          </button>
          <button
            type="submit"
            onClick={() => setActionType("signup")}
            className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            Signup
          </button>
        </div>
      </form>
    </div>
  );
}
