/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth.service";
import { useAuthContext } from "@/context/AuthContext";

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

      // Tangani response bukan 200
      if (response.code !== 200 || !response.data) {
        throw new Error(response.message || "Login gagal");
      }

      // Simpan ke context dan localStorage
      contextLogin(response.data.token, response.data.user);
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem(
        "authData",
        JSON.stringify({
          user: response.data.user,
          roles: response.data.roles,
          menus: response.data.menus,
        })
      );

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
        // Error dari server (dengan response)
        const message =
          err.response?.data?.message ||
          "Login gagal. Silakan cek kembali data Anda.";
        setError(message);
      } else if (err.request) {
        // Request dikirim tapi tidak ada response (server down, timeout, dsb)
        setError(
          "Tidak dapat terhubung ke server. Silakan coba beberapa saat lagi."
        );
      } else {
        // Error lainnya (coding error, kesalahan penanganan)
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
    const token = localStorage.getItem("authToken");
    const authData = localStorage.getItem("authData");
    return !!token && !!authData;
  };

  return { handleLogin, isLoading, error, isSuccess, isAuthenticated };
};
