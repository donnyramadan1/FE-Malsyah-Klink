"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { MenuDto } from "@/types/menu";
import { RoleDto } from "@/types/role";
import { MenuWithRolesDto, RoleWithMenusDto } from "@/types/menuRole";

interface MenuRoleAssignmentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    menuId?: number;
    roleId?: number;
    targetIds: number[];
  }) => Promise<void>;
  mode: "menu" | "role";
  currentItem: MenuWithRolesDto | RoleWithMenusDto | null;
  allItems: (MenuDto | RoleDto)[];
}

export default function MenuRoleAssignmentModal({
  open,
  onClose,
  onSave,
  mode,
  currentItem,
  allItems,
}: MenuRoleAssignmentModalProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentItem) {
      setSelectedItems(
        mode === "menu"
          ? (currentItem as MenuWithRolesDto).roles.map((r) => r.id)
          : (currentItem as RoleWithMenusDto).menus.map((m) => m.id)
      );
    }
  }, [currentItem, mode]);

  const handleItemToggle = (itemId: number) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSubmit = async () => {
    if (!currentItem) return;
    setIsSubmitting(true);
    try {
      await onSave({
        [mode === "menu" ? "menuId" : "roleId"]: currentItem.id,
        targetIds: selectedItems,
      });
      onClose();
    } catch (error) {
      console.error("Failed to update assignments:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title className="text-xl font-bold text-gray-900">
                  {mode === "menu"
                    ? `Manage Roles for Menu: ${
                        (currentItem as MenuWithRolesDto)?.title
                      }`
                    : `Manage Menus for Role: ${
                        (currentItem as RoleWithMenusDto)?.name
                      }`}
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-gray-500">
                  {mode === "menu"
                    ? "Select which roles can access this menu"
                    : "Select which menus this role can access"}
                </Dialog.Description>

                <div className="mt-6 space-y-3 max-h-96 overflow-y-auto">
                  {allItems.map((item) => (
                    <div key={item.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`item-${item.id}`}
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleItemToggle(item.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`item-${item.id}`}
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        {"name" in item ? item.name : item.title}
                        <span className="block text-xs text-gray-500">
                          {"description" in item
                            ? item.description
                            : "path" in item
                            ? (item as MenuDto).path
                            : ""}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
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
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
