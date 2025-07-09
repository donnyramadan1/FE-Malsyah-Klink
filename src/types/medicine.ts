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

export interface DosageUnitDto {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDosageUnitDto {
  name: string;
  code: string;
}

export interface UpdateDosageUnitDto extends CreateDosageUnitDto {
  isActive: boolean;
}
