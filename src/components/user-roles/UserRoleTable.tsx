"use client";
import { UserRoleDto } from "@/types/userRole";
import { FiTrash2, FiSearch } from "react-icons/fi";
import { useState } from "react";
import { motion } from "framer-motion";
import { ConfirmDialog } from "../ConfirmDialog";

interface Props {
  userRoles: UserRoleDto[];
  loading: boolean;
  onRemove: (userId: number, roleId: number) => void;
}

export default function UserRoleTable({ userRoles, loading, onRemove }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userRoleToRemove, setUserRoleToRemove] = useState<{
    userId: number;
    roleId: number;
  } | null>(null);

  // Filter userRoles based on search term
  const filteredUserRoles = userRoles.filter((ur) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      ur.users?.username.toLowerCase().includes(searchLower) ||
      ur.users?.fullName.toLowerCase().includes(searchLower) ||
      ur.roles?.name.toLowerCase().includes(searchLower)
    );
  });

  const handleDeleteClick = (userId: number, roleId: number) => {
    setUserRoleToRemove({ userId, roleId });
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userRoleToRemove) {
      onRemove(userRoleToRemove.userId, userRoleToRemove.roleId);
    }
    setIsConfirmOpen(false);
    setUserRoleToRemove(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setUserRoleToRemove(null);
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
            placeholder="Search user roles..."
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
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned At
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUserRoles.length > 0 ? (
              filteredUserRoles.map((ur, index) => (
                <motion.tr
                  key={`${ur.userId}-${ur.roleId}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {ur.users?.username}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {ur.users?.fullName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{ur.roles?.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(ur.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteClick(ur.userId, ur.roleId)}
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
                  colSpan={5}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  {searchTerm
                    ? "No matching results found"
                    : "No user role assignments"}
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
        message="Are you sure you want to remove this role from the user?"
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
