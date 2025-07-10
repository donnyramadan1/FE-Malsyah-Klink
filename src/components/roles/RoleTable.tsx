"use client";
import { RoleDto } from "@/types/role";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { ConfirmDialog } from "../ConfirmDialog";
import { useState } from "react";
import { SearchBar } from "../SearchBar";
import { Pagination } from "../Pagination";
import { SortIcon } from "../SortIcon";
import { LoadingSkeleton } from "../LoadingSkeleton";
import { DateDisplay } from "../DateDisplay";

type SortDirection = "asc" | "desc";
type SortableField = keyof Pick<RoleDto, "name" | "createdAt">;

interface Props {
  roles: RoleDto[];
  loading: boolean;
  onEdit: (role: RoleDto) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  searchTerm: string;
  onSearch: (term: string) => void;
  sortField: SortableField;
  sortDirection: SortDirection;
  onSort: (field: SortableField, direction: SortDirection) => void;
}

export default function RoleTable({
  roles,
  loading,
  onEdit,
  onDelete,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  searchTerm,
  onSearch,
  sortField,
  sortDirection,
  onSort,
}: Props) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<number | null>(null);

  const handleSortClick = (field: SortableField) => {
    const direction =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    onSort(field, direction);
  };

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

  if (loading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100">
        <SearchBar
          placeholder="Search roles..."
          value={searchTerm}
          onChange={onSearch}
          onSearch={onSearch}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick("name")}
              >
                <div className="flex items-center">
                  Role Name
                  <SortIcon
                    isActive={sortField === "name"}
                    direction={sortDirection}
                  />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick("createdAt")}
              >
                <div className="flex items-center">
                  Created At
                  <SortIcon
                    isActive={sortField === "createdAt"}
                    direction={sortDirection}
                  />
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {roles.length > 0 ? (
              roles.map((role, index) => (
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
                    <DateDisplay date={role.createdAt} />
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
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={onPageChange}
        />
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this role? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}
