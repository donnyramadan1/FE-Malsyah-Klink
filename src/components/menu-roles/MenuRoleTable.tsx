"use client";
import { MenuRoleDto } from "@/types/menuRole";
import { FiTrash2, FiSearch } from "react-icons/fi";
import { useState } from "react";
import { motion } from "framer-motion";
import { ConfirmDialog } from "../ConfirmDialog";

interface Props {
  menuRoles: MenuRoleDto[];
  loading: boolean;
  onRemove: (menuId: number, roleId: number) => void;
}

export default function MenuRoleTable({ menuRoles, loading, onRemove }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [menuRoleToRemove, setMenuRoleToRemove] = useState<{
    menuId: number;
    roleId: number;
  } | null>(null);

  // Filter menuRoles based on search term
  const filteredMenuRoles = menuRoles.filter((mr) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      mr.menu?.title.toLowerCase().includes(searchLower) ||
      mr.menu?.path.toLowerCase().includes(searchLower) ||
      mr.role?.name.toLowerCase().includes(searchLower)
    );
  });

  const handleDeleteClick = (menuId: number, roleId: number) => {
    setMenuRoleToRemove({ menuId, roleId });
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (menuRoleToRemove) {
      onRemove(menuRoleToRemove.menuId, menuRoleToRemove.roleId);
    }
    setIsConfirmOpen(false);
    setMenuRoleToRemove(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setMenuRoleToRemove(null);
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search menu roles..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Menu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Path
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMenuRoles.length > 0 ? (
              filteredMenuRoles.map((mr, index) => (
                <motion.tr
                  key={`${mr.menuId}-${mr.roleId}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {mr.menu?.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{mr.menu?.path}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{mr.role?.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteClick(mr.menuId, mr.roleId)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Remove"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  {searchTerm
                    ? "No matching results found"
                    : "No menu role assignments"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Confirm Removal"
        message="Are you sure you want to remove this menu from the role?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

const LoadingSkeleton = () => (
  <div className="space-y-4 p-6">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4 animate-pulse">
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
      </div>
    ))}
  </div>
);
