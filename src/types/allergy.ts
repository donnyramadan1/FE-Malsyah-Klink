export interface AllergyTypeDto {
  id: number;
  name: string;
  description: string;
  severityLevel: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAllergyTypeDto {
  name: string;
  description?: string;
  severityLevel: string;
  code: string;
}

export interface UpdateAllergyTypeDto extends CreateAllergyTypeDto {
  isActive: boolean;
}
