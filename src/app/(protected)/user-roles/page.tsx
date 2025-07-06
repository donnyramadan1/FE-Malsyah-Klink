"use client";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useRoles } from "@/hooks/useRoles";
import UserRoleTable from "@/components/user-roles/UserRoleTable";
import RoleAssignmentModal from "@/components/user-roles/UserRoleAssignmentModal";
import { useState } from "react";
import { motion } from "framer-motion";
import { UserWithRolesDto } from "@/types/userRole";

export default function UserRolesPage() {
  const { usersWithRoles, loading, error, updateRoleAssignments } =
    useUserRoles();
  const { roles } = useRoles();
  const [selectedUser, setSelectedUser] = useState<UserWithRolesDto | null>(
    null
  );

  const handleEdit = (userId: number) => {
    const user = usersWithRoles.find((u) => u.id === userId) || null;
    setSelectedUser(user);
  };

  const handleSaveRoles = async (userId: number, roleIds: number[]) => {
    await updateRoleAssignments({ userId, roleIds });
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
              User Role Management
            </h1>
            <p className="text-gray-500 mt-1">
              Manage which roles are assigned to each user
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <UserRoleTable
          data={usersWithRoles}
          loading={loading}
          onEdit={handleEdit}
        />

        <RoleAssignmentModal
          open={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={handleSaveRoles}
          user={selectedUser}
          roles={roles}
        />
      </motion.div>
    </div>
  );
}
