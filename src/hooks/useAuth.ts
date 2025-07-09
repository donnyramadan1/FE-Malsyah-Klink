/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth.service";
import { useAuthContext } from "@/context/AuthContext";
import Cookies from "js-cookie";

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
      // Simpan ke context dan cookies
      contextLogin(response.data.token, response.data.user);
      Cookies.set("authToken", response.data.token, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });

      Cookies.set("authUser", JSON.stringify(response.data.user), {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });

      Cookies.set("authRoles", JSON.stringify(response.data.roles), {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });

      localStorage.setItem("authMenus", JSON.stringify(response.data.menus));

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
      if (err.response) {
        const message =
          err.response?.data?.message ||
          "Login gagal. Silakan cek kembali data Anda.";
        setError(message);
      } else if (err.request) {
        setError(
          "Tidak dapat terhubung ke server. Silakan coba beberapa saat lagi."
        );
      } else {
        setError(
          err.message || "Terjadi kesalahan tak terduga. Silakan coba lagi."
        );
      }

      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = () => {
    if (typeof window === "undefined") return false;
    const token = Cookies.get("authToken");
    const authData = Cookies.get("authUser");
    return !!token && !!authData;
  };

  return { handleLogin, isLoading, error, isSuccess, isAuthenticated };
};
