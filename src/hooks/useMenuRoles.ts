"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { MenuRoleDto, AssignMenuRoleDto } from "@/types/menuRole";

export function useMenuRoles() {
  const [menuRoles, setMenuRoles] = useState<MenuRoleDto[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMenuRoles = async () => {
    setLoading(true);
    try {
      const res = await api.get("/menuroles");
      setMenuRoles(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  const assignMenuToRole = async (data: AssignMenuRoleDto) => {
    await api.post("/menuroles/assign", data);
    await fetchMenuRoles();
  };

  const removeMenuFromRole = async (menuId: number, roleId: number) => {
    await api.delete(`/menuroles/remove/${menuId}/${roleId}`);
    await fetchMenuRoles();
  };

  useEffect(() => {
    fetchMenuRoles();
  }, []);

  return {
    menuRoles,
    loading,
    fetchMenuRoles,
    assignMenuToRole,
    removeMenuFromRole,
  };
}
