export interface MenuRoleDto {
  menuId: number;
  roleId: number;
  menu?: {
    id: number;
    title: string;
    path: string;
  };
  role?: {
    id: number;
    name: string;
  };
}

export interface AssignMenuRoleDto {
  menuId: number;
  roleId: number;
}
