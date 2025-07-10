/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import {
  UserRoleDto,
  UserWithRolesDto,
  RoleAssignmentDto,
} from "@/types/userRole";
import { UserDto } from "@/types/user";

export function useUserRoles() {
  const [allUsers, setAllUsers] = useState<UserDto[]>([]);
  const [userRoles, setUserRoles] = useState<UserRoleDto[]>([]);
  const [usersWithRoles, setUsersWithRoles] = useState<UserWithRolesDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transformData = useCallback(
    (users: UserDto[], userRoles: UserRoleDto[]): UserWithRolesDto[] => {
      const userRolesMap = new Map<number, UserWithRolesDto>();

      // Pertama, buat entri untuk semua users
      users.forEach((user) => {
        userRolesMap.set(user.id, {
          ...user,
          roles: [],
        });
      });

      // Kemudian isi roles untuk user yang memiliki role
      userRoles.forEach((ur) => {
        if (!ur.users || !ur.roles) return;

        const user = userRolesMap.get(ur.users.id);
        if (user) {
          user.roles.push({
            id: ur.roles.id,
            name: ur.roles.name,
          });
        }
      });

      return Array.from(userRolesMap.values());
    },
    []
  );

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Ambil semua users dan semua user roles secara parallel
      const [usersRes, userRolesRes] = await Promise.all([
        api.get("/users"),
        api.get("/userroles"),
      ]);

      setAllUsers(usersRes.data.data);
      setUserRoles(userRolesRes.data.data);
      setUsersWithRoles(
        transformData(usersRes.data.data, userRolesRes.data.data)
      );
    } catch (err) {
      setError("Failed to fetch user data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [transformData]);

  const updateRoleAssignments = useCallback(
    async (data: RoleAssignmentDto) => {
      setLoading(true);
      setError(null);
      try {
        // First remove all existing roles for this user
        const currentRoles = userRoles.filter(
          (ur) => ur.userId === data.userId
        );
        await Promise.all(
          currentRoles.map((ur) =>
            api
              .delete(`/userroles/remove/${ur.userId}/${ur.roleId}`)
              .catch((err) => console.error("Error removing role:", err))
          )
        );

        // Then assign new roles
        await Promise.all(
          data.roleIds.map((roleId) =>
            api
              .post("/userroles/assign", { userId: data.userId, roleId })
              .catch((err) => console.error("Error assigning role:", err))
          )
        );

        // Refresh data
        await fetchAllData();
      } catch (err) {
        setError("Failed to update role assignments");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [userRoles, fetchAllData]
  );

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    usersWithRoles,
    loading,
    error,
    fetchUserRoles: fetchAllData,
    updateRoleAssignments,
  };
}
