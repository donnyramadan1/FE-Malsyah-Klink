/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth.service";
import { useAuthContext } from "@/context/AuthContext";
import { setCookie } from "cookies-next";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const { login: contextLogin } = useAuthContext();

  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    setError("");
    setIsSuccess(false);

    try {
      const response = await login(username, password);

      if (response.code !== 200 || !response.data) {
        throw new Error(response.message || "Login gagal");
      }

      // Simpan ke context dan cookie (di dalam AuthContext)
      contextLogin(response.data.token, response.data.user);

      setCookie("authData", JSON.stringify({
            user: response.data.user,
            roles: response.data.roles,
            menus: response.data.menus,
          }), {
            maxAge: 60 * 60 * 24, // 1 hari
            path: "/"
          });      
      setIsSuccess(true);

      const loginContainer = document.getElementById("login-container");
      if (loginContainer) {
        loginContainer.classList.add(
          "opacity-0",
          "transition-opacity",
          "duration-500"
        );
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan login";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = () => {
    // cukup rely on context
    return !!contextLogin;
  };

  return { handleLogin, isLoading, error, isSuccess, isAuthenticated };
};
