export enum Gender {
  MALE = 'Laki-laki',
  FEMALE = 'Perempuan',
}

export enum BloodType {
  A = 'A',
  B = 'B',
  AB = 'AB',
  O = 'O',
  UNKNOWN = 'Tidak Tahu'
}

export interface PatientDto {
  id: number;
  name: string;
  medicalRecordNumber: string;
  identityNumber: string;
  birthDate: string;
  gender: Gender;
  bloodType: BloodType;
  phone: string;
  email: string;
  address: string;
  allergies: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientDto {
  name: string;
  medicalRecordNumber?: string; // Opsional karena akan di-generate di backend
  identityNumber: string;
  birthDate: string;
  gender: Gender;
  bloodType: BloodType;
  phone: string;
  email: string;
  address: string;
  allergies: string;
}

export interface UpdatePatientDto extends CreatePatientDto {
  isActive: boolean;
}