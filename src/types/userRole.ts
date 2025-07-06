export interface UserRoleDto {
  userId: number;
  roleId: number;
  createdAt: string;
  updatedAt: string;
  users?: {
    id: number;
    username: string;
    fullName: string;
  };
  roles?: {
    id: number;
    name: string;
  };
}

export interface AssignUserRoleDto {
  userId: number;
  roleId: number;
}
