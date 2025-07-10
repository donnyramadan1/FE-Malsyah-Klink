// src/app/(protected)/medicines/page.tsx
"use client";
import { useMedicines } from "@/hooks/useMedicines";
import MedicineTable from "@/components/medicine/MedicineTable";
import MedicineModal from "@/components/medicine/MedicineModal";
import { useState } from "react";
import {
  CreateMedicineDto,
  UpdateMedicineDto,
  MedicineDto,
} from "@/types/medicine";
import { motion } from "framer-motion";

export default function MedicinesPage() {
  const {
    medicines,
    medicineForms,
    dosageUnits,
    loading,
    currentPage,
    totalItems,
    pageSize,
    fetchMedicines,
    createMedicine,
    updateMedicine,
    deleteMedicine,
    setCurrentPage,
    searchTerm,
    handleSearch,
    sortField,
    sortDirection,
    handleSort,
  } = useMedicines();

  const [selectedMedicine, setSelectedMedicine] = useState<MedicineDto | null>(
    null
  );
  const [open, setOpen] = useState(false);

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await fetchMedicines(page);
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
              Manajemen Obat
            </h1>
            <p className="text-gray-500 mt-1">Kelola stok obat</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedMedicine(null);
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
            Add Medicine
          </motion.button>
        </div>

        <MedicineTable
          medicines={medicines}
          loading={loading}
          onEdit={(medicine) => {
            setSelectedMedicine(medicine);
            setOpen(true);
          }}
          onDelete={deleteMedicine}
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

        <MedicineModal
          open={open}
          onClose={() => setOpen(false)}
          medicine={selectedMedicine}
          medicineForms={medicineForms}
          dosageUnits={dosageUnits}
          onSave={async (data: CreateMedicineDto) => {
            if (selectedMedicine) {
              await updateMedicine(
                selectedMedicine.id,
                data as UpdateMedicineDto
              );
            } else {
              await createMedicine(data as CreateMedicineDto);
            }
            setOpen(false);
          }}
        />
      </motion.div>
    </div>
  );
}
