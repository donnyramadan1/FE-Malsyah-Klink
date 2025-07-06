"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { UserRoleDto, UserWithRolesDto, RoleAssignmentDto } from "@/types/userRole";

export function useUserRoles() {
  const [userRoles, setUserRoles] = useState<UserRoleDto[]>([]);
  const [usersWithRoles, setUsersWithRoles] = useState<UserWithRolesDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transformData = useCallback((userRoles: UserRoleDto[]): UserWithRolesDto[] => {
    const usersMap = new Map<number, UserWithRolesDto>();
    
    userRoles.forEach((ur) => {
      if (!ur.users || !ur.roles) return;
      
      if (!usersMap.has(ur.users.id)) {
        usersMap.set(ur.users.id, {
          ...ur.users,
          roles: []
        });
      }
      
      const user = usersMap.get(ur.users.id);
      if (user) {
        user.roles.push({
          id: ur.roles.id,
          name: ur.roles.name
        });
      }
    });
    
    return Array.from(usersMap.values());
  }, []);

  const fetchUserRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/userroles");
      setUserRoles(res.data.data);
      setUsersWithRoles(transformData(res.data.data));
    } catch (err) {
      setError("Failed to fetch user roles");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [transformData]);

  const updateRoleAssignments = useCallback(async (data: RoleAssignmentDto) => {
    setLoading(true);
    setError(null);
    try {
      // First remove all existing roles for this user
      const currentRoles = userRoles.filter(ur => ur.userId === data.userId);
      await Promise.all(
        currentRoles.map(ur => 
          api.delete(`/userroles/remove/${ur.userId}/${ur.roleId}`)
        )
      );
      
      // Then assign new roles
      await Promise.all(
        data.roleIds.map(roleId => 
          api.post("/userroles/assign", { userId: data.userId, roleId })
        )
      );
      
      await fetchUserRoles();
    } catch (err) {
      setError("Failed to update role assignments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userRoles, fetchUserRoles]);

  useEffect(() => {
    fetchUserRoles();
  }, [fetchUserRoles]);

  return {
    usersWithRoles,
    loading,
    error,
    fetchUserRoles,
    updateRoleAssignments,
  };
}