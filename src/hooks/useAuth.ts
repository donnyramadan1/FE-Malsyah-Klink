"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth.service";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    setError("");
    setIsSuccess(false);

    try {
      const response = await login(username, password);

      // Save to localStorage
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem(
        "authData",
        JSON.stringify({
          user: response.data.user,
          roles: response.data.roles,
          menus: response.data.menus,
        })
      );

      // Show success state
      setIsSuccess(true);

      // Add fade out animation before redirect
      await new Promise((resolve) => setTimeout(resolve, 800));
      document
        .getElementById("login-container")
        ?.classList.add("opacity-0", "transition-opacity", "duration-200");

      // Redirect after animation completes
      setTimeout(() => {
        router.push("/dashboard");
      }, 200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading, error, isSuccess };
};
