export interface DiagnosisDto {
  id: number;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiagnosisDto {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateDiagnosisDto extends CreateDiagnosisDto {
  isActive: boolean;
}
