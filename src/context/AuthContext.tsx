"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = getCookie("token")?.toString() || null;
    const storedAuthData = getCookie("authData");

    if (storedToken && storedAuthData) {
      try {
        const parsed = JSON.parse(storedAuthData.toString());
        setToken(storedToken);
        setUser(parsed.user);
      } catch (error) {
        console.error("Gagal memparse authData dari cookie:", error);
        deleteCookie("token");
        deleteCookie("authData");
      }
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    setCookie("token", newToken, { maxAge: 60 * 60 * 24, path: "/" });
    localStorage.setItem("authData", JSON.stringify({ user: newUser }));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    deleteCookie("token");
    localStorage.removeItem("authData");
    router.push("/login");
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext harus digunakan dalam AuthProvider");
  }
  return context;
};
