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
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    // Jika response bukan 2xx, tetap kembalikan LoginResponse dengan kode yang sesuai
    if (!response.ok) {
      return {
        code: response.status,
        message: data?.message || "Login gagal",
      };
    }

    return {
      code: 200,
      message: data?.message || "Login berhasil",
      data: data?.data,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      code: 0,
      message: "Gagal terhubung ke server. Silakan coba lagi beberapa saat.",
    };
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
