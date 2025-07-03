import { LoginResponse } from "@/types/auth";

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to connect to server. Please try again later.");
  }
};

export const refreshToken = async (): Promise<{ token: string }> => {
  const response = await fetch("/api/refresh-token", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  return response.json();
};
