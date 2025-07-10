export interface BatchDto {
  id: number;
  batchNumber: string;
  medicineId: number;
  medicineName: string;
  medicineCode: string;
  manufacturerId?: number;
  manufacturerName?: string;
  productionDate: string;
  expiryDate: string;
  originalQuantity: number;
  remainingQuantity: number;
  costPrice: number;
  sellingPrice: number;
  supplierId?: number;
  supplierName?: string;
  isRecalled: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBatchDto {
  batchNumber: string;
  medicineId: number;
  manufacturerId?: number;
  productionDate: string;
  expiryDate: string;
  originalQuantity: number;
  costPrice: number;
  sellingPrice: number;
  supplierId?: number;
  notes?: string;
}

export interface UpdateBatchDto extends CreateBatchDto {
  isRecalled: boolean;
}

export interface ManufacturerDto {
  id: number;
  name: string;
  licenseNumber?: string;
  country?: string;
  isActive: boolean;
}

export interface SupplierDto {
  id: number;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
}
