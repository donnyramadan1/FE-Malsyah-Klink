"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiEdit, FiTrash2 } from "react-icons/fi";

import { MedicineFormDto } from "@/types/medicine";
import { SearchBar } from "../SearchBar";
import { StatusBadge } from "../StatusBadge";
import { Pagination } from "../Pagination";
import { ConfirmDialog } from "../ConfirmDialog";
import { LoadingSkeleton } from "../LoadingSkeleton";

interface Props {
  medicineForms: MedicineFormDto[];
  loading: boolean;
  onEdit: (form: MedicineFormDto) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  searchTerm: string;
  onSearch: (term: string) => void;
}

export default function MedicineFormTable({
  medicineForms,
  loading,
  onEdit,
  onDelete,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  searchTerm,
  onSearch,
}: Props) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setFormToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (formToDelete !== null) {
      onDelete(formToDelete);
    }
    setIsConfirmOpen(false);
    setFormToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setFormToDelete(null);
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100">
        <SearchBar
          placeholder="Cari bentuk obat..."
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Bentuk Obat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deskripsi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {medicineForms.length > 0 ? (
              medicineForms.map((form, index) => (
                <motion.tr
                  key={form.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {form.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {form.description || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge
                      isActive={form.isActive}
                      activeText="Aktif"
                      inactiveText="Nonaktif"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => onEdit(form)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Edit"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(form.id)}
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
                  colSpan={4}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  {searchTerm
                    ? "Tidak ditemukan bentuk obat yang sesuai"
                    : "Belum ada data bentuk obat"}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={onPageChange}
        />
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Konfirmasi Penghapusan"
        message="Apakah Anda yakin ingin menghapus bentuk obat ini?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
