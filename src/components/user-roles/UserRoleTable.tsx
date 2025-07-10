// user-roles/UserRoleTable.tsx
"use client";
import { UserWithRolesDto } from "@/types/userRole";
import { FiEdit2, FiSearch, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface UserRoleTableProps {
  data: UserWithRolesDto[];
  loading: boolean;
  onEdit: (userId: number) => void;
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  searchTerm: string;
  onSearch: (term: string) => void;
  sortField: keyof UserWithRolesDto;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof UserWithRolesDto, direction: "asc" | "desc") => void;
}

export default function UserRoleTable({
  data,
  loading,
  onEdit,
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  searchTerm,
  onSearch,
  sortField,
  sortDirection,
  onSort,
}: UserRoleTableProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    setIsSearching(true);
    onSearch(value);
  };

  const handleSortClick = (field: keyof UserWithRolesDto) => {
    const direction =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    onSort(field, direction);
  };

  const SortIcon = ({ field }: { field: keyof UserWithRolesDto }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <FiChevronUp className="inline ml-1" />
    ) : (
      <FiChevronDown className="inline ml-1" />
    );
  };

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
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari pengguna..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            value={localSearchTerm}
            onChange={handleInputChange}
          />
          {(loading || isSearching) && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick("fullName")}
              >
                <div className="flex items-center">
                  Nama Pengguna
                  <SortIcon field="fullName" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600">
                          {user.fullName?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {user.roles.length > 0 ? (
                        user.roles.map((role) => (
                          <span
                            key={role.id}
                            className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                          >
                            {role.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400">
                          Tidak ada role
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(user.id)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Edit role"
                    >
                      <FiEdit2 className="h-5 w-5" />
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
                    ? "Tidak ditemukan pengguna yang cocok"
                    : "Tidak ada data pengguna"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center p-4 border-t">
        <div className="text-sm text-gray-600">
          Menampilkan {(currentPage - 1) * pageSize + 1} -{" "}
          {Math.min(currentPage * pageSize, totalItems)} dari {totalItems}{" "}
          pengguna
        </div>
        <div className="space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            Sebelumnya
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage * pageSize >= totalItems}
            className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  );
}
