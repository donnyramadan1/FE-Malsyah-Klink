"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { RoleDto, CreateRoleDto, UpdateRoleDto } from "@/types/role";

export function useRoles() {
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRoles = async () => {
    setLoading(true);
    const res = await api.get("/roles");
    setRoles(res.data.data);
    setLoading(false);
  };

  const createRole = async (data: CreateRoleDto) => {
    const res = await api.post("/roles", data);
    await fetchRoles();
    return res.data.data;
  };

  const updateRole = async (id: number, data: UpdateRoleDto) => {
    await api.put(`/roles/${id}`, data);
    await fetchRoles();
  };

  const deleteRole = async (id: number) => {
    await api.delete(`/roles/${id}`);
    await fetchRoles();
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    loading,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
  };
}
