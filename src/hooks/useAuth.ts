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

      if (response.code !== 200 || !response.data) {
        throw new Error(response.message || "Login gagal");
      }

      // Simpan data
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

      // Tampilkan indikator sukses
      setIsSuccess(true);

      // Trigger animasi
      const loginContainer = document.getElementById("login-container");
      if (loginContainer) {
        loginContainer.classList.add(
          "opacity-0",
          "transition-opacity",
          "duration-500"
        );

        // Redirect setelah animasi selesai
        setTimeout(() => {
          router.push("/dashboard");
        }, 500); // Sesuaikan dengan durasi animasi
      } else {
        // Fallback jika element tidak ditemukan
        router.push("/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login gagal. Silakan coba lagi nanti."
      );
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
