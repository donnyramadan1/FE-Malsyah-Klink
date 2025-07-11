/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { CreateUserDto, UpdateUserDto, UserDto } from "@/types/user";
import { motion } from "framer-motion";
import {
  FaUser,
  FaKey,
  FaEnvelope,
  FaUserTag,
  FaCheckCircle,
  FaTimesCircle,
  FaSave,
  FaTimes,
} from "react-icons/fa";

type FormData = CreateUserDto | UpdateUserDto;

interface Props {
  user?: UserDto | null;
  onSubmit: (data: FormData) => Promise<void>;
  onClose: () => void;
}

export default function UserForm({ user, onSubmit, onClose }: Props) {
  const isEdit = !!user;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(
    isEdit
      ? {
          email: user?.email ?? "",
          fullName: user?.fullName ?? "",
          isActive: user?.isActive ?? true,
        }
      : {
          username: "",
          password: "",
          email: "",
          fullName: "",
        }
  );

  useEffect(() => {
    if (isEdit && user) {
      setFormData({
        email: user.email,
        fullName: user.fullName,
        isActive: user.isActive,
      });
    }
  }, [user, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: name === "isActive" ? value === "true" : value,
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
      className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FaUser className="text-[#1a4b7e]" />
        {isEdit ? "Edit User" : "Buat User Baru"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isEdit && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FaUser className="text-gray-500" />
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  required
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a4b7e] focus:border-[#1a4b7e] transition-all"
                  onChange={handleChange}
                  placeholder="Masukkan username"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FaKey className="text-gray-500" />
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaKey className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a4b7e] focus:border-[#1a4b7e] transition-all"
                  onChange={handleChange}
                  placeholder="Masukkan password"
                />
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FaEnvelope className="text-gray-500" />
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                required
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a4b7e] focus:border-[#1a4b7e] transition-all"
                onChange={handleChange}
                placeholder="user@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FaUserTag className="text-gray-500" />
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUserTag className="text-gray-400" />
              </div>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                required
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a4b7e] focus:border-[#1a4b7e] transition-all"
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>
          </div>
        </motion.div>

        {isEdit && "isActive" in formData && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              {formData.isActive ? (
                <FaCheckCircle className="text-green-500" />
              ) : (
                <FaTimesCircle className="text-red-500" />
              )}
              Status
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {formData.isActive ? (
                  <FaCheckCircle className="text-gray-400" />
                ) : (
                  <FaTimesCircle className="text-gray-400" />
                )}
              </div>
              <select
                name="isActive"
                value={String(formData.isActive)}
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a4b7e] focus:border-[#1a4b7e] transition-all appearance-none"
                onChange={handleChange}
              >
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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
            className="px-5 py-2.5 bg-gradient-to-r from-[#0f355d] to-[#1a4b7e] hover:from-[#1a4b7e] hover:to-[#0f355d] text-white rounded-lg shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
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
                {isEdit ? "Simpan Perubahan" : "Buat User"}
              </>
            )}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}
