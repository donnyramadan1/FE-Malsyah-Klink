"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { RoleDto } from "@/types/role";
import { UserWithRolesDto } from "@/types/userRole";

interface RoleAssignmentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (userId: number, roleIds: number[]) => Promise<void>;
  user: UserWithRolesDto | null;
  roles: RoleDto[];
}

export default function RoleAssignmentModal({
  open,
  onClose,
  onSave,
  user,
  roles,
}: RoleAssignmentModalProps) {
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && user.roles.length > 0) {
      setSelectedRole(user.roles[0].id);
    } else {
      setSelectedRole(null);
    }
  }, [user]);

  const handleRoleSelect = (roleId: number) => {
    setSelectedRole(roleId);
  };

  const handleSubmit = async () => {
    if (!user || selectedRole === null) return;
    setIsSubmitting(true);
    try {
      await onSave(user.id, [selectedRole]);
      onClose();
    } catch (error) {
      console.error("Gagal memperbarui peran:", error);
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
                  Kelola Peran untuk {user?.fullName}
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-gray-500">
                  Pilih satu peran untuk pengguna ini
                </Dialog.Description>

                <div className="mt-6 space-y-4">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-start">
                      <input
                        type="radio"
                        id={`role-${role.id}`}
                        checked={selectedRole === role.id}
                        onChange={() => handleRoleSelect(role.id)}
                        className="h-4 w-4 mt-1 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`role-${role.id}`}
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        {role.name}
                        <span className="block text-xs text-gray-500">
                          {role.description}
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
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || selectedRole === null}
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
                        Menyimpan...
                      </>
                    ) : (
                      "Simpan Perubahan"
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
