export interface LoginResponse {
  code: number;
  message?: string;
  data?: {
    token: string;
    user: {
      id: number;
      username: string;
      fullName: string;
      email: string;
    };
    roles: {
      id: number;
      name: string;
    };
    menus: Array<{
      id: number;
      parentId: number | null;
      title: string;
      icon: string;
      path: string;
      orderNum: number;
      isActive: boolean;
    }>;
  };
}

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
      throw new Error(errorData.message || "Login gagal");
    }

    return response.json();
  } catch (error) {
    console.error("Error API:", error);
    throw new Error(
      "Gagal terhubung ke server. Silakan coba lagi beberapa saat."
    );
  }
};

export const refreshToken = async (): Promise<{ token: string }> => {
  const response = await fetch("/api/refresh-token", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Gagal memperbarui token");
  }

  return response.json();
};
