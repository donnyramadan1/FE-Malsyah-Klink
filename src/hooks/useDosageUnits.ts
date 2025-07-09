/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  DosageUnitDto,
  CreateDosageUnitDto,
  UpdateDosageUnitDto,
} from "@/types/medicine";

export function useDosageUnits() {
  const [dosageUnits, setDosageUnits] = useState<DosageUnitDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;

  const fetchDosageUnits = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/dosage-units/paged", {
        params: {
          page,
          pageSize,
          search: searchTerm,
        },
      });
      setDosageUnits(res.data.data.items);
      setTotalItems(res.data.data.totalItems);
      setCurrentPage(page);
    } finally {
      setLoading(false);
    }
  };

  const createDosageUnit = async (data: CreateDosageUnitDto) => {
    await api.post("/dosage-units", data);
    await fetchDosageUnits(currentPage);
  };

  const updateDosageUnit = async (id: number, data: UpdateDosageUnitDto) => {
    await api.put(`/dosage-units/${id}`, data);
    await fetchDosageUnits(currentPage);
  };

  const deleteDosageUnit = async (id: number) => {
    await api.delete(`/dosage-units/${id}`);
    await fetchDosageUnits(currentPage);
  };

  useEffect(() => {
    fetchDosageUnits();
  }, [searchTerm]);

  return {
    dosageUnits,
    loading,
    currentPage,
    totalItems,
    pageSize,
    searchTerm,
    setSearchTerm,
    fetchDosageUnits,
    createDosageUnit,
    updateDosageUnit,
    deleteDosageUnit,
    setCurrentPage,
  };
}
