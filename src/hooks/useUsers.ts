/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { UserDto, CreateUserDto, UpdateUserDto } from "@/types/user";

type SortableField = keyof Pick<
  UserDto,
  "username" | "email" | "fullName" | "isActive"
>;
type SortDirection = "asc" | "desc";

export function useUsers() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [sortField, setSortField] = useState<SortableField>("username");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const pageSize = 10;

  // Debounce logic: wait 500ms after user stops typing
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // Trigger fetchUsers when debouncedSearchTerm changes
  useEffect(() => {
    fetchUsers(1); // Reset to page 1 when search changes
  }, [debouncedSearchTerm]);

  // Fetch data from API
  const fetchUsers = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/users/paged", {
        params: {
          page,
          pageSize,
          search: debouncedSearchTerm,
          orderBy: sortField,
          ascending: sortDirection === "asc",
        },
      });

      const data = res.data.data;
      setUsers(data.items);
      setCurrentPage(data.page);
      setTotalItems(data.totalItems);
    } finally {
      setLoading(false);
    }
  };

  // When user types in search input
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // When user clicks sort
  const handleSort = async (field: SortableField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
    await fetchUsers(1);
  };

  // CRUD operations
  const createUser = async (data: CreateUserDto) => {
    await api.post("/users", data);
    await fetchUsers(currentPage);
  };

  const updateUser = async (id: number, data: UpdateUserDto) => {
    await api.put(`/users/${id}`, data);
    await fetchUsers(currentPage);
  };

  const deleteUser = async (id: number) => {
    await api.delete(`/users/${id}`);
    await fetchUsers(currentPage);
  };

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    currentPage,
    totalItems,
    pageSize,
    searchTerm,
    sortField,
    sortDirection,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    setCurrentPage,
    handleSearch,
    handleSort,
  };
}
