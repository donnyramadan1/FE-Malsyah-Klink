export const getAuthMenus = () => {
  if (typeof window === "undefined") return [];
  const authData = localStorage.getItem("authData");
  if (!authData) return [];
  try {
    const parsed = JSON.parse(authData);
    return parsed.menus || [];
  } catch {
    return [];
  }
};
