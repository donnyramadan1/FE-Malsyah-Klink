/* eslint-disable @typescript-eslint/no-empty-object-type */
// src/types/supplier.ts
export interface SupplierDto {
  id: number;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierDto {
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
}

export interface UpdateSupplierDto extends CreateSupplierDto {}
