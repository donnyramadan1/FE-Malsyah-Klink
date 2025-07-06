"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { MenuDto, CreateMenuDto, UpdateMenuDto } from "@/types/menu";

export function useMenus() {
  const [menus, setMenus] = useState<MenuDto[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMenus = async () => {
    setLoading(true);
    const res = await api.get("/menus");
    setMenus(res.data.data);
    setLoading(false);
  };

  const createMenu = async (data: CreateMenuDto) => {
    const res = await api.post("/menus", data);
    await fetchMenus();
    return res.data.data;
  };

  const updateMenu = async (id: number, data: UpdateMenuDto) => {
    await api.put(`/menus/${id}`, data);
    await fetchMenus();
  };

  const deleteMenu = async (id: number) => {
    await api.delete(`/menus/${id}`);
    await fetchMenus();
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  return {
    menus,
    loading,
    fetchMenus,
    createMenu,
    updateMenu,
    deleteMenu,
  };
}
