// src/components/medicine/MedicineTable.tsx
"use client";

import { MedicineDto } from "@/types/medicine";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { LuPill } from "react-icons/lu";
import { motion } from "framer-motion";
import { useState } from "react";
import { ConfirmDialog } from "../ConfirmDialog";
import { SearchBar } from "../SearchBar";
import { Pagination } from "../Pagination";
import { SortIcon } from "../SortIcon";
import { DateDisplay } from "../DateDisplay";
import { StatusBadge } from "../StatusBadge";
import { LoadingSkeleton } from "../LoadingSkeleton";

type SortDirection = "asc" | "desc";
type SortableField = keyof Pick<
  MedicineDto,
  "name" | "code" | "stockQuantity" | "isActive" | "createdAt"
>;

interface Props {
  medicines: MedicineDto[];
  loading: boolean;
  onEdit: (medicine: MedicineDto) => void;
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

export default function MedicineTable({
  medicines,
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
  const [medicineToDelete, setMedicineToDelete] = useState<number | null>(null);

  const handleSortClick = (field: SortableField) => {
    const direction =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    onSort(field, direction);
  };

  const handleDeleteClick = (id: number) => {
    setMedicineToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (medicineToDelete !== null) {
      onDelete(medicineToDelete);
    }
    setIsConfirmOpen(false);
    setMedicineToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setMedicineToDelete(null);
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Pencarian Obat */}
      <div className="p-4 border-b border-gray-100">
        <SearchBar
          placeholder="Cari obat..."
          value={searchTerm}
          onChange={onSearch}
          onSearch={onSearch}
        />
      </div>

      {/* Tabel Obat */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Obat
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick("code")}
              >
                <div className="flex items-center">
                  Kode
                  <SortIcon
                    isActive={sortField === "code"}
                    direction={sortDirection}
                  />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bentuk
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dosis
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick("stockQuantity")}
              >
                <div className="flex items-center">
                  Stok
                  <SortIcon
                    isActive={sortField === "stockQuantity"}
                    direction={sortDirection}
                  />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick("createdAt")}
              >
                <div className="flex items-center">
                  Ditambahkan
                  <SortIcon
                    isActive={sortField === "createdAt"}
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
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {medicines.length > 0 ? (
              medicines.map((medicine, index) => (
                <motion.tr
                  key={medicine.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <LuPill className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {medicine.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">
                    {medicine.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {medicine.formName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {medicine.dosageUnitName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      className={`font-semibold ${
                        medicine.stockQuantity < medicine.minStockLevel
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {medicine.stockQuantity}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      / {medicine.minStockLevel} min
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <DateDisplay date={medicine.createdAt} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge isActive={medicine.isActive} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => onEdit(medicine)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Edit"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(medicine.id)}
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
                  colSpan={8}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  {searchTerm
                    ? "Obat yang dicari tidak ditemukan."
                    : "Belum ada data obat tersedia."}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Navigasi Halaman */}
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={onPageChange}
        />
      </div>

      {/* Dialog Konfirmasi Hapus */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus data obat ini? Tindakan ini tidak bisa dibatalkan."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
