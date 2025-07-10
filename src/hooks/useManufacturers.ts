/* eslint-disable react-hooks/exhaustive-deps */
// src/hooks/useManufacturers.ts
import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  ManufacturerDto,
  CreateManufacturerDto,
  UpdateManufacturerDto,
} from "@/types/manufacturer";

type SortableField = keyof Pick<
  ManufacturerDto,
  "name" | "licenseNumber" | "country" | "isActive" | "createdAt"
>;
type SortDirection = "asc" | "desc";

export function useManufacturers() {
  const [manufacturers, setManufacturers] = useState<ManufacturerDto[]>([]);
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
    fetchManufacturers(1);
  }, [debouncedSearchTerm, sortField, sortDirection]);

  const fetchManufacturers = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/manufacturers/paged", {
        params: {
          page,
          pageSize,
          search: debouncedSearchTerm,
          orderBy: sortField,
          ascending: sortDirection === "asc",
        },
      });

      const data = res.data.data;
      setManufacturers(data.items);
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

  const createManufacturer = async (data: CreateManufacturerDto) => {
    await api.post("/manufacturers", data);
    await fetchManufacturers(currentPage);
  };

  const updateManufacturer = async (
    id: number,
    data: UpdateManufacturerDto
  ) => {
    await api.put(`/manufacturers/${id}`, data);
    await fetchManufacturers(currentPage);
  };

  const deleteManufacturer = async (id: number) => {
    await api.delete(`/manufacturers/${id}`);
    await fetchManufacturers(currentPage);
  };

  useEffect(() => {
    fetchManufacturers();
  }, []);

  return {
    manufacturers,
    loading,
    currentPage,
    totalItems,
    pageSize,
    searchTerm,
    sortField,
    sortDirection,
    fetchManufacturers,
    createManufacturer,
    updateManufacturer,
    deleteManufacturer,
    setCurrentPage,
    handleSearch,
    handleSort,
  };
}
