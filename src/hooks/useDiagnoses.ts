/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  DiagnosisDto,
  CreateDiagnosisDto,
  UpdateDiagnosisDto,
} from "@/types/diagnosis";

export function useDiagnoses() {
  const [diagnoses, setDiagnoses] = useState<DiagnosisDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;

  const fetchDiagnoses = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/diagnoses/paged", {
        params: {
          page,
          pageSize,
          search: searchTerm,
        },
      });
      setDiagnoses(res.data.data.items);
      setTotalItems(res.data.data.totalItems);
      setCurrentPage(page);
    } finally {
      setLoading(false);
    }
  };

  const createDiagnosis = async (data: CreateDiagnosisDto) => {
    await api.post("/diagnoses", data);
    await fetchDiagnoses(currentPage);
  };

  const updateDiagnosis = async (id: number, data: UpdateDiagnosisDto) => {
    await api.put(`/diagnoses/${id}`, data);
    await fetchDiagnoses(currentPage);
  };

  const deleteDiagnosis = async (id: number) => {
    await api.delete(`/diagnoses/${id}`);
    await fetchDiagnoses(currentPage);
  };

  useEffect(() => {
    fetchDiagnoses();
  }, [searchTerm]);

  return {
    diagnoses,
    loading,
    currentPage,
    totalItems,
    pageSize,
    searchTerm,
    setSearchTerm,
    fetchDiagnoses,
    createDiagnosis,
    updateDiagnosis,
    deleteDiagnosis,
    setCurrentPage,
  };
}
