"use client";
import { MenuDto } from "@/types/menu";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { ConfirmDialog } from "../ConfirmDialog";
import { useState } from "react";
import { SearchBar } from "../SearchBar";
import { Pagination } from "../Pagination";
import { SortIcon } from "../SortIcon";
import { StatusBadge } from "../StatusBadge";
import { LoadingSkeleton } from "../LoadingSkeleton";

type SortDirection = "asc" | "desc";
type SortableField = keyof Pick<
  MenuDto,
  "title" | "path" | "orderNum" | "isActive"
>;

interface Props {
  menus: MenuDto[];
  loading: boolean;
  onEdit: (menu: MenuDto) => void;
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

export default function MenuTable({
  menus,
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
  const [menuToDelete, setMenuToDelete] = useState<number | null>(null);

  const handleSortClick = (field: SortableField) => {
    const direction =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    onSort(field, direction);
  };

  const handleDeleteClick = (id: number) => {
    setMenuToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (menuToDelete !== null) {
      onDelete(menuToDelete);
    }
    setIsConfirmOpen(false);
    setMenuToDelete(null);
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100">
        <SearchBar
          placeholder="Cari menus..."
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
                onClick={() => handleSortClick("title")}
              >
                <div className="flex items-center">
                  Title
                  <SortIcon
                    isActive={sortField === "title"}
                    direction={sortDirection}
                  />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Icon
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick("path")}
              >
                <div className="flex items-center">
                  Path
                  <SortIcon
                    isActive={sortField === "path"}
                    direction={sortDirection}
                  />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick("orderNum")}
              >
                <div className="flex items-center">
                  Order
                  <SortIcon
                    isActive={sortField === "orderNum"}
                    direction={sortDirection}
                  />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick("isActive")}
              >
                <div className="flex items-center">
                  Status
                  <SortIcon
                    isActive={sortField === "isActive"}
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
            {menus.length > 0 ? (
              menus.map((menu, index) => (
                <motion.tr
                  key={menu.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {menu.title}
                    </div>
                    {menu.parentId && (
                      <div className="text-xs text-gray-500">Child menu</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {menu.icon && (
                        <span className="flex items-center">
                          <span className="mr-2">{menu.icon}</span>
                          <span className="text-lg">{menu.icon}</span>
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{menu.path}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{menu.orderNum}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge isActive={menu.isActive} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => onEdit(menu)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Edit"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(menu.id)}
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
                  colSpan={6}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  {searchTerm
                    ? "No matching results found"
                    : "No menu data available"}
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
        message="Are you sure you want to delete this menu? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}
