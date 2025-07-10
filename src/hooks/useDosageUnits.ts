/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  DosageUnitDto,
  CreateDosageUnitDto,
  UpdateDosageUnitDto,
} from "@/types/dosage-unit";

type SortableField = keyof Pick<
  DosageUnitDto,
  "name" | "code" | "isActive" | "createdAt"
>;
type SortDirection = "asc" | "desc";

export function useDosageUnits() {
  const [dosageUnits, setDosageUnits] = useState<DosageUnitDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [sortField, setSortField] = useState<SortableField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const pageSize = 10;

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  useEffect(() => {
    fetchDosageUnits(1);
  }, [debouncedSearchTerm, sortField, sortDirection]);

  const fetchDosageUnits = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/dosage-units/paged", {
        params: {
          page,
          pageSize,
          search: debouncedSearchTerm,
          orderBy: sortField,
          ascending: sortDirection === "asc",
        },
      });

      const data = res.data.data;
      setDosageUnits(data.items);
      setCurrentPage(data.page);
      setTotalItems(data.totalItems);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSort = (field: SortableField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
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

  return {
    dosageUnits,
    loading,
    currentPage,
    totalItems,
    pageSize,
    searchTerm,
    sortField,
    sortDirection,
    fetchDosageUnits,
    createDosageUnit,
    updateDosageUnit,
    deleteDosageUnit,
    setCurrentPage,
    handleSearch,
    handleSort,
  };
}
