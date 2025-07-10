"use client";

import { PatientDto } from "@/types/patient";
import { FiEdit, FiTrash2, FiUser } from "react-icons/fi";
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
  PatientDto,
  "name" | "medicalRecordNumber" | "createdAt" | "isActive"
>;

interface Props {
  patients: PatientDto[];
  loading: boolean;
  onEdit: (patient: PatientDto) => void;
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

export default function PatientTable({
  patients,
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
  const [patientToDelete, setPatientToDelete] = useState<number | null>(null);

  const handleSortClick = (field: SortableField) => {
    const direction =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    onSort(field, direction);
  };

  const handleDeleteClick = (id: number) => {
    setPatientToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (patientToDelete !== null) {
      onDelete(patientToDelete);
    }
    setIsConfirmOpen(false);
    setPatientToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setPatientToDelete(null);
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Search */}
      <div className="p-4 border-b border-gray-100">
        <SearchBar
          placeholder="Cari pasien..."
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
                Pasien
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick("medicalRecordNumber")}
              >
                <div className="flex items-center">
                  No. RM
                  <SortIcon
                    isActive={sortField === "medicalRecordNumber"}
                    direction={sortDirection}
                  />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kontak
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick("createdAt")}
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
            {patients.length > 0 ? (
              patients.map((patient, index) => (
                <motion.tr
                  key={patient.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FiUser className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {patient.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {patient.gender} • {patient.bloodType || "-"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">
                    {patient.medicalRecordNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{patient.phone}</div>
                    <div className="text-xs text-gray-500">{patient.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <DateDisplay date={patient.createdAt} locale="id-ID" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge
                      isActive={patient.isActive}
                      activeText="Aktif"
                      inactiveText="Nonaktif"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => onEdit(patient)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Edit"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(patient.id)}
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
                    ? "Tidak ditemukan pasien yang sesuai"
                    : "Belum ada data pasien"}
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
        message="Apakah Anda yakin ingin menghapus pasien ini? Data yang sudah dihapus tidak dapat dikembalikan."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
