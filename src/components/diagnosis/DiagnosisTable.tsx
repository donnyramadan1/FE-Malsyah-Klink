"use client";

import { DiagnosisDto } from "@/types/diagnosis";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState } from "react";
import { ConfirmDialog } from "../ConfirmDialog";
import { SearchBar } from "../SearchBar";
import { Pagination } from "../Pagination";
import { LoadingSkeleton } from "../LoadingSkeleton";
import { StatusBadge } from "../StatusBadge";

interface Props {
  diagnoses: DiagnosisDto[];
  loading: boolean;
  onEdit: (diagnosis: DiagnosisDto) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  searchTerm: string;
  onSearch: (term: string) => void;
}

export default function DiagnosisTable({
  diagnoses,
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
  const [diagnosisToDelete, setDiagnosisToDelete] = useState<number | null>(
    null
  );

  const handleDeleteClick = (id: number) => {
    setDiagnosisToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (diagnosisToDelete !== null) {
      onDelete(diagnosisToDelete);
    }
    setIsConfirmOpen(false);
    setDiagnosisToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setDiagnosisToDelete(null);
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Pencarian */}
      <div className="p-4 border-b border-gray-100">
        <SearchBar
          placeholder="Cari diagnosa..."
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
                Nama Diagnosa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kode
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
            {diagnoses.length > 0 ? (
              diagnoses.map((diagnosis, index) => (
                <motion.tr
                  key={diagnosis.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {diagnosis.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono">
                      {diagnosis.code}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {diagnosis.description || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge
                      isActive={diagnosis.isActive}
                      activeText="Aktif"
                      inactiveText="Nonaktif"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => onEdit(diagnosis)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Edit"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(diagnosis.id)}
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
                    ? "Tidak ditemukan diagnosa yang sesuai"
                    : "Belum ada data diagnosa"}
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

      {/* Konfirmasi Hapus */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Konfirmasi Penghapusan"
        message="Apakah Anda yakin ingin menghapus diagnosa ini?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
