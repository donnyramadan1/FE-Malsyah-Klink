/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { MenuDto, CreateMenuDto, UpdateMenuDto } from "@/types/menu";

type SortableField = "title" | "path" | "orderNum" | "isActive";
type SortDirection = "asc" | "desc";

export function useMenus() {
  const [menus, setMenus] = useState<MenuDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [sortField, setSortField] = useState<SortableField>("orderNum");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const pageSize = 10;

  // Debounce logic: tunggu 500ms setelah user berhenti mengetik
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // Trigger fetchMenus ketika debouncedSearchTerm berubah
  useEffect(() => {
    fetchMenus(1); // Reset ke page 1 saat search berubah
  }, [debouncedSearchTerm]);

  // Fetch data dari API
  const fetchMenus = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/menus/paged", {
        params: {
          page,
          pageSize,
          search: debouncedSearchTerm,
          orderBy: sortField,
          ascending: sortDirection === "asc",
        },
      });

      const data = res.data.data;
      setMenus(data.items);
      setCurrentPage(data.page);
      setTotalItems(data.totalItems);
    } finally {
      setLoading(false);
    }
  };

  // Saat user ketik di input search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Saat user klik sort
  const handleSort = async (field: SortableField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
    await fetchMenus(1);
  };

  // CRUD operations
  const createMenu = async (data: CreateMenuDto) => {
    await api.post("/menus", data);
    await fetchMenus(currentPage);
  };

  const updateMenu = async (id: number, data: UpdateMenuDto) => {
    await api.put(`/menus/${id}`, data);
    await fetchMenus(currentPage);
  };

  const deleteMenu = async (id: number) => {
    await api.delete(`/menus/${id}`);
    await fetchMenus(currentPage);
  };

  // Initial load
  useEffect(() => {
    fetchMenus();
  }, []);

  return {
    menus,
    loading,
    currentPage,
    totalItems,
    pageSize,
    searchTerm,
    sortField,
    sortDirection,
    fetchMenus,
    createMenu,
    updateMenu,
    deleteMenu,
    setCurrentPage,
    handleSearch,
    handleSort,
  };
}
