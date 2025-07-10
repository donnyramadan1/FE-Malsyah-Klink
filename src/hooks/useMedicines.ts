/* eslint-disable react-hooks/exhaustive-deps */
// src/hooks/useMedicines.ts
import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  MedicineDto,
  CreateMedicineDto,
  UpdateMedicineDto,
  MedicineFormDto,
  DosageUnitDto,
} from "@/types/medicine";

type SortableField = keyof Pick<
  MedicineDto,
  "name" | "code" | "stockQuantity" | "isActive" | "createdAt"
>;
type SortDirection = "asc" | "desc";

export function useMedicines() {
  const [medicines, setMedicines] = useState<MedicineDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [sortField, setSortField] = useState<SortableField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [medicineForms, setMedicineForms] = useState<MedicineFormDto[]>([]);
  const [dosageUnits, setDosageUnits] = useState<DosageUnitDto[]>([]);

  const pageSize = 10;

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  useEffect(() => {
    fetchMedicineForms();
    fetchDosageUnits();
    fetchMedicines(1);
  }, [debouncedSearchTerm, sortField, sortDirection]);

  const fetchMedicineForms = async () => {
    try {
      const res = await api.get("/medicine-forms");
      setMedicineForms(res.data.data);
    } catch (error) {
      console.error("Failed to fetch medicine forms", error);
    }
  };

  const fetchDosageUnits = async () => {
    try {
      const res = await api.get("/dosage-units");
      setDosageUnits(res.data.data);
    } catch (error) {
      console.error("Failed to fetch dosage units", error);
    }
  };

  const fetchMedicines = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/medicines/paged", {
        params: {
          page,
          pageSize,
          search: debouncedSearchTerm,
          orderBy: sortField,
          ascending: sortDirection === "asc",
        },
      });

      const data = res.data.data;
      setMedicines(data.items);
      setCurrentPage(data.page);
      setTotalItems(data.totalItems);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSort = async (field: SortableField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  };

  const createMedicine = async (data: CreateMedicineDto) => {
    await api.post("/medicines", data);
    await fetchMedicines(currentPage);
  };

  const updateMedicine = async (id: number, data: UpdateMedicineDto) => {
    await api.put(`/medicines/${id}`, data);
    await fetchMedicines(currentPage);
  };

  const deleteMedicine = async (id: number) => {
    await api.delete(`/medicines/${id}`);
    await fetchMedicines(currentPage);
  };

  return {
    medicines,
    medicineForms,
    dosageUnits,
    loading,
    currentPage,
    totalItems,
    pageSize,
    searchTerm,
    sortField,
    sortDirection,
    fetchMedicines,
    createMedicine,
    updateMedicine,
    deleteMedicine,
    setCurrentPage,
    handleSearch,
    handleSort,
  };
}
