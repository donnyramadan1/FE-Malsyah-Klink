/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  PatientDto,
  CreatePatientDto,
  UpdatePatientDto,
  Gender,
  BloodType,
} from "@/types/patient";

type SortableField = keyof Pick<
  PatientDto,
  "name" | "medicalRecordNumber" | "createdAt" | "isActive"
>;
type SortDirection = "asc" | "desc";

export function usePatients() {
  const [patients, setPatients] = useState<PatientDto[]>([]);
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
    fetchPatients(1);
  }, [debouncedSearchTerm, sortField, sortDirection]);

  const fetchPatients = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/patients/paged", {
        params: {
          page,
          pageSize,
          search: debouncedSearchTerm,
          orderBy: sortField,
          ascending: sortDirection === "asc",
        },
      });

      const data = res.data.data;
      setPatients(data.items);
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

  const createPatient = async (data: CreatePatientDto) => {
    // Tidak perlu mengirim MRN, akan di-generate di backend
    const { medicalRecordNumber, ...patientData } = data;
    const res = await api.post("/patients", patientData);
    await fetchPatients(currentPage);
    return res.data;
  };

  const updatePatient = async (id: number, data: UpdatePatientDto) => {
    await api.put(`/patients/${id}`, data);
    await fetchPatients(currentPage);
  };

  const deletePatient = async (id: number) => {
    await api.delete(`/patients/${id}`);
    await fetchPatients(currentPage);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return {
    patients,
    loading,
    currentPage,
    totalItems,
    pageSize,
    searchTerm,
    sortField,
    sortDirection,
    fetchPatients,
    createPatient,
    updatePatient,
    deletePatient,
    setCurrentPage,
    handleSearch,
    handleSort,
    Gender,
    BloodType,
  };
}
