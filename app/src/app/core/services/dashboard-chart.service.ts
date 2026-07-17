import { Injectable } from '@angular/core';
import { MonthFormService, DEFAULT_SOCIAL_SECURITY_PERCENTAGES, SocialSecurityPercentages } from './month-form.service';
import { YearTabsService } from './year-tabs.service';
import { TAX_CONSTANTS } from '../utils/constants';
import { BenefitItem, BenefitsData, EmployeeData, SalaryData, SalaryItem } from '../models/models';

export interface YearChartData {
  year: number;
  retencionIrpf: number;
  retencionCapital: number;
  ssEmpleado: number;
  ssEmpresa: number;
  salarioBruto: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardChartService {
  constructor(
    private monthService: MonthFormService,
    private yearTabsService: YearTabsService
  ) {}

  getYearsChartData(): YearChartData[] {
    if (!this.isBrowser()) {
      return [];
    }

    const tabs = this.yearTabsService.loadTabs();
    return tabs
      .map(tab => this.calculateYearData(tab.year))
      .filter((data): data is YearChartData => data !== null)
      .sort((a, b) => a.year - b.year);
  }

  private calculateYearData(year: number): YearChartData | null {
    let totalSalarioBruto = 0;
    let totalRetencionIrpf = 0;
    let totalRetencionCapital = 0;
    let totalSsEmpleado = 0;
    let totalSsEmpresa = 0;

    for (const month of TAX_CONSTANTS.MONTHS) {
      const monthData = this.getMonthData(year, month);
      if (!monthData) {
        continue;
      }

      totalSalarioBruto += monthData.salarioBruto;
      totalRetencionIrpf += monthData.retencionIrpf;
      totalRetencionCapital += monthData.retencionCapital;
      totalSsEmpleado += monthData.ssEmpleado;
      totalSsEmpresa += monthData.ssEmpresa;
    }

    // Si no hay datos para ningún mes, retornar null
    if (totalSalarioBruto === 0 && totalRetencionIrpf === 0 && totalSsEmpleado === 0 && totalSsEmpresa === 0) {
      return null;
    }

    return {
      year,
      retencionIrpf: totalRetencionIrpf,
      retencionCapital: totalRetencionCapital,
      ssEmpleado: totalSsEmpleado,
      ssEmpresa: totalSsEmpresa,
      salarioBruto: totalSalarioBruto
    };
  }

  private getMonthData(year: number, month: string): {
    salarioBruto: number;
    retencionIrpf: number;
    retencionCapital: number;
    ssEmpleado: number;
    ssEmpresa: number;
  } | null {
    const key = this.yearTabsService.getMonthStorageKey(year, month);
    const saved = window.localStorage.getItem(key);
    if (!saved) {
      return null;
    }

    try {
      const parsed = JSON.parse(saved) as {
        employee?: EmployeeData;
        salary?: { items: Array<Partial<SalaryItem> & { custom?: boolean }> };
        benefits?: { items: Array<Partial<BenefitItem> & { custom?: boolean }> };
        irpfPercent?: number;
      };

      const employee = this.buildEmployee(parsed.employee);
      const salary = this.buildSalary(parsed.salary?.items);
      const benefits = this.buildBenefits(parsed.benefits?.items);

      if (!salary.items.length || !benefits.items.length) {
        return null;
      }

      const irpfPercent = typeof parsed.irpfPercent === 'number'
        ? parsed.irpfPercent
        : TAX_CONSTANTS.DEFAULTS.IRPF_PERCENT;

      const salaryCalculated = this.monthService.calculateSalaryDevengos(salary, employee);
      const benefitsCalculated = this.monthService.calculateBenefits(benefits, employee);
      const ssPercentages = this.getSocialSecurityPercentagesDecimal(year);
      const taxesCalculated = this.monthService.calculateTaxes(
        salaryCalculated,
        benefitsCalculated,
        employee,
        irpfPercent,
        month.includes('Extra'),
        ssPercentages
      );

      const salarioBruto = salaryCalculated.totalDevengos + benefitsCalculated.totalDevengos;
      const irpf = taxesCalculated.items.find(item => item.concepto === 'IRPF');
      const retencionIrpf = irpf?.deduccionesEmpleado ?? 0;

      const ssEmpleado = taxesCalculated.items
        .filter(item => ['Desempleo', 'Formacion Profesional', 'Contingencias Comunes', 'MEI', 'FOGASA', 'AT/PE'].includes(item.concepto))
        .reduce((sum, item) => sum + item.deduccionesEmpleado, 0);

      const ssEmpresa = taxesCalculated.items
        .filter(item => ['Desempleo', 'Formacion Profesional', 'Contingencias Comunes', 'MEI', 'FOGASA', 'AT/PE'].includes(item.concepto))
        .reduce((sum, item) => sum + item.empresa, 0);

      return {
        salarioBruto,
        retencionIrpf,
        retencionCapital: 0,
        ssEmpleado,
        ssEmpresa
      };
    } catch {
      return null;
    }
  }

  private getSocialSecurityPercentagesDecimal(year: number): SocialSecurityPercentages {
    if (!this.isBrowser()) {
      return {
        employee: {
          desempleo: DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.desempleo,
          formacionProfesional: DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.formacionProfesional,
          contingenciasComunes: DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.contingenciasComunes,
          mei: DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.mei,
          fogasa: DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.fogasa,
          atPe: DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.atPe
        },
        company: {
          desempleo: DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.desempleo,
          formacionProfesional: DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.formacionProfesional,
          contingenciasComunes: DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.contingenciasComunes,
          mei: DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.mei,
          fogasa: DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.fogasa,
          atPe: DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.atPe
        }
      };
    }

    try {
      const summaryKey = this.yearTabsService.getSummaryStorageKey(year);
      const saved = window.localStorage.getItem(summaryKey);
      if (!saved) {
        return this.getDefaultPercentages();
      }

      const parsed = JSON.parse(saved) as {
        socialSecurity?: {
          employee?: Record<string, number>;
          company?: Record<string, number>;
        };
      };

      const employee = parsed.socialSecurity?.employee;
      const company = parsed.socialSecurity?.company;

      if (!employee || !company) {
        return this.getDefaultPercentages();
      }

      return {
        employee: {
          desempleo: (employee['desempleo'] ?? DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.desempleo * 100) / 100,
          formacionProfesional: (employee['formacionProfesional'] ?? DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.formacionProfesional * 100) / 100,
          contingenciasComunes: (employee['contingenciasComunes'] ?? DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.contingenciasComunes * 100) / 100,
          mei: (employee['mei'] ?? DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.mei * 100) / 100,
          fogasa: (employee['fogasa'] ?? DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.fogasa * 100) / 100,
          atPe: (employee['atPe'] ?? DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.atPe * 100) / 100
        },
        company: {
          desempleo: (company['desempleo'] ?? DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.desempleo * 100) / 100,
          formacionProfesional: (company['formacionProfesional'] ?? DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.formacionProfesional * 100) / 100,
          contingenciasComunes: (company['contingenciasComunes'] ?? DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.contingenciasComunes * 100) / 100,
          mei: (company['mei'] ?? DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.mei * 100) / 100,
          fogasa: (company['fogasa'] ?? DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.fogasa * 100) / 100,
          atPe: (company['atPe'] ?? DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.atPe * 100) / 100
        }
      };
    } catch {
      return this.getDefaultPercentages();
    }
  }

  private getDefaultPercentages(): SocialSecurityPercentages {
    return {
      employee: {
        desempleo: DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.desempleo,
        formacionProfesional: DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.formacionProfesional,
        contingenciasComunes: DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.contingenciasComunes,
        mei: DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.mei,
        fogasa: DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.fogasa,
        atPe: DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.atPe
      },
      company: {
        desempleo: DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.desempleo,
        formacionProfesional: DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.formacionProfesional,
        contingenciasComunes: DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.contingenciasComunes,
        mei: DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.mei,
        fogasa: DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.fogasa,
        atPe: DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.atPe
      }
    };
  }

  private buildEmployee(employee?: EmployeeData): EmployeeData {
    return employee ?? {
      nombre: TAX_CONSTANTS.DEFAULTS.NOMBRE,
      nempleado: TAX_CONSTANTS.DEFAULTS.N_EMPLEADO,
      ndias: TAX_CONSTANTS.DEFAULTS.N_DIAS,
      pagasextra: TAX_CONSTANTS.DEFAULTS.PAGAS_EXTRA,
      horasextra: TAX_CONSTANTS.DEFAULTS.HORAS_EXTRA,
      percentajeDeducibleSeguroMedico: TAX_CONSTANTS.DEFAULTS.PERCENT_DEDUCIBLE_SEGURO_MEDICO,
      trienios: TAX_CONSTANTS.DEFAULTS.TRIENIOS
    };
  }

  private buildSalary(items?: Array<Partial<SalaryItem> & { custom?: boolean }>): SalaryData {
    return {
      items: (items ?? []).map(savedItem => ({
        concepto: savedItem.concepto ?? 'Nuevo',
        precioHora: savedItem.concepto === 'Antiguedad' ? 0 : (savedItem.precioHora ?? 0),
        devengos: 0,
        custom: savedItem.custom
      })),
      totalDevengos: 0,
      totalPrecioHora: 0
    };
  }

  private buildBenefits(items?: Array<Partial<BenefitItem> & { custom?: boolean }>): BenefitsData {
    return {
      items: (items ?? []).map(savedItem => ({
        concepto: savedItem.concepto ?? 'Nuevo',
        devengos: savedItem.devengos ?? 0,
        devengosCalculados: 0,
        custom: savedItem.custom
      })),
      totalDevengos: 0,
      totalCalculados: 0
    };
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
}
