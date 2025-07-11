"use client";
import { useUsers } from "@/hooks/useUsers";
import UserTable from "@/components/users/UserTable";
import UserModal from "@/components/users/UserModal";
import { useState } from "react";
import { CreateUserDto, UpdateUserDto, UserDto } from "@/types/user";
import { motion } from "framer-motion";
import { FaPlus, FaUserCog } from "react-icons/fa";

export default function UserPage() {
  const {
    users,
    loading,
    currentPage,
    totalItems,
    pageSize,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    setCurrentPage,
    searchTerm,
    handleSearch,
    sortField,
    sortDirection,
    handleSort,
  } = useUsers();

  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [open, setOpen] = useState(false);

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await fetchUsers(page);
  };

  return (
    <div className="p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <FaUserCog className="text-3xl text-[#1a4b7e]" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Manajemen Pengguna
              </h1>
              <p className="text-gray-500 mt-1">Kelola data pengguna sistem</p>
            </div>
          </div>
          <div className="flex items-center gap-3">          
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedUser(null);
                setOpen(true);
              }}
              className="bg-gradient-to-r from-[#0f355d] to-[#1a4b7e] hover:from-[#1a4b7e] hover:to-[#0f355d] text-white py-2 px-6 rounded-lg transition-all shadow-md flex items-center gap-2"
            >
              <FaPlus className="h-4 w-4" />
              Tambah User
            </motion.button>
          </div>
        </div>

        <UserTable
          users={users}
          loading={loading}
          onEdit={(user) => {
            setSelectedUser(user);
            setOpen(true);
          }}
          onDelete={deleteUser}
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          searchTerm={searchTerm}
          onSearch={handleSearch}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        <UserModal
          open={open}
          onClose={() => setOpen(false)}
          user={selectedUser}
          onSave={async (data) => {
            if (selectedUser) {
              await updateUser(selectedUser.id, data as UpdateUserDto);
            } else {
              await createUser(data as CreateUserDto);
            }
            setOpen(false);
          }}
        />
      </motion.div>
    </div>
  );
}
