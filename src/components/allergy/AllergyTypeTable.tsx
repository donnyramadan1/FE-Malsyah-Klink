"use client";

import { AllergyTypeDto } from "@/types/allergy";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState } from "react";
import { ConfirmDialog } from "../ConfirmDialog";
import { SearchBar } from "../SearchBar";
import { LoadingSkeleton } from "../LoadingSkeleton";
import { Pagination } from "../Pagination";
import { StatusBadge } from "../StatusBadge";

interface Props {
  allergyTypes: AllergyTypeDto[];
  loading: boolean;
  onEdit: (allergyType: AllergyTypeDto) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  searchTerm: string;
  onSearch: (term: string) => void;
}

export default function AllergyTypeTable({
  allergyTypes,
  loading,
  onEdit,
  onDelete,
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  searchTerm,
  onSearch,
}: Props) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [allergyTypeToDelete, setAllergyTypeToDelete] = useState<number | null>(
    null
  );

  const handleDeleteClick = (id: number) => {
    setAllergyTypeToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (allergyTypeToDelete !== null) {
      onDelete(allergyTypeToDelete);
    }
    setIsConfirmOpen(false);
    setAllergyTypeToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setAllergyTypeToDelete(null);
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Pencarian */}
      <div className="p-4 border-b border-gray-100">
        <SearchBar
          placeholder="Cari jenis alergi..."
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
                Nama Alergi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kode
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tingkat Keparahan
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
            {allergyTypes.length > 0 ? (
              allergyTypes.map((allergyType, index) => (
                <motion.tr
                  key={allergyType.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {allergyType.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {allergyType.description || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono">
                      {allergyType.code}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {allergyType.severityLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge
                      isActive={allergyType.isActive}
                      activeText="Aktif"
                      inactiveText="Nonaktif"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => onEdit(allergyType)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Edit"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(allergyType.id)}
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
                  colSpan={5}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  {searchTerm
                    ? "Tidak ditemukan jenis alergi yang sesuai"
                    : "Belum ada data jenis alergi"}
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

      {/* Dialog Konfirmasi */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Konfirmasi Penghapusan"
        message="Apakah Anda yakin ingin menghapus jenis alergi ini?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
