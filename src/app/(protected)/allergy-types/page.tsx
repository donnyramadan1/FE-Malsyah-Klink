"use client";
import { useAllergyTypes } from "@/hooks/useAllergyTypes";
import AllergyTypeTable from "@/components/allergy/AllergyTypeTable";
import AllergyTypeModal from "@/components/allergy/AllergyTypeModal";
import { SetStateAction, useState } from "react";
import {
  CreateAllergyTypeDto,
  UpdateAllergyTypeDto,
  AllergyTypeDto,
} from "@/types/allergy";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";

export default function AllergyTypesPage() {
  const {
    allergyTypes,
    loading,
    currentPage,
    totalItems,
    pageSize,
    fetchAllergyTypes,
    createAllergyType,
    updateAllergyType,
    deleteAllergyType,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
  } = useAllergyTypes();

  const [selectedAllergyType, setSelectedAllergyType] =
    useState<AllergyTypeDto | null>(null);
  const [open, setOpen] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchAllergyTypes(page);
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
              Manajemen Jenis Alergi
            </h1>
            <p className="text-gray-500 mt-1">
              Kelola data jenis alergi pasien
            </p>
          </div>
          <div className="flex items-center gap-3">            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedAllergyType(null);
                setOpen(true);
              }}
              className="bg-gradient-to-r from-[#0f355d] to-[#1a4b7e] hover:from-[#1a4b7e] hover:to-[#0f355d] text-white py-2 px-6 rounded-lg transition-all shadow-md flex items-center gap-2"
            >
              <FaPlus className="h-4 w-4" />
              Tambah Jenis Alergi
            </motion.button>
          </div>
        </div>

        <AllergyTypeTable
          allergyTypes={allergyTypes}
          loading={loading}
          onEdit={(allergyType: SetStateAction<AllergyTypeDto | null>) => {
            setSelectedAllergyType(allergyType);
            setOpen(true);
          }}
          onDelete={deleteAllergyType}
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
        />

        <AllergyTypeModal
          open={open}
          onClose={() => setOpen(false)}
          allergyType={selectedAllergyType}
          onSave={async (data: CreateAllergyTypeDto) => {
            if (selectedAllergyType) {
              await updateAllergyType(
                selectedAllergyType.id,
                data as UpdateAllergyTypeDto
              );
            } else {
              await createAllergyType(data as CreateAllergyTypeDto);
            }
            setOpen(false);
          }}
        />
      </motion.div>
    </div>
  );
}
