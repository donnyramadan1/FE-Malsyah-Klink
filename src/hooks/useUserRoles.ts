/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useUserRoles.ts
"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import api from "@/lib/api";
import { UserWithRolesDto, RoleAssignmentDto } from "@/types/userRole";
import { debounce } from "@/utils/debounce";

export function useUserRoles() {
  const [usersWithRoles, setUsersWithRoles] = useState<UserWithRolesDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] =
    useState<keyof UserWithRolesDto>("fullName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Remove pageSize state since we're not using it
  const pageSize = 10; // Define as constant since we're not changing it

  const fetchUserRoles = useCallback(
    async (page: number = 1) => {
      setLoading(true);
      setError(null);
      try {
        // Ambil data user dengan pagination dan search
        const usersRes = await api.get("/users/paged", {
          params: {
            page,
            pageSize,
            search: searchTerm,
          },
        });

        // Ambil semua user roles
        const userRolesRes = await api.get("/userroles");

        // Transform data
        const transformedData = transformData(
          usersRes.data.data.items,
          userRolesRes.data.data
        );

        setUsersWithRoles(transformedData);
        setTotalItems(usersRes.data.data.totalItems);
        setCurrentPage(page);
      } catch (err) {
        setError("Gagal mengambil data user");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, searchTerm]
  );

  const transformData = (
    users: any[],
    userRoles: any[]
  ): UserWithRolesDto[] => {
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
  };

  const updateRoleAssignments = useCallback(
    async (data: RoleAssignmentDto) => {
      setLoading(true);
      setError(null);
      try {
        // First get current roles for this user from the state
        const user = usersWithRoles.find((u) => u.id === data.userId);
        const currentRoleIds = user?.roles.map((r) => r.id) || [];

        // Determine roles to remove and add
        const rolesToRemove = currentRoleIds.filter(
          (id) => !data.roleIds.includes(id)
        );
        const rolesToAdd = data.roleIds.filter(
          (id) => !currentRoleIds.includes(id)
        );

        // Remove roles no longer needed
        await Promise.all(
          rolesToRemove.map((roleId) =>
            api
              .delete(`/userroles/remove/${data.userId}/${roleId}`)
              .catch((err) => console.error("Error removing role:", err))
          )
        );

        // Add new roles
        await Promise.all(
          rolesToAdd.map((roleId) =>
            api
              .post("/userroles/assign", { userId: data.userId, roleId })
              .catch((err) => console.error("Error assigning role:", err))
          )
        );

        // Refresh data
        await fetchUserRoles(currentPage);
      } catch (err) {
        setError("Gagal memperbarui role assignments");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [fetchUserRoles, currentPage, usersWithRoles]
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((term: string) => {
        setSearchTerm(term);
        fetchUserRoles(1);
      }, 500), // 500ms delay
    [fetchUserRoles]
  );

  const handleSearch = (term: string) => {
    debouncedSearch(term);
  };

  const handleSort = (
    field: keyof UserWithRolesDto,
    direction: "asc" | "desc"
  ) => {
    setSortField(field);
    setSortDirection(direction);
    // Implement sorting logic here if needed
  };

  useEffect(() => {
    fetchUserRoles();
  }, [fetchUserRoles]);

  return {
    usersWithRoles,
    loading,
    error,
    fetchUserRoles,
    updateRoleAssignments,
    currentPage,
    totalItems,
    pageSize,
    setCurrentPage,
    searchTerm,
    handleSearch,
    sortField,
    sortDirection,
    handleSort,
  };
}
