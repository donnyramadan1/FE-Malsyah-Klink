"use client";
import { usePatients } from "@/hooks/usePatients";
import PatientTable from "@/components/patient/PatientTable";
import PatientModal from "@/components/patient/PatientModal";
import { useState } from "react";
import {
  CreatePatientDto,
  UpdatePatientDto,
  PatientDto,
} from "@/types/patient";
import { motion } from "framer-motion";

export default function PatientsPage() {
  const {
    patients,
    loading,
    currentPage,
    totalItems,
    pageSize,
    fetchPatients,
    createPatient,
    updatePatient,
    deletePatient,
    setCurrentPage,
    searchTerm,
    handleSearch,
    sortField,
    sortDirection,
    handleSort,
  } = usePatients();

  const [selectedPatient, setSelectedPatient] = useState<PatientDto | null>(
    null
  );
  const [open, setOpen] = useState(false);

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await fetchPatients(page);
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
              Manajemen Pasien
            </h1>
            <p className="text-gray-500 mt-1">Kelola data rekam medis pasien</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedPatient(null);
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
            Tambah Pasien
          </motion.button>
        </div>

        <PatientTable
          patients={patients}
          loading={loading}
          onEdit={(patient) => {
            setSelectedPatient(patient);
            setOpen(true);
          }}
          onDelete={deletePatient}
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

        <PatientModal
          open={open}
          onClose={() => setOpen(false)}
          patient={selectedPatient}
          onSave={async (data) => {
            if (selectedPatient) {
              await updatePatient(selectedPatient.id, data as UpdatePatientDto);
            } else {
              await createPatient(data as CreatePatientDto);
            }
            setOpen(false);
          }}
        />
      </motion.div>
    </div>
  );
}
