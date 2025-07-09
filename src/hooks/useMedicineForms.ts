/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  MedicineFormDto,
  CreateMedicineFormDto,
  UpdateMedicineFormDto,
} from "@/types/medicine";

export function useMedicineForms() {
  const [medicineForms, setMedicineForms] = useState<MedicineFormDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;

  const fetchMedicineForms = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/medicine-forms/paged", {
        params: {
          page,
          pageSize,
          search: searchTerm,
        },
      });
      setMedicineForms(res.data.data.items);
      setTotalItems(res.data.data.totalItems);
      setCurrentPage(page);
    } finally {
      setLoading(false);
    }
  };

  const createMedicineForm = async (data: CreateMedicineFormDto) => {
    await api.post("/medicine-forms", data);
    await fetchMedicineForms(currentPage);
  };

  const updateMedicineForm = async (
    id: number,
    data: UpdateMedicineFormDto
  ) => {
    await api.put(`/medicine-forms/${id}`, data);
    await fetchMedicineForms(currentPage);
  };

  const deleteMedicineForm = async (id: number) => {
    await api.delete(`/medicine-forms/${id}`);
    await fetchMedicineForms(currentPage);
  };

  useEffect(() => {
    fetchMedicineForms();
  }, [searchTerm]);

  return {
    medicineForms,
    loading,
    currentPage,
    totalItems,
    pageSize,
    searchTerm,
    setSearchTerm,
    fetchMedicineForms,
    createMedicineForm,
    updateMedicineForm,
    deleteMedicineForm,
    setCurrentPage,
  };
}
