export interface MenuRoleDto {
  menuId: number;
  roleId: number;
  menu?: {
    id: number;
    title: string;
    path: string;
    icon: string;
  };
  role?: {
    id: number;
    name: string;
    description: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MenuWithRolesDto {
  id: number;
  title: string;
  path: string;
  icon: string;
  roles: {
    id: number;
    name: string;
  }[];
}

export interface RoleWithMenusDto {
  id: number;
  name: string;
  description: string;
  menus: {
    id: number;
    title: string;
  }[];
}

export interface MenuRoleAssignmentDto {
  menuId?: number;
  roleId?: number;
  targetIds: number[]; // bisa menuIds atau roleIds tergantung mode
}
