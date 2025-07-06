export interface UserRoleDto {
  userId: number;
  roleId: number;
  users?: {
    id: number;
    username: string;
    fullName: string;
    email: string;
  };
  roles?: {
    id: number;
    name: string;
    description: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserWithRolesDto {
  id: number;
  username: string;
  fullName: string;
  email: string;
  roles: {
    id: number;
    name: string;
  }[];
}

export interface RoleAssignmentDto {
  userId: number;
  roleIds: number[];
}
