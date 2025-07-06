/* eslint-disable @typescript-eslint/no-explicit-any */
// components/roles/RoleForm.tsx
"use client";
import { useState, useEffect } from "react";
import { CreateRoleDto, UpdateRoleDto, RoleDto } from "@/types/role";
import { motion } from "framer-motion";

type FormData = CreateRoleDto | UpdateRoleDto;

interface Props {
  role?: RoleDto | null;
  onSubmit: (data: FormData) => Promise<void>;
  onClose: () => void;
}

export default function RoleForm({ role, onSubmit, onClose }: Props) {
  const isEdit = !!role;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(
    isEdit
      ? {
          description: role?.description ?? "",
        }
      : {
          name: "",
          description: "",
        }
  );

  useEffect(() => {
    if (isEdit && role) {
      setFormData({
        description: role.description,
      });
    }
  }, [role, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? "Edit Role" : "Create New Role"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isEdit && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role Name
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                onChange={handleChange}
                placeholder="Enter role name"
                value={(formData as CreateRoleDto).name || ""}
              />
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              onChange={handleChange}
              placeholder="Role description"
              value={formData.description}
            />
          </div>
        </motion.div>

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
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
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
            {isEdit ? "Save Changes" : "Create Role"}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}
