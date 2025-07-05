export interface BaseUserForm {
  email: string;
  fullName: string;
}

export interface UserDto {
  id: number;
  username: string;
  email: string;
  fullName: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto extends BaseUserForm {
  username: string;
  password: string;
}

export interface UpdateUserDto extends BaseUserForm {
  isActive: boolean;
}
