// Modelos de datos para la aplicación de nóminas

export interface EmployeeData {
  nombre: string;
  nempleado: number | null;
  ndias: number;
  pagasextra: number;
  horasextra: number;
  percentajeDeducibleAdeslas: number | null;
  trienios: number | null;
}

export interface SalaryItem {
  concepto: string;
  precioHora: number;
  devengos: number;
  custom?: boolean;
}

export interface SalaryData {
  items: SalaryItem[];
  totalDevengos: number;
  totalPrecioHora: number;
}

export interface BenefitItem {
  concepto: string;
  devengos: number;
  devengosCalculados: number;
  custom?: boolean;
}

export interface BenefitsData {
  items: BenefitItem[];
  totalDevengos: number;
  totalCalculados: number;
}

export interface TaxItem {
  concepto: string;
  base: number;
  percentEmpleado: number;
  deduccionesEmpleado: number;
  percentEmpresa: number;
  empresa: number;
}

export interface TaxesData {
  items: TaxItem[];
  totalPercentEmpleado: number;
  totalDeduccionesEmpleado: number;
  totalPercentEmpresa: number;
  totalEmpresa: number;
}

export interface MonthData {
  employee: EmployeeData;
  salary: SalaryData;
  benefits: BenefitsData;
  taxes: TaxesData;
}

export interface YearData {
  year: number;
  months: MonthData[];
}