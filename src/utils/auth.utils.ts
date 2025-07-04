export const getAuthData = () => {
  if (typeof window === "undefined") return null;

  const storedAuth = localStorage.getItem("authData");
  if (!storedAuth) return null;

  try {
    return JSON.parse(storedAuth);
  } catch (error) {
    console.error("Gagal memparse data auth:", error);
    return null;
  }
};

export const getAuthMenus = () => {
  const authData = getAuthData();
  return authData?.menus || [];
};

export const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
};
