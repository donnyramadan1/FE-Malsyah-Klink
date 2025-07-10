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