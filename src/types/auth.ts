export interface LoginResponse {
  code: number;
  message: string;
  data: {
    token: string;
    expiration: string;
    user: {
      id: number;
      username: string;
      email: string;
      fullName: string;
      isActive: boolean;
      lastLogin: string;
      createdAt: string;
      updatedAt: string;
    };
    roles: {
      id: number;
      name: string;
      description: string;
      createdAt: string;
      updatedAt: string;
    }[];
    menus: {
      id: number;
      parentId: number | null;
      title: string;
      icon: string;
      path: string;
      orderNum: number;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }[];
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Menu {
  id: number;
  parentId: number | null;
  title: string;
  icon: string;
  path: string;
  orderNum: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
