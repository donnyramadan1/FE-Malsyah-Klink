"use client";
import { MenuWithRolesDto, RoleWithMenusDto } from "@/types/menuRole";
import { FiEdit2, FiSearch, FiMenu, FiUsers } from "react-icons/fi";
import { useState } from "react";
import { motion } from "framer-motion";

interface MenuRoleTableProps {
  viewMode: "menus" | "roles";
  menus?: MenuWithRolesDto[];
  roles?: RoleWithMenusDto[];
  loading: boolean;
  onEditMenu: (menuId: number) => void;
  onEditRole: (roleId: number) => void;
  onToggleViewMode: () => void;
}

export default function MenuRoleTable({
  viewMode,
  menus = [],
  roles = [],
  loading,
  onEditMenu,
  onEditRole,
  onToggleViewMode,
}: MenuRoleTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData =
    viewMode === "menus"
      ? menus.filter(
          (menu) =>
            menu.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            menu.path.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : roles.filter(
          (role) =>
            role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            role.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={`Search ${viewMode}...`}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={onToggleViewMode}
          className="ml-4 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          title={`Switch to ${viewMode === "menus" ? "roles" : "menus"} view`}
        >
          {viewMode === "menus" ? (
            <FiUsers className="h-5 w-5 text-gray-600" />
          ) : (
            <FiMenu className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {viewMode === "menus" ? "Menu" : "Role"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {viewMode === "menus"
                  ? "Accessible To Roles"
                  : "Has Access To Menus"}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {viewMode === "menus" ? (
                        <>                         
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {(item as MenuWithRolesDto).title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {(item as MenuWithRolesDto).path}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {(item as RoleWithMenusDto).name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {(item as RoleWithMenusDto).description}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {viewMode === "menus" ? (
                        (item as MenuWithRolesDto).roles.length > 0 ? (
                          (item as MenuWithRolesDto).roles.map((role) => (
                            <span
                              key={role.id}
                              className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                            >
                              {role.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-400">
                            No roles assigned
                          </span>
                        )
                      ) : (item as RoleWithMenusDto).menus.length > 0 ? (
                        (item as RoleWithMenusDto).menus.map((menu) => (
                          <span
                            key={menu.id}
                            className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800"
                          >
                            {menu.title}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400">
                          No menus assigned
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() =>
                        viewMode === "menus"
                          ? onEditMenu(item.id)
                          : onEditRole(item.id)
                      }
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title={`Edit ${
                        viewMode === "menus" ? "menu" : "role"
                      } assignments`}
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  {searchTerm
                    ? "No matching results found"
                    : `No ${viewMode} available`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
