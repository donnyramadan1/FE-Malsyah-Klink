"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

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
    const storedToken = Cookies.get("authToken");
    const storedUser = Cookies.get("authUser");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser).user;
        setToken(storedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error("Gagal memparse data user:", error);
        Cookies.remove("authToken");
        Cookies.remove("authUser");
        Cookies.remove("authRoles");
        localStorage.removeItem("authMenus");
      }
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    // Set cookie dengan expiry 1 hari
    Cookies.set("authToken", newToken, {
      expires: 1,
      secure: true,
      sameSite: "strict",
    });
    Cookies.set("authUser", JSON.stringify({ user: newUser }), {
      expires: 1,
      secure: true,
      sameSite: "strict",
    });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    Cookies.remove("authToken");
    Cookies.remove("authUser");
    Cookies.remove("authRoles");
    localStorage.removeItem("authMenus");
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
  if (context === undefined) {
    throw new Error("useAuthContext harus digunakan dalam AuthProvider");
  }
  return context;
};
