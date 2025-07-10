export interface MedicineFormDto {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicineFormDto {
  name: string;
  description?: string;
}

export interface UpdateMedicineFormDto extends CreateMedicineFormDto {
  isActive: boolean;
}

export interface MedicineDto {
  id: number;
  name: string;
  code: string;
  formId: number;
  formName: string;
  dosageUnitId: number;
  dosageUnitName: string;
  stockQuantity: number;
  minStockLevel: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicineDto {
  name: string;
  code: string;
  formId: number;
  dosageUnitId: number;
  minStockLevel: number;
}

export interface UpdateMedicineDto extends CreateMedicineDto {
  isActive: boolean;
}

export interface MedicineFormDto {
  id: number;
  name: string;
  description: string;
}
