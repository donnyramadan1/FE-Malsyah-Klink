/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  BatchDto,
  CreateBatchDto,
  UpdateBatchDto,
  ManufacturerDto,
  SupplierDto,
} from "@/types/batch";
import { MedicineDto } from "@/types/medicine";

type SortableField = keyof Pick<
  BatchDto,
  | "batchNumber"
  | "expiryDate"
  | "productionDate"
  | "remainingQuantity"
  | "createdAt"
>;
type SortDirection = "asc" | "desc";

export function useBatches() {
  const [batches, setBatches] = useState<BatchDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [sortField, setSortField] = useState<SortableField>("expiryDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [medicines, setMedicines] = useState<MedicineDto[]>([]);
  const [manufacturers, setManufacturers] = useState<ManufacturerDto[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierDto[]>([]);

  const pageSize = 10;

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  useEffect(() => {
    fetchMedicines();
    fetchManufacturers();
    fetchSuppliers();
    fetchBatches(1);
  }, [debouncedSearchTerm, sortField, sortDirection]);

  const fetchMedicines = async () => {
    try {
      const res = await api.get("/medicines");
      setMedicines(res.data.data);
    } catch (error) {
      console.error("Failed to fetch medicines", error);
    }
  };

  const fetchManufacturers = async () => {
    try {
      const res = await api.get("/manufacturers");
      setManufacturers(res.data.data);
    } catch (error) {
      console.error("Failed to fetch manufacturers", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await api.get("/suppliers");
      setSuppliers(res.data.data);
    } catch (error) {
      console.error("Failed to fetch suppliers", error);
    }
  };

  const fetchBatches = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/batches/paged", {
        params: {
          page,
          pageSize,
          search: debouncedSearchTerm,
          orderBy: sortField,
          ascending: sortDirection === "asc",
        },
      });

      const data = res.data.data;
      setBatches(data.items);
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

  const createBatch = async (data: CreateBatchDto) => {
    await api.post("/batches", data);
    await fetchBatches(currentPage);
  };

  const updateBatch = async (id: number, data: UpdateBatchDto) => {
    await api.put(`/batches/${id}`, data);
    await fetchBatches(currentPage);
  };

  const deleteBatch = async (id: number) => {
    await api.delete(`/batches/${id}`);
    await fetchBatches(currentPage);
  };

  return {
    batches,
    medicines,
    manufacturers,
    suppliers,
    loading,
    currentPage,
    totalItems,
    pageSize,
    searchTerm,
    sortField,
    sortDirection,
    fetchBatches,
    createBatch,
    updateBatch,
    deleteBatch,
    setCurrentPage,
    handleSearch,
    handleSort,
  };
}
