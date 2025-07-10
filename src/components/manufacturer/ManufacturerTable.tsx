// src/components/manufacturer/ManufacturerTable.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiEdit, FiTrash2, FiPackage } from "react-icons/fi";

import { ManufacturerDto } from "@/types/manufacturer";
import { ConfirmDialog } from "../ConfirmDialog";
import { SearchBar } from "../SearchBar";
import { Pagination } from "../Pagination";
import { SortIcon } from "../SortIcon";
import { LoadingSkeleton } from "../LoadingSkeleton";
import { DateDisplay } from "../DateDisplay";
import { StatusBadge } from "../StatusBadge";

type SortDirection = "asc" | "desc";
type SortableField = keyof Pick<
  ManufacturerDto,
  "name" | "licenseNumber" | "country" | "isActive" | "createdAt"
>;

interface Props {
  manufacturers: ManufacturerDto[];
  loading: boolean;
  onEdit: (manufacturer: ManufacturerDto) => void;
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

export default function ManufacturerTable({
  manufacturers,
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
  const [manufacturerToDelete, setManufacturerToDelete] = useState<
    number | null
  >(null);

  // Fungsi untuk mengatur urutan saat header diklik
  const handleSortClick = (field: SortableField) => {
    const direction =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    onSort(field, direction);
  };

  // Fungsi hapus
  const handleDeleteClick = (id: number) => {
    setManufacturerToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (manufacturerToDelete !== null) {
      onDelete(manufacturerToDelete);
    }
    setIsConfirmOpen(false);
    setManufacturerToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setManufacturerToDelete(null);
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Pencarian */}
      <div className="p-4 border-b border-gray-100">
        <SearchBar
          placeholder="Cari pabrikan..."
          value={searchTerm}
          onChange={onSearch}
          onSearch={onSearch}
        />
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pabrikan
              </th>
              <th
                onClick={() => handleSortClick("licenseNumber")}
                className="px-6 py-3 cursor-pointer text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <div className="flex items-center">
                  Nomor Lisensi
                  <SortIcon
                    isActive={sortField === "licenseNumber"}
                    direction={sortDirection}
                  />
                </div>
              </th>
              <th
                onClick={() => handleSortClick("country")}
                className="px-6 py-3 cursor-pointer text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <div className="flex items-center">
                  Negara
                  <SortIcon
                    isActive={sortField === "country"}
                    direction={sortDirection}
                  />
                </div>
              </th>
              <th
                onClick={() => handleSortClick("createdAt")}
                className="px-6 py-3 cursor-pointer text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <div className="flex items-center">
                  Terdaftar
                  <SortIcon
                    isActive={sortField === "createdAt"}
                    direction={sortDirection}
                  />
                </div>
              </th>
              <th
                onClick={() => handleSortClick("isActive")}
                className="px-6 py-3 cursor-pointer text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {manufacturers.length > 0 ? (
              manufacturers.map((manufacturer, index) => (
                <motion.tr
                  key={manufacturer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiPackage className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {manufacturer.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {manufacturer.licenseNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {manufacturer.country}
                  </td>
                  <td className="px-6 py-4">
                    <DateDisplay date={manufacturer.createdAt} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      isActive={manufacturer.isActive}
                      activeText="Aktif"
                      inactiveText="Tidak Aktif"
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => onEdit(manufacturer)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Ubah"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(manufacturer.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Hapus"
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
                    ? "Data pabrikan tidak ditemukan"
                    : "Belum ada data pabrikan"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Komponen Pagination */}
      <Pagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={onPageChange}
      />

      {/* Dialog Konfirmasi Hapus */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Konfirmasi Penghapusan"
        message="Apakah Anda yakin ingin menghapus pabrikan ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
