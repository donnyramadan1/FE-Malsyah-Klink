/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import {
  MenuRoleAssignmentDto,
  MenuRoleDto,
  MenuWithRolesDto,
  RoleWithMenusDto,
} from "@/types/menuRole";

export function useMenuRoles() {
  const [menuRoles, setMenuRoles] = useState<MenuRoleDto[]>([]);
  const [menusWithRoles, setMenusWithRoles] = useState<MenuWithRolesDto[]>([]);
  const [rolesWithMenus, setRolesWithMenus] = useState<RoleWithMenusDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"menus" | "roles">("menus");

  const transformData = useCallback((menuRoles: MenuRoleDto[]) => {
    // Transform for menus view
    const menusMap = new Map<number, MenuWithRolesDto>();
    // Transform for roles view
    const rolesMap = new Map<number, RoleWithMenusDto>();

    menuRoles.forEach((mr) => {
      if (!mr.menu || !mr.role) return;

      // Build menus with roles
      if (!menusMap.has(mr.menu.id)) {
        menusMap.set(mr.menu.id, {
          ...mr.menu,
          roles: [],
        });
      }
      const menu = menusMap.get(mr.menu.id);
      if (menu) {
        menu.roles.push({
          id: mr.role.id,
          name: mr.role.name,
        });
      }

      // Build roles with menus
      if (!rolesMap.has(mr.role.id)) {
        rolesMap.set(mr.role.id, {
          ...mr.role,
          menus: [],
        });
      }
      const role = rolesMap.get(mr.role.id);
      if (role) {
        role.menus.push({
          id: mr.menu.id,
          title: mr.menu.title,
        });
      }
    });

    return {
      menus: Array.from(menusMap.values()),
      roles: Array.from(rolesMap.values()),
    };
  }, []);

  const fetchMenuRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/menuroles");
      setMenuRoles(res.data.data);
      const transformed = transformData(res.data.data);
      setMenusWithRoles(transformed.menus);
      setRolesWithMenus(transformed.roles);
    } catch (err) {
      setError("Failed to fetch menu roles");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [transformData]);

  const updateMenuRoles = useCallback(
    async (data: MenuRoleAssignmentDto) => {
      setLoading(true);
      setError(null);
      try {
        // Determine if we're assigning menus to role or roles to menu
        const isRoleMode = data.roleId !== undefined;

        // First remove all existing associations
        const currentAssociations = isRoleMode
          ? menuRoles.filter((mr) => mr.roleId === data.roleId)
          : menuRoles.filter((mr) => mr.menuId === data.menuId);

        await Promise.all(
          currentAssociations.map((mr) =>
            api.delete(`/menuroles/remove/${mr.menuId}/${mr.roleId}`)
          )
        );

        // Then create new associations
        await Promise.all(
          data.targetIds.map((targetId: any) => {
            const payload = isRoleMode
              ? { menuId: targetId, roleId: data.roleId }
              : { menuId: data.menuId, roleId: targetId };
            return api.post("/menuroles/assign", payload);
          })
        );

        await fetchMenuRoles();
      } catch (err) {
        setError("Failed to update menu roles");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [menuRoles, fetchMenuRoles]
  );

  useEffect(() => {
    fetchMenuRoles();
  }, [fetchMenuRoles]);

  return {
    menusWithRoles,
    rolesWithMenus,
    viewMode,
    setViewMode,
    loading,
    error,
    fetchMenuRoles,
    updateMenuRoles,
  };
}
