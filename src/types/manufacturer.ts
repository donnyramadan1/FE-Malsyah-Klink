export interface ManufacturerDto {
  id: number;
  name: string;
  licenseNumber: string;
  country: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateManufacturerDto {
  name: string;
  licenseNumber: string;
  country: string;
}

export interface UpdateManufacturerDto extends CreateManufacturerDto {
  isActive: boolean;
}