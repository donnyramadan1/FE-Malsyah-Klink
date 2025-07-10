"use client";
import { SupplierDto } from "@/types/supplier";
import { FiEdit, FiTrash2, FiTruck } from "react-icons/fi";
import { motion } from "framer-motion";
import { ConfirmDialog } from "../ConfirmDialog";
import { useState } from "react";
import { SearchBar } from "../SearchBar";
import { Pagination } from "../Pagination";
import { LoadingSkeleton } from "../LoadingSkeleton";
import { DateDisplay } from "../DateDisplay";
import { SortIcon } from "../SortIcon";

// Tipe untuk arah sorting
type SortDirection = "asc" | "desc";

// Field yang bisa di-sort
type SortableField = keyof Pick<
  SupplierDto,
  "name" | "contactPerson" | "email" | "createdAt"
>;

interface Props {
  suppliers: SupplierDto[];
  loading: boolean;
  onEdit: (supplier: SupplierDto) => void;
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

export default function SupplierTable({
  suppliers,
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
  // State untuk dialog konfirmasi
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<number | null>(null);

  // Fungsi untuk handle sorting
  const handleSortClick = (field: SortableField) => {
    const direction =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    onSort(field, direction);
  };

  // Fungsi untuk handle klik delete
  const handleDeleteClick = (id: number) => {
    setSupplierToDelete(id);
    setIsConfirmOpen(true);
  };

  // Fungsi untuk konfirmasi delete
  const handleConfirmDelete = () => {
    if (supplierToDelete !== null) {
      onDelete(supplierToDelete);
    }
    setIsConfirmOpen(false);
    setSupplierToDelete(null);
  };

  // Fungsi untuk batal delete
  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setSupplierToDelete(null);
  };

  // Tampilkan loading skeleton jika loading
  if (loading) {
    return <LoadingSkeleton rows={5} className="space-y-4 p-6" />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Bagian Pencarian */}
      <div className="p-4 border-b border-gray-100">
        <SearchBar
          placeholder="Cari supplier..."
          value={searchTerm}
          onChange={onSearch}
          onSearch={onSearch}
        />
      </div>

      {/* Tabel Supplier */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick("contactPerson")}
              >
                <div className="flex items-center">
                  Kontak Person
                  <SortIcon
                    isActive={sortField === "contactPerson"}
                    direction={sortDirection}
                  />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Informasi Kontak
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick("createdAt")}
              >
                <div className="flex items-center">
                  Tanggal Ditambahkan
                  <SortIcon
                    isActive={sortField === "createdAt"}
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
            {suppliers.length > 0 ? (
              suppliers.map((supplier, index) => (
                <motion.tr
                  key={supplier.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FiTruck className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {supplier.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {supplier.contactPerson}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {supplier.phone}
                    </div>
                    <div className="text-xs text-gray-500">
                      {supplier.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <DateDisplay date={supplier.createdAt} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => onEdit(supplier)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Edit"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(supplier.id)}
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
                    ? "Tidak ditemukan supplier yang cocok"
                    : "Tidak ada data supplier"}
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
          previousText="Previous"
          nextText="Next"
          className="border-t"
        />
      </div>

      {/* Dialog Konfirmasi Hapus */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Konfirmasi Penghapusan"
        message="Apakah Anda yakin ingin menghapus supplier ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
