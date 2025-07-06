/* eslint-disable @typescript-eslint/no-empty-object-type */
// types/role.ts
export interface BaseRoleForm {
  description: string;
}

export interface RoleDto {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleDto {
  name: string;
  description: string;
}

export interface UpdateRoleDto extends BaseRoleForm {}