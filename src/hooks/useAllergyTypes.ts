/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  AllergyTypeDto,
  CreateAllergyTypeDto,
  UpdateAllergyTypeDto,
} from "@/types/allergy";

export function useAllergyTypes() {
  const [allergyTypes, setAllergyTypes] = useState<AllergyTypeDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;

  const fetchAllergyTypes = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/allergy-types/paged", {
        params: {
          page,
          pageSize,
          search: searchTerm,
        },
      });
      setAllergyTypes(res.data.data.items);
      setTotalItems(res.data.data.totalItems);
      setCurrentPage(page);
    } finally {
      setLoading(false);
    }
  };

  const createAllergyType = async (data: CreateAllergyTypeDto) => {
    await api.post("/allergy-types", data);
    await fetchAllergyTypes(currentPage);
  };

  const updateAllergyType = async (id: number, data: UpdateAllergyTypeDto) => {
    await api.put(`/allergy-types/${id}`, data);
    await fetchAllergyTypes(currentPage);
  };

  const deleteAllergyType = async (id: number) => {
    await api.delete(`/allergy-types/${id}`);
    await fetchAllergyTypes(currentPage);
  };

  useEffect(() => {
    fetchAllergyTypes();
  }, [searchTerm]);

  return {
    allergyTypes,
    loading,
    currentPage,
    totalItems,
    pageSize,
    searchTerm,
    setSearchTerm,
    fetchAllergyTypes,
    createAllergyType,
    updateAllergyType,
    deleteAllergyType,
    setCurrentPage,
  };
}
