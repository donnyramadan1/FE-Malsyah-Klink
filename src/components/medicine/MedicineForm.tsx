/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import {
  CreateMedicineDto,
  UpdateMedicineDto,
  MedicineDto,
  MedicineFormDto,
  DosageUnitDto,
} from "@/types/medicine";
import { motion } from "framer-motion";

type FormData = CreateMedicineDto | UpdateMedicineDto;

interface Props {
  medicine?: MedicineDto | null;
  medicineForms: MedicineFormDto[];
  dosageUnits: DosageUnitDto[];
  onSubmit: (data: FormData) => Promise<void>;
  onClose: () => void;
}

export default function MedicineForm({
  medicine,
  medicineForms,
  dosageUnits,
  onSubmit,
  onClose,
}: Props) {
  const isEdit = !!medicine;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(
    isEdit
      ? {
          name: medicine?.name ?? "",
          code: medicine?.code ?? "",
          formId: medicine?.formId ?? 0,
          dosageUnitId: medicine?.dosageUnitId ?? 0,
          minStockLevel: medicine?.minStockLevel ?? 0,
          ...(isEdit && { isActive: medicine?.isActive ?? true }),
        }
      : {
          name: "",
          code: "",
          formId: 0,
          dosageUnitId: 0,
          minStockLevel: 0,
        }
  );

  useEffect(() => {
    if (isEdit && medicine) {
      setFormData({
        name: medicine.name,
        code: medicine.code,
        formId: medicine.formId,
        dosageUnitId: medicine.dosageUnitId,
        minStockLevel: medicine.minStockLevel,
        isActive: medicine.isActive,
      });
    }
  }, [medicine, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]:
        name === "isActive"
          ? value === "true"
          : name === "formId" ||
            name === "dosageUnitId" ||
            name === "minStockLevel"
          ? parseInt(value)
          : value,
    }));
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? "Edit Obat" : "Tambah Obat Baru"}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Obat <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                onChange={handleChange}
                placeholder="Masukkan nama obat"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kode Obat <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                onChange={handleChange}
                placeholder="Kode unik obat"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bentuk Obat <span className="text-red-500">*</span>
              </label>
              <select
                name="formId"
                value={formData.formId}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                onChange={handleChange}
              >
                <option value={0}>Pilih bentuk obat</option>
                {medicineForms.map((form) => (
                  <option key={form.id} value={form.id}>
                    {form.name}
                  </option>
                ))}
              </select>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Satuan Dosis <span className="text-red-500">*</span>
              </label>
              <select
                name="dosageUnitId"
                value={formData.dosageUnitId}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                onChange={handleChange}
              >
                <option value={0}>Pilih satuan</option>
                {dosageUnits.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stok Minimum <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="minStockLevel"
                value={formData.minStockLevel}
                required
                min={0}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                onChange={handleChange}
                placeholder="Jumlah minimal persediaan"
              />
            </div>

            {isEdit && "isActive" in formData && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="isActive"
                  value={String(formData.isActive)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  onChange={handleChange}
                >
                  <option value="true">Aktif</option>
                  <option value="false">Nonaktif</option>
                </select>
              </div>
            )}
          </motion.div>
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
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg shadow-sm transition-all disabled:opacity-50 flex items-center"
          >
            {isSubmitting && (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
            )}
            {isEdit ? "Simpan Perubahan" : "Tambah Obat"}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}
