import { RoleDto } from "./role";

export interface BaseMenuForm {
  title: string;
  icon: string;
  path: string;
  orderNum: number;
}

export interface MenuDto {
  id: number;
  parentId: number | null;
  title: string;
  icon: string;
  path: string;
  orderNum: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  children?: MenuDto[];
  roles?: RoleDto[]
}

export interface CreateMenuDto extends BaseMenuForm {
  parentId?: number | null;
}

export interface UpdateMenuDto extends BaseMenuForm {
  parentId?: number | null;
  isActive: boolean;
}