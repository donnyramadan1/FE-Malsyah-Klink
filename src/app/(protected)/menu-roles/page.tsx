"use client";
import { useMenuRoles } from "@/hooks/useMenuRoles";
import { useMenus } from "@/hooks/useMenus";
import { useRoles } from "@/hooks/useRoles";
import MenuRoleTable from "@/components/menu-roles/MenuRoleTable";
import MenuRoleAssignmentModal from "@/components/menu-roles/MenuRoleAssignmentModal";
import { useState } from "react";
import { motion } from "framer-motion";
import { MenuWithRolesDto, RoleWithMenusDto } from "@/types/menuRole";

export default function MenuRolesPage() {
  const {
    menusWithRoles,
    rolesWithMenus,
    viewMode,
    setViewMode,
    loading,
    error,
    updateMenuRoles,
  } = useMenuRoles();

  const { menus } = useMenus();
  const { roles } = useRoles();

  const [currentItem, setCurrentItem] = useState<
    MenuWithRolesDto | RoleWithMenusDto | null
  >(null);

  const handleEdit = (id: number) => {
    const item =
      viewMode === "menus"
        ? menusWithRoles.find((m) => m.id === id)
        : rolesWithMenus.find((r) => r.id === id);
    setCurrentItem(item || null);
  };

  const handleSave = async (data: {
    menuId?: number;
    roleId?: number;
    targetIds: number[];
  }) => {
    await updateMenuRoles(data);
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "menus" ? "roles" : "menus"));
  };

  return (
    <div className="p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Menu Role Management
            </h1>
            <p className="text-gray-500 mt-1">
              Manage which{" "}
              {viewMode === "menus"
                ? "roles can access menus"
                : "menus are accessible by roles"}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <MenuRoleTable
          viewMode={viewMode}
          menus={menusWithRoles}
          roles={rolesWithMenus}
          loading={loading}
          onEditMenu={(id) => {
            setViewMode("menus");
            handleEdit(id);
          }}
          onEditRole={(id) => {
            setViewMode("roles");
            handleEdit(id);
          }}
          onToggleViewMode={toggleViewMode}
        />

        <MenuRoleAssignmentModal
          open={!!currentItem}
          onClose={() => setCurrentItem(null)}
          onSave={handleSave}
          mode={viewMode === "menus" ? "menu" : "role"}
          currentItem={currentItem}
          allItems={viewMode === "menus" ? roles : menus}
        />
      </motion.div>
    </div>
  );
}
