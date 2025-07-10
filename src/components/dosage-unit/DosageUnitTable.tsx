"use client";

import { DosageUnitDto } from "@/types/dosage-unit";
import { FiEdit, FiTrash2 } from "react-icons/fi";
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
  DosageUnitDto,
  "name" | "code" | "isActive" | "createdAt"
>;

interface Props {
  dosageUnits: DosageUnitDto[];
  loading: boolean;
  onEdit: (dosageUnit: DosageUnitDto) => void;
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

export default function DosageUnitTable({
  dosageUnits,
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
  const [dosageUnitToDelete, setDosageUnitToDelete] = useState<number | null>(
    null
  );

  const handleSortClick = (field: SortableField) => {
    const direction =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    onSort(field, direction);
  };

  const handleDeleteClick = (id: number) => {
    setDosageUnitToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (dosageUnitToDelete !== null) {
      onDelete(dosageUnitToDelete);
    }
    setIsConfirmOpen(false);
    setDosageUnitToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setDosageUnitToDelete(null);
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <SearchBar
          placeholder="Cari satuan dosis..."
          value={searchTerm}
          onChange={onSearch}
          onSearch={onSearch}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick("name")}
              >
                <div className="flex items-center">
                  Nama Satuan
                  <SortIcon
                    isActive={sortField === "name"}
                    direction={sortDirection}
                  />
                </div>
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
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick("createdAt")}
              >
                <div className="flex items-center">
                  Dibuat
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
            {dosageUnits.length > 0 ? (
              dosageUnits.map((dosageUnit, index) => (
                <motion.tr
                  key={dosageUnit.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {dosageUnit.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">
                    {dosageUnit.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <DateDisplay date={dosageUnit.createdAt} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge isActive={dosageUnit.isActive} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => onEdit(dosageUnit)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Edit"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(dosageUnit.id)}
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
                    ? "Satuan dosis tidak ditemukan."
                    : "Belum ada data satuan dosis."}
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
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus satuan dosis ini?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
