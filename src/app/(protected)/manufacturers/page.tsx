// src/app/(protected)/manufacturers/page.tsx
"use client";
import { useManufacturers } from "@/hooks/useManufacturers";
import ManufacturerTable from "@/components/manufacturer/ManufacturerTable";
import ManufacturerModal from "@/components/manufacturer/ManufacturerModal";
import { useState } from "react";
import {
  CreateManufacturerDto,
  UpdateManufacturerDto,
  ManufacturerDto,
} from "@/types/manufacturer";
import { motion } from "framer-motion";

export default function ManufacturersPage() {
  const {
    manufacturers,
    loading,
    currentPage,
    totalItems,
    pageSize,
    fetchManufacturers,
    createManufacturer,
    updateManufacturer,
    deleteManufacturer,
    setCurrentPage,
    searchTerm,
    handleSearch,
    sortField,
    sortDirection,
    handleSort,
  } = useManufacturers();

  const [selectedManufacturer, setSelectedManufacturer] =
    useState<ManufacturerDto | null>(null);
  const [open, setOpen] = useState(false);

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await fetchManufacturers(page);
  };

  return (
    <div className="p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Manajemen Pabrikan
            </h1>
            <p className="text-gray-500 mt-1">Kelola data pabrikan obat</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedManufacturer(null);
              setOpen(true);
            }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-6 rounded-lg transition-all shadow-md flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Tambah Pabrikan
          </motion.button>
        </div>

        <ManufacturerTable
          manufacturers={manufacturers}
          loading={loading}
          onEdit={(manufacturer) => {
            setSelectedManufacturer(manufacturer);
            setOpen(true);
          }}
          onDelete={deleteManufacturer}
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          searchTerm={searchTerm}
          onSearch={handleSearch}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        <ManufacturerModal
          open={open}
          onClose={() => setOpen(false)}
          manufacturer={selectedManufacturer}
          onSave={async (data: CreateManufacturerDto) => {
            if (selectedManufacturer) {
              await updateManufacturer(
                selectedManufacturer.id,
                data as UpdateManufacturerDto
              );
            } else {
              await createManufacturer(data as CreateManufacturerDto);
            }
            setOpen(false);
          }}
        />
      </motion.div>
    </div>
  );
}
