"use client";
import { useState, useEffect } from "react";
import { CreateMenuDto, UpdateMenuDto, MenuDto } from "@/types/menu";
import { motion } from "framer-motion";

type FormData = CreateMenuDto | UpdateMenuDto;

interface Props {
  menu?: MenuDto | null;
  onSubmit: (data: FormData) => Promise<void>;
  onClose: () => void;
  parentMenus: MenuDto[];
}

export default function MenuForm({
  menu,
  onSubmit,
  onClose,
  parentMenus,
}: Props) {
  const isEdit = !!menu;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(
    isEdit
      ? {
          parentId: menu?.parentId ?? null,
          title: menu?.title ?? "",
          icon: menu?.icon ?? "",
          path: menu?.path ?? "",
          orderNum: menu?.orderNum ?? 0,
          ...(isEdit && { isActive: menu?.isActive ?? true }),
        }
      : {
          parentId: null,
          title: "",
          icon: "",
          path: "",
          orderNum: 0,
        }
  );

  useEffect(() => {
    if (isEdit && menu) {
      setFormData({
        parentId: menu.parentId,
        title: menu.title,
        icon: menu.icon,
        path: menu.path,
        orderNum: menu.orderNum,
        isActive: menu.isActive,
      });
    }
  }, [menu, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFormData((prev: any) => ({
      ...prev,
      [name]:
        name === "isActive"
          ? value === "true"
          : name === "orderNum"
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
      className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? "Edit Menu" : "Create New Menu"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent Menu
            </label>
            <select
              name="parentId"
              value={formData.parentId || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              onChange={handleChange}
            >
              <option value="">No Parent</option>
              {parentMenus.map((menu) => (
                <option key={menu.id} value={menu.id}>
                  {menu.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              onChange={handleChange}
              placeholder="Menu Title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              onChange={handleChange}
              placeholder="Icon class or name"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Path
            </label>
            <input
              type="text"
              name="path"
              value={formData.path}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              onChange={handleChange}
              placeholder="/path"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Number
            </label>
            <input
              type="number"
              name="orderNum"
              value={formData.orderNum}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              onChange={handleChange}
              placeholder="0"
            />
          </div>
        </motion.div>

        {isEdit && "isActive" in formData && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="isActive"
              value={String(formData.isActive)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              onChange={handleChange}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
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
            {isEdit ? "Save Changes" : "Create Menu"}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}
