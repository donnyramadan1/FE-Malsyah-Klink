/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import {
  CreateBatchDto,
  UpdateBatchDto,
  BatchDto,
  ManufacturerDto,
  SupplierDto,
} from "@/types/batch";
import { MedicineDto } from "@/types/medicine";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaBox,
  FaPills,
  FaIndustry,
  FaCalendarAlt,
  FaCalendarTimes,
  FaBoxes,
  FaTags,
  FaTruck,
  FaStickyNote,
  FaBan,
  FaSave,
  FaTimes,
  FaBarcode,
  FaDollarSign,
} from "react-icons/fa";

type FormData = CreateBatchDto | UpdateBatchDto;

interface Props {
  batch?: BatchDto | null;
  medicines: MedicineDto[];
  manufacturers: ManufacturerDto[];
  suppliers: SupplierDto[];
  onSubmit: (data: FormData) => Promise<void>;
  onClose: () => void;
}

export default function BatchForm({
  batch,
  medicines,
  manufacturers,
  suppliers,
  onSubmit,
  onClose,
}: Props) {
  const isEdit = !!batch;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(
    isEdit && batch
      ? {
          batchNumber: batch.batchNumber,
          medicineId: batch.medicineId,
          manufacturerId: batch.manufacturerId,
          productionDate: batch.productionDate,
          expiryDate: batch.expiryDate,
          originalQuantity: batch.originalQuantity,
          costPrice: batch.costPrice,
          sellingPrice: batch.sellingPrice,
          supplierId: batch.supplierId,
          notes: batch.notes || "",
          ...(isEdit && { isRecalled: batch.isRecalled }),
        }
      : {
          batchNumber: "",
          medicineId: 0,
          manufacturerId: undefined,
          productionDate: new Date().toISOString().split("T")[0],
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          originalQuantity: 0,
          costPrice: 0,
          sellingPrice: 0,
          supplierId: undefined,
          notes: "",
        }
  );

  useEffect(() => {
    if (isEdit && batch) {
      setFormData({
        batchNumber: batch.batchNumber,
        medicineId: batch.medicineId,
        manufacturerId: batch.manufacturerId,
        productionDate: batch.productionDate,
        expiryDate: batch.expiryDate,
        originalQuantity: batch.originalQuantity,
        costPrice: batch.costPrice,
        sellingPrice: batch.sellingPrice,
        supplierId: batch.supplierId,
        notes: batch.notes || "",
        isRecalled: batch.isRecalled,
      });
    }
  }, [batch, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]:
        name === "isRecalled"
          ? value === "true"
          : name === "medicineId" ||
            name === "manufacturerId" ||
            name === "supplierId" ||
            name === "originalQuantity"
          ? parseInt(value)
          : name === "costPrice" || name === "sellingPrice"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleDateChange = (
    date: Date | null,
    field: "productionDate" | "expiryDate"
  ) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        [field]: date.toISOString().split("T")[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FaBox className="text-blue-500" />
        {isEdit ? "Edit Batch Obat" : "Tambah Batch Obat Baru"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kolom 1 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FaBarcode className="text-gray-500" />
                Nomor Batch <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaBarcode className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="batchNumber"
                  value={formData.batchNumber}
                  required
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  onChange={handleChange}
                  placeholder="Masukkan nomor batch"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FaPills className="text-gray-500" />
                Obat <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPills className="text-gray-400" />
                </div>
                <select
                  name="medicineId"
                  value={formData.medicineId}
                  required
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
                  onChange={handleChange}
                >
                  <option value={0}>Pilih obat</option>
                  {medicines.map((medicine) => (
                    <option key={medicine.id} value={medicine.id}>
                      {medicine.name} ({medicine.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FaIndustry className="text-gray-500" />
                Produsen
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaIndustry className="text-gray-400" />
                </div>
                <select
                  name="manufacturerId"
                  value={formData.manufacturerId || ""}
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
                  onChange={handleChange}
                >
                  <option value="">Pilih produsen</option>
                  {manufacturers.map((manufacturer) => (
                    <option key={manufacturer.id} value={manufacturer.id}>
                      {manufacturer.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FaCalendarAlt className="text-gray-500" />
                Tanggal Produksi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <DatePicker
                  selected={
                    formData.productionDate
                      ? new Date(formData.productionDate)
                      : null
                  }
                  onChange={(date: Date | null) =>
                    handleDateChange(date, "productionDate")
                  }
                  dateFormat="yyyy-MM-dd"
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
            </div>
          </motion.div>

          {/* Kolom 2 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FaCalendarTimes className="text-gray-500" />
                Tanggal Kedaluwarsa <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarTimes className="text-gray-400" />
                </div>
                <DatePicker
                  selected={
                    formData.expiryDate ? new Date(formData.expiryDate) : null
                  }
                  onChange={(date: Date | null) =>
                    handleDateChange(date, "expiryDate")
                  }
                  dateFormat="yyyy-MM-dd"
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FaBoxes className="text-gray-500" />
                Jumlah Awal <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaBoxes className="text-gray-400" />
                </div>
                <input
                  type="number"
                  name="originalQuantity"
                  value={formData.originalQuantity}
                  required
                  min={1}
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FaDollarSign className="text-gray-500" />
                Harga Beli <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaDollarSign className="text-gray-400" />
                </div>
                <input
                  type="number"
                  name="costPrice"
                  value={formData.costPrice}
                  required
                  min={0}
                  step="0.01"
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FaTags className="text-gray-500" />
                Harga Jual <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaTags className="text-gray-400" />
                </div>
                <input
                  type="number"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  required
                  min={0}
                  step="0.01"
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  onChange={handleChange}
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FaTruck className="text-gray-500" />
              Pemasok
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaTruck className="text-gray-400" />
              </div>
              <select
                name="supplierId"
                value={formData.supplierId || ""}
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
                onChange={handleChange}
              >
                <option value="">Pilih pemasok</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FaStickyNote className="text-gray-500" />
              Catatan
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                <FaStickyNote className="text-gray-400" />
              </div>
              <textarea
                name="notes"
                value={formData.notes || ""}
                rows={3}
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                onChange={handleChange}
                placeholder="Catatan tambahan tentang batch ini"
              />
            </div>
          </div>

          {isEdit && "isRecalled" in formData && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FaBan className="text-gray-500" />
                Status Recall
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaBan className="text-gray-400" />
                </div>
                <select
                  name="isRecalled"
                  value={String(formData.isRecalled)}
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
                  onChange={handleChange}
                >
                  <option value="false">Aktif</option>
                  <option value="true">Direcall</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-end gap-3 pt-6"
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <FaTimes />
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Menyimpan...
              </>
            ) : (
              <>
                <FaSave />
                {isEdit ? "Simpan Perubahan" : "Tambah Batch"}
              </>
            )}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}
