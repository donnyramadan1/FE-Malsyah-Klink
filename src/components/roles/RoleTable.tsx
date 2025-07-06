"use client";
import { RoleDto } from "@/types/role";
import {
  FiEdit,
  FiTrash2,
  FiChevronUp,
  FiChevronDown,
  FiSearch,
} from "react-icons/fi";
import { useState } from "react";
import { motion } from "framer-motion";
import { ConfirmDialog } from "../ConfirmDialog";

type SortDirection = "asc" | "desc";
type SortableField = keyof Pick<RoleDto, "name" | "createdAt">;

interface Props {
  roles: RoleDto[];
  loading: boolean;
  onEdit: (role: RoleDto) => void;
  onDelete: (id: number) => void;
}

export default function RoleTable({ roles, loading, onEdit, onDelete }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortableField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<number | null>(null);

  // Filter roles based on search term
  const filteredRoles = roles.filter((role) =>
    Object.values(role).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort roles based on selected field and direction
  const sortedRoles = [...filteredRoles].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === bValue) return 0;

    const direction = sortDirection === "asc" ? 1 : -1;

    return aValue > bValue ? direction : -direction;
  });

  const handleSort = (field: SortableField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortableField }) =>
    sortField === field ? (
      sortDirection === "asc" ? (
        <FiChevronUp className="inline ml-1" />
      ) : (
        <FiChevronDown className="inline ml-1" />
      )
    ) : null;

  const handleDeleteClick = (id: number) => {
    setRoleToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (roleToDelete !== null) {
      onDelete(roleToDelete);
    }
    setIsConfirmOpen(false);
    setRoleToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setRoleToDelete(null);
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
            placeholder="Search roles..."
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
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Role Name
                  <SortIcon field="name" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center">
                  Created At
                  <SortIcon field="createdAt" />
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedRoles.length > 0 ? (
              sortedRoles.map((role, index) => (
                <motion.tr
                  key={role.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {role.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {role.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(role.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => onEdit(role)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Edit"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(role.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
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
                    : "No role data available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this role? This action cannot be undone."
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
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
      </div>
    ))}
  </div>
);
