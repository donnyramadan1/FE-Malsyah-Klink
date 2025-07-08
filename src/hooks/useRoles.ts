/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { RoleDto, CreateRoleDto, UpdateRoleDto } from "@/types/role";

type SortableField = keyof Pick<RoleDto, "name" | "createdAt">;
type SortDirection = "asc" | "desc";

export function useRoles() {
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [sortField, setSortField] = useState<SortableField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const pageSize = 10;

  // Debounce logic
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // Trigger fetch when search term changes
  useEffect(() => {
    fetchRoles(1);
  }, [debouncedSearchTerm]);

  // Fetch roles with pagination
  const fetchRoles = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/roles/paged", {
        params: {
          page,
          pageSize,
          search: debouncedSearchTerm,
          orderBy: sortField,
          ascending: sortDirection === "asc",
        },
      });

      const data = res.data.data;
      setRoles(data.items);
      setCurrentPage(data.page);
      setTotalItems(data.totalItems);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Handle sort
  const handleSort = async (field: SortableField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
    await fetchRoles(1);
  };

  // CRUD operations
  const createRole = async (data: CreateRoleDto) => {
    await api.post("/roles", data);
    await fetchRoles(currentPage);
  };

  const updateRole = async (id: number, data: UpdateRoleDto) => {
    await api.put(`/roles/${id}`, data);
    await fetchRoles(currentPage);
  };

  const deleteRole = async (id: number) => {
    await api.delete(`/roles/${id}`);
    await fetchRoles(currentPage);
  };

  // Initial load
  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    loading,
    currentPage,
    totalItems,
    pageSize,
    searchTerm,
    sortField,
    sortDirection,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    setCurrentPage,
    handleSearch,
    handleSort,
  };
}
