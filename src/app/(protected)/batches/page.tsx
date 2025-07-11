"use client";
import { useBatches } from "@/hooks/useBatches";
import BatchTable from "@/components/batch/BatchTable";
import BatchModal from "@/components/batch/BatchModal";
import { useState } from "react";
import { CreateBatchDto, UpdateBatchDto, BatchDto } from "@/types/batch";
import { motion } from "framer-motion";
import { FaPlus, FaBox } from "react-icons/fa";

export default function BatchesPage() {
  const {
    batches,
    medicines,
    manufacturers,
    suppliers,
    loading,
    currentPage,
    totalItems,
    pageSize,
    fetchBatches,
    createBatch,
    updateBatch,
    deleteBatch,
    setCurrentPage,
    searchTerm,
    handleSearch,
    sortField,
    sortDirection,
    handleSort,
  } = useBatches();

  const [selectedBatch, setSelectedBatch] = useState<BatchDto | null>(null);
  const [open, setOpen] = useState(false);

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await fetchBatches(page);
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
          <div className="flex items-center gap-3">
            <FaBox className="text-3xl text-[#1a4b7e]" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Manajemen Batch Obat
              </h1>
              <p className="text-gray-500 mt-1">Kelola batch obat di apotek</p>
            </div>
          </div>
          <div className="flex items-center gap-3">           
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedBatch(null);
                setOpen(true);
              }}
              className="bg-gradient-to-r from-[#0f355d] to-[#1a4b7e] hover:from-[#1a4b7e] hover:to-[#0f355d] text-white py-2 px-6 rounded-lg transition-all shadow-md flex items-center gap-2"
            >
              <FaPlus className="h-4 w-4" />
              Tambah Batch
            </motion.button>
          </div>
        </div>

        <BatchTable
          batches={batches}
          loading={loading}
          onEdit={(batch) => {
            setSelectedBatch(batch);
            setOpen(true);
          }}
          onDelete={deleteBatch}
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

        <BatchModal
          open={open}
          onClose={() => setOpen(false)}
          batch={selectedBatch}
          medicines={medicines}
          manufacturers={manufacturers}
          suppliers={suppliers}
          onSave={async (data: CreateBatchDto | UpdateBatchDto) => {
            if (selectedBatch) {
              await updateBatch(selectedBatch.id, data as UpdateBatchDto);
            } else {
              await createBatch(data as CreateBatchDto);
            }
            setOpen(false);
          }}
        />
      </motion.div>
    </div>
  );
}
