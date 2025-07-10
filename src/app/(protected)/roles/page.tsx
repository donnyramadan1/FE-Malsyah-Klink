"use client";
import { useRoles } from "@/hooks/useRoles";
import RoleTable from "@/components/roles/RoleTable";
import RoleModal from "@/components/roles/RoleModal";
import { useState } from "react";
import { CreateRoleDto, UpdateRoleDto, RoleDto } from "@/types/role";
import { motion } from "framer-motion";

export default function RolePage() {
  const {
    roles,
    loading,
    currentPage,
    totalItems,
    pageSize,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    setCurrentPage,
    searchTerm,
    handleSearch,
    sortField,
    sortDirection,
    handleSort,
  } = useRoles();

  const [selectedRole, setSelectedRole] = useState<RoleDto | null>(null);
  const [open, setOpen] = useState(false);

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await fetchRoles(page);
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
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Manajemen Peran
            </h1>
            <p className="text-gray-500 mt-1">Kelola peran dan izin sistem</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedRole(null);
              setOpen(true);
            }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-6 rounded-lg transition-all shadow-md flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Role
          </motion.button>
        </div>

        <RoleTable
          roles={roles}
          loading={loading}
          onEdit={(role) => {
            setSelectedRole(role);
            setOpen(true);
          }}
          onDelete={deleteRole}
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

        <RoleModal
          open={open}
          onClose={() => setOpen(false)}
          role={selectedRole}
          onSave={async (data) => {
            if (selectedRole) {
              await updateRole(selectedRole.id, data as UpdateRoleDto);
            } else {
              await createRole(data as CreateRoleDto);
            }
            setOpen(false);
          }}
        />
      </motion.div>
    </div>
  );
}
