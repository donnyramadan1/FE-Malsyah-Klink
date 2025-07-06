"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { UserRoleDto, AssignUserRoleDto } from "@/types/userRole";

export function useUserRoles() {
  const [userRoles, setUserRoles] = useState<UserRoleDto[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUserRoles = async () => {
    setLoading(true);
    try {
      const res = await api.get("/userroles");
      setUserRoles(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  const assignRoleToUser = async (data: AssignUserRoleDto) => {
    await api.post("/userroles/assign", data);
    await fetchUserRoles();
  };

  const removeRoleFromUser = async (userId: number, roleId: number) => {
    await api.delete(`/userroles/remove/${userId}/${roleId}`);
    await fetchUserRoles();
  };

  useEffect(() => {
    fetchUserRoles();
  }, []);

  return {
    userRoles,
    loading,
    fetchUserRoles,
    assignRoleToUser,
    removeRoleFromUser,
  };
}
