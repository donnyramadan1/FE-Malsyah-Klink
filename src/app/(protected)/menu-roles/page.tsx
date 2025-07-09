/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiCheckSquare,
  FiSquare,
  FiSave,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import api from "@/lib/api";
import { RoleDto } from "@/types/role";
import { MenuDto } from "@/types/menu";
import { MenuRoleDto } from "@/types/menuRole";
import Swal from "sweetalert2";

type MenuWithChildren = MenuDto & {
  children: MenuWithChildren[];
  isExpanded?: boolean;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type AssignMenuRoleDto = {
  roleId: number;
  menuId: number;
};

export default function MenuRolePage() {
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [menus, setMenus] = useState<MenuWithChildren[]>([]);
  const [menuRoles, setMenuRoles] = useState<MenuRoleDto[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [checkedMenuIds, setCheckedMenuIds] = useState<number[]>([]);
  const [loading, setLoading] = useState({
    initial: true,
    submit: false,
  });
  const [selectAll, setSelectAll] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading((prev) => ({ ...prev, initial: true }));

        const [rolesRes, menusRes, menuRolesRes] = await Promise.all([
          api.get<ApiResponse<RoleDto[]>>("/roles"),
          api.get<ApiResponse<MenuDto[]>>("/menus"),
          api.get<ApiResponse<MenuRoleDto[]>>("/menuroles"),
        ]);

        setRoles(rolesRes.data.data);
        setMenuRoles(menuRolesRes.data.data);

        // Transform flat menus to tree structure
        const flatMenus = menusRes.data.data;
        const menuTree = buildMenuTree(flatMenus);
        setMenus(menuTree);        
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal memuat data",
          text: "Silakan coba lagi",
          timer: 3000,
        });
      } finally {
        setLoading((prev) => ({ ...prev, initial: false }));
      }
    };

    fetchInitialData();
  }, []);

  // Build menu tree structure with proper typing
  const buildMenuTree = (
    flatMenus: MenuDto[],
    parentId: number | null = null
  ): MenuWithChildren[] => {
    return flatMenus
      .filter((menu) => menu.parentId === parentId)
      .sort((a, b) => (a.orderNum || 0) - (b.orderNum || 0))
      .map((menu) => ({
        ...menu,
        children: buildMenuTree(flatMenus, menu.id),
        isExpanded: true,
      }));
  };

  // Update checked menu IDs when role changes
  useEffect(() => {
    if (selectedRoleId) {
      const assigned = menuRoles
        .filter((mr) => mr.roleId === selectedRoleId)
        .map((mr) => mr.menuId);
      setCheckedMenuIds(assigned);
      updateSelectAllState(assigned);
    } else {
      setCheckedMenuIds([]);
      setSelectAll(false);
    }
  }, [selectedRoleId, menuRoles, menus]);

  // Helper functions
  const updateSelectAllState = (checkedIds: number[]) => {
    const allMenuIds = getAllMenuIds(menus);
    setSelectAll(
      allMenuIds.length > 0 && allMenuIds.every((id) => checkedIds.includes(id))
    );
  };

  const getAllMenuIds = (menuList: MenuWithChildren[]): number[] => {
    return menuList.reduce((acc, menu) => {
      return [...acc, menu.id, ...getAllMenuIds(menu.children)];
    }, [] as number[]);
  };

  const findMenu = (
    menuList: MenuWithChildren[],
    menuId: number
  ): MenuWithChildren | null => {
    for (const menu of menuList) {
      if (menu.id === menuId) return menu;
      const found = findMenu(menu.children, menuId);
      if (found) return found;
    }
    return null;
  };

  // Menu selection handlers
  const handleToggle = (menuId: number) => {
    const menu = findMenu(menus, menuId);
    if (!menu) return;

    let newCheckedIds = [...checkedMenuIds];

    if (newCheckedIds.includes(menuId)) {
      // Uncheck this menu and all its children
      newCheckedIds = newCheckedIds.filter((id) => id !== menuId);
      const childIds = getAllMenuIds(menu.children);
      newCheckedIds = newCheckedIds.filter((id) => !childIds.includes(id));
    } else {
      // Check this menu and all its children
      newCheckedIds.push(menuId);
      const childIds = getAllMenuIds(menu.children);
      childIds.forEach((id) => {
        if (!newCheckedIds.includes(id)) newCheckedIds.push(id);
      });
    }

    // Update parent check states
    if (menu.parentId) {
      const parentMenu = findMenu(menus, menu.parentId);
      if (parentMenu) {
        const siblingIds = parentMenu.children.map((c) => c.id);
        const allSiblingsChecked = siblingIds.every((id) =>
          newCheckedIds.includes(id)
        );

        if (allSiblingsChecked && !newCheckedIds.includes(parentMenu.id)) {
          newCheckedIds.push(parentMenu.id);
        } else if (
          !allSiblingsChecked &&
          newCheckedIds.includes(parentMenu.id)
        ) {
          newCheckedIds = newCheckedIds.filter((id) => id !== parentMenu.id);
        }
      }
    }

    setCheckedMenuIds(newCheckedIds);
    updateSelectAllState(newCheckedIds);
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setCheckedMenuIds([]);
    } else {
      const allIds = getAllMenuIds(menus);
      setCheckedMenuIds(allIds);
    }
    setSelectAll(!selectAll);
  };

  const toggleMenuExpand = (menuId: number) => {
    setMenus((prevMenus) => {
      const updateMenuExpansion = (
        menuList: MenuWithChildren[]
      ): MenuWithChildren[] => {
        return menuList.map((menu) => {
          if (menu.id === menuId) {
            return { ...menu, isExpanded: !menu.isExpanded };
          }
          return {
            ...menu,
            children: updateMenuExpansion(menu.children),
          };
        });
      };
      return updateMenuExpansion(prevMenus);
    });
  };

  // Save handler with confirmation
  const handleSave = async () => {
    if (!selectedRoleId) return;

    const result = await Swal.fire({
      title: "Anda yakin?",
      text: "Perubahan hak akses akan disimpan",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, simpan!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    setLoading((prev) => ({ ...prev, submit: true }));

    try {
      // Get current assigned menus for this role
      const currentAssigned = menuRoles
        .filter((mr) => mr.roleId === selectedRoleId)
        .map((mr) => mr.menuId);

      // Menus to be added
      const menusToAdd = checkedMenuIds.filter(
        (id) => !currentAssigned.includes(id)
      );

      // Menus to be removed
      const menusToRemove = currentAssigned.filter(
        (id) => !checkedMenuIds.includes(id)
      );

      // Process additions
      await Promise.all(
        menusToAdd.map((menuId) =>
          api.post<ApiResponse<boolean>>("/menuroles/assign", {
            roleId: selectedRoleId,
            menuId,
          } as AssignMenuRoleDto)
        )
      );

      // Process removals
      await Promise.all(
        menusToRemove.map((menuId) =>
          api.delete(`/menuroles/remove/${menuId}/${selectedRoleId}`)
        )
      );

      // Refresh menu roles data
      const updatedMenuRoles = await api.get<ApiResponse<MenuRoleDto[]>>(
        "/menuroles"
      );
      setMenuRoles(updatedMenuRoles.data.data);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Hak akses berhasil diperbarui",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat menyimpan perubahan",
        timer: 3000,
      });
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  // Derived values
  const selectedRoleName =
    roles.find((r) => r.id === selectedRoleId)?.name || "";
  const allMenuIds = getAllMenuIds(menus);
  const selectedCount = checkedMenuIds.length;
  const totalCount = allMenuIds.length;

  // Render menu item with children
  const renderMenu = (menu: MenuWithChildren, depth = 0) => {
    const hasChildren = menu.children && menu.children.length > 0;
    const isChecked = checkedMenuIds.includes(menu.id);
    const isIndeterminate =
      hasChildren &&
      menu.children.some((child) => checkedMenuIds.includes(child.id)) &&
      !menu.children.every((child) => checkedMenuIds.includes(child.id));

    return (
      <div key={menu.id} className="mb-1">
        <motion.div
          className={`flex items-center p-2 hover:bg-gray-50 rounded ${
            depth > 0 ? "ml-6" : ""
          }`}
          style={{ marginLeft: `${depth * 16}px` }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {hasChildren && (
            <button
              onClick={() => toggleMenuExpand(menu.id)}
              className="mr-1 text-gray-500 hover:text-gray-700"
              aria-label={menu.isExpanded ? "Collapse" : "Expand"}
            >
              {menu.isExpanded ? (
                <FiChevronDown className="h-4 w-4" />
              ) : (
                <FiChevronRight className="h-4 w-4" />
              )}
            </button>
          )}

          <button
            onClick={() => handleToggle(menu.id)}
            disabled={loading.initial || loading.submit}
            className={`flex items-center flex-1 ${
              loading.initial || loading.submit
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isChecked || isIndeterminate ? (
              <FiCheckSquare
                className={`h-5 w-5 ${
                  isIndeterminate ? "text-blue-400" : "text-blue-600"
                }`}
              />
            ) : (
              <FiSquare className="h-5 w-5 text-gray-400" />
            )}
            <span className="ml-2 text-sm font-medium text-gray-800">
              {menu.title}
            </span>
            {menu.path && (
              <span className="ml-2 text-xs text-gray-500">{menu.path}</span>
            )}
          </button>
        </motion.div>

        {hasChildren && menu.isExpanded && (
          <div className="border-l-2 border-gray-200 ml-8 pl-2">
            {/* Type-safe children rendering */}
            {menu.children.map((child: MenuWithChildren) =>
              renderMenu(child, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Manajemen Hak Akses Menu
          </h1>
          <p className="text-gray-500 mt-1">
            Atur menu yang dapat diakses oleh masing-masing role
          </p>
        </div>

        {/* Role selection */}
        <div className="mb-6">
          <label
            htmlFor="role-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Pilih Role
          </label>
          <select
            id="role-select"
            value={selectedRoleId || ""}
            onChange={(e) =>
              setSelectedRoleId(e.target.value ? Number(e.target.value) : null)
            }
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading.initial}
          >
            <option value="">-- Pilih Role --</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {selectedRoleId && (
          <>
            {/* Select all and counter */}
            <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <button
                onClick={handleSelectAllChange}
                disabled={loading.initial || loading.submit}
                className={`flex items-center text-sm ${
                  loading.initial || loading.submit
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:text-blue-700"
                }`}
              >
                {selectAll ? (
                  <FiCheckSquare className="text-blue-600 h-5 w-5 mr-2" />
                ) : (
                  <FiSquare className="text-gray-400 h-5 w-5 mr-2" />
                )}
                <span className="font-medium">Pilih Semua Menu</span>
              </button>
              <span className="ml-auto text-xs text-gray-500">
                {selectedCount} dari {totalCount} menu dipilih
              </span>
            </div>

            {/* Menu list */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="p-3 bg-gray-50 border-b border-gray-200">
                <h3 className="font-medium text-gray-700">
                  Menu untuk Role:{" "}
                  <span className="text-blue-600">{selectedRoleName}</span>
                </h3>
              </div>

              <div className="p-3 divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                {loading.initial ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center p-2">
                        <div className="h-5 w-5 bg-gray-200 rounded mr-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  menus.map((menu) => renderMenu(menu))
                )}
              </div>
            </div>

            {/* Save button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={loading.initial || loading.submit || !selectedRoleId}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading.submit ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
