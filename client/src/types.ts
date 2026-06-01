export type Role = 'admin' | 'user';

export interface User {
  id: number;
  login: string;
  role: Role;
}

export interface Employee {
  id: number;
  fullName: string;
  position: string | null;
}

export interface Ingredient {
  id: number;
  name: string;
  unit: string | null;
  // Prisma Decimal сериализуется в JSON как строка
  quantity: string;
  employeeId: number | null;
  employee?: Employee | null;
}
