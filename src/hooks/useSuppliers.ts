/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  SupplierDto,
  CreateSupplierDto,
  UpdateSupplierDto,
} from "@/types/supplier";

type SortableField = keyof Pick<
  SupplierDto,
  "name" | "contactPerson" | "email" | "createdAt"
>;
type SortDirection = "asc" | "desc";

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<SupplierDto[]>([]);
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
    fetchSuppliers(1);
  }, [debouncedSearchTerm, sortField, sortDirection]);

  const fetchSuppliers = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/suppliers/paged", {
        params: {
          page,
          pageSize,
          search: debouncedSearchTerm,
          orderBy: sortField,
          ascending: sortDirection === "asc",
        },
      });

      const data = res.data.data;
      setSuppliers(data.items);
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

  const createSupplier = async (data: CreateSupplierDto) => {
    await api.post("/suppliers", data);
    await fetchSuppliers(currentPage);
  };

  const updateSupplier = async (id: number, data: UpdateSupplierDto) => {
    await api.put(`/suppliers/${id}`, data);
    await fetchSuppliers(currentPage);
  };

  const deleteSupplier = async (id: number) => {
    await api.delete(`/suppliers/${id}`);
    await fetchSuppliers(currentPage);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return {
    suppliers,
    loading,
    currentPage,
    totalItems,
    pageSize,
    searchTerm,
    sortField,
    sortDirection,
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    setCurrentPage,
    handleSearch,
    handleSort,
  };
}
