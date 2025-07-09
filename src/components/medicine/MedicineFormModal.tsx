"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  MedicineFormDto,
  CreateMedicineFormDto,
  UpdateMedicineFormDto,
} from "@/types/medicine";
import MedicineFormForm from "./MedicineFormForm";
import { motion } from "framer-motion";

interface Props {
  open: boolean;
  onClose: () => void;
  medicineForm: MedicineFormDto | null;
  onSave: (
    data: CreateMedicineFormDto | UpdateMedicineFormDto
  ) => Promise<void>;
}

export default function MedicineFormModal({
  open,
  onClose,
  medicineForm,
  onSave,
}: Props) {
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

        <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                  {medicineForm
                    ? "Edit Bentuk Obat"
                    : "Tambah Bentuk Obat Baru"}
                </Dialog.Title>
                <div className="mt-4">
                  <MedicineFormForm
                    medicineForm={medicineForm}
                    onClose={onClose}
                    onSubmit={onSave}
                  />
                </div>
              </motion.div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
