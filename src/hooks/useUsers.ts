"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { UserDto, CreateUserDto, UpdateUserDto } from "@/types/user";

export function useUsers() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await api.get("/users");
    setUsers(res.data.data);
    setLoading(false);
  };

  const createUser = async (data: CreateUserDto) => {
    const res = await api.post("/users", data);
    await fetchUsers();
    return res.data.data;
  };

  const updateUser = async (id: number, data: UpdateUserDto) => {
    await api.put(`/users/${id}`, data);
    await fetchUsers();
  };

  const deleteUser = async (id: number) => {
    await api.delete(`/users/${id}`);
    await fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}
