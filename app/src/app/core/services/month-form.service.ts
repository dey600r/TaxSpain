import { Injectable } from '@angular/core';
import { TAX_CONSTANTS } from '../utils/constants';
import { EmployeeData, SalaryData, SalaryItem, BenefitsData, BenefitItem, TaxesData, TaxItem } from '../models/models';

export type SocialSecurityPercentages = {
  employee: {
    desempleo: number;
    formacionProfesional: number;
    contingenciasComunes: number;
    mei: number;
    fogasa: number;
    atPe: number;
  };
  company: {
    desempleo: number;
    formacionProfesional: number;
    contingenciasComunes: number;
    mei: number;
    fogasa: number;
    atPe: number;
  };
};

export const DEFAULT_SOCIAL_SECURITY_PERCENTAGES: SocialSecurityPercentages = {
  employee: {
    desempleo: TAX_CONSTANTS.SS_EMPLOYEE_PERCENTAGES.DESEMPLEO,
    formacionProfesional: TAX_CONSTANTS.SS_EMPLOYEE_PERCENTAGES.FORMACION_PROFESIONAL,
    contingenciasComunes: TAX_CONSTANTS.SS_EMPLOYEE_PERCENTAGES.CONTINGENCIAS_COMUNES,
    mei: TAX_CONSTANTS.SS_EMPLOYEE_PERCENTAGES.MEI,
    fogasa: TAX_CONSTANTS.SS_EMPLOYEE_PERCENTAGES.FOGASA,
    atPe: TAX_CONSTANTS.SS_EMPLOYEE_PERCENTAGES.AT_PE,
  },
  company: {
    desempleo: TAX_CONSTANTS.SS_COMPANY_PERCENTAGES.DESEMPLEO,
    formacionProfesional: TAX_CONSTANTS.SS_COMPANY_PERCENTAGES.FORMACION_PROFESIONAL,
    contingenciasComunes: TAX_CONSTANTS.SS_COMPANY_PERCENTAGES.CONTINGENCIAS_COMUNES,
    mei: TAX_CONSTANTS.SS_COMPANY_PERCENTAGES.MEI,
    fogasa: TAX_CONSTANTS.SS_COMPANY_PERCENTAGES.FOGASA,
    atPe: TAX_CONSTANTS.SS_COMPANY_PERCENTAGES.AT_PE,
  }
};

@Injectable({
  providedIn: 'root'
})
export class MonthFormService {

  private readonly PRORRATA_BASE_CONCEPTS = new Set([
    'Sueldo Base',
    'Antiguedad',
    'PLUS Convenio',
    'PLUS Voluntario',
    'Pacto no competencia',
    'Dedicacion plena',
    'Dedicación plena'
  ]);

  // Función pura para calcular antigüedad
  calculateAntiguedad(sueldoBase: number, trienios: number): number {
    return (sueldoBase / 20) * trienios;
  }

  // Calcular devengos de salario
  calculateSalaryDevengos(salary: SalaryData, employee: EmployeeData): SalaryData {
    const trienios = employee.trienios ?? 0;

    const updatedItems = salary.items.map(item => ({
      ...item,
      devengos: item.concepto === 'Antiguedad' ? 0 : employee.ndias * item.precioHora
    }));

    // Calcular antigüedad
    const sueldoBase = salary.items.find(i => i.concepto === 'Sueldo Base')?.precioHora || 0;
    const antiguedadIndex = salary.items.findIndex(i => i.concepto === 'Antiguedad');
    if (antiguedadIndex !== -1) {
      updatedItems[antiguedadIndex].precioHora = this.calculateAntiguedad(sueldoBase, trienios);
      updatedItems[antiguedadIndex].devengos = employee.ndias * updatedItems[antiguedadIndex].precioHora;
    }

    const totalDevengos = updatedItems.reduce((sum, item) => sum + item.devengos, 0);
    const totalPrecioHora = updatedItems.reduce((sum, item) => sum + item.precioHora, 0);

    return {
      ...salary,
      items: updatedItems,
      totalDevengos,
      totalPrecioHora
    };
  }

  // Calcular beneficios
  calculateBenefits(benefits: BenefitsData, employee: EmployeeData): BenefitsData {
    const percentajeDeducibleSeguroMedico = employee.percentajeDeducibleSeguroMedico ?? 0;

    const updatedItems = benefits.items.map(item => {
      if (item.concepto === 'Seguro Medico') {
        return {
          ...item,
          devengosCalculados: Math.abs(item.devengos * percentajeDeducibleSeguroMedico) / 100
        };
      } else {
        return {
          ...item,
          devengosCalculados: item.devengos
        };
      }
    });

    const totalDevengos = updatedItems.reduce((sum, item) => sum + item.devengos, 0);
    const totalCalculados = updatedItems.reduce((sum, item) => sum + item.devengosCalculados, 0);

    return {
      ...benefits,
      items: updatedItems,
      totalDevengos,
      totalCalculados
    };
  }

  // Calcular impuestos
  calculateTaxes(
    salary: SalaryData,
    benefits: BenefitsData,
    employee: EmployeeData,
    irpfPercent: number,
    irpfExtraPercent: number,
    isExtra: boolean,
    socialSecurityPercentages: SocialSecurityPercentages = DEFAULT_SOCIAL_SECURITY_PERCENTAGES
  ): TaxesData {
    const baseSalary = salary.totalDevengos;
    // BASE SS debe usar la COLUMNA 2 (devengos) de BENEFICIOS.
    const totalBeneficiosColumna2 = benefits.items.reduce((sum, item) => sum + item.devengos, 0);
    const seguroMedico = benefits.items.find(b => b.concepto === 'Seguro Medico')?.devengos || 0;
    const prorrataExtras = this.calculateProrrataExtras(salary, employee);
    const baseSS = baseSalary + totalBeneficiosColumna2 - seguroMedico + prorrataExtras;
    const baseIRPF = baseSalary + seguroMedico;

    const items: TaxItem[] = [
      {
        concepto: 'Desempleo',
        base: isExtra ? 0 : baseSS,
        percentEmpleado: socialSecurityPercentages.employee.desempleo,
        deduccionesEmpleado: 0,
        percentEmpresa: socialSecurityPercentages.company.desempleo,
        empresa: 0
      },
      {
        concepto: 'Formacion Profesional',
        base: isExtra ? 0 : baseSS,
        percentEmpleado: socialSecurityPercentages.employee.formacionProfesional,
        deduccionesEmpleado: 0,
        percentEmpresa: socialSecurityPercentages.company.formacionProfesional,
        empresa: 0
      },
      {
        concepto: 'Contingencias Comunes',
        base: isExtra ? 0 : baseSS,
        percentEmpleado: socialSecurityPercentages.employee.contingenciasComunes,
        deduccionesEmpleado: 0,
        percentEmpresa: socialSecurityPercentages.company.contingenciasComunes,
        empresa: 0
      },
      {
        concepto: 'MEI',
        base: isExtra ? 0 : baseSS,
        percentEmpleado: socialSecurityPercentages.employee.mei,
        deduccionesEmpleado: 0,
        percentEmpresa: socialSecurityPercentages.company.mei,
        empresa: 0
      },
      {
        concepto: 'FOGASA',
        base: isExtra ? 0 : baseSS,
        percentEmpleado: socialSecurityPercentages.employee.fogasa,
        deduccionesEmpleado: 0,
        percentEmpresa: socialSecurityPercentages.company.fogasa,
        empresa: 0
      },
      {
        concepto: 'AT/PE',
        base: isExtra ? 0 : baseSS,
        percentEmpleado: socialSecurityPercentages.employee.atPe,
        deduccionesEmpleado: 0,
        percentEmpresa: socialSecurityPercentages.company.atPe,
        empresa: 0
      },
      {
        concepto: 'IRPF',
        base: baseIRPF,
        percentEmpleado: irpfPercent / 100,
        deduccionesEmpleado: 0,
        percentEmpresa: 0,
        empresa: 0
      },
      {
        concepto: 'IRPF EXTRA',
        base: baseIRPF,
        percentEmpleado: irpfExtraPercent / 100,
        deduccionesEmpleado: 0,
        percentEmpresa: 0,
        empresa: 0
      }
    ];

    // Calcular deducciones
    items.forEach(item => {
      item.deduccionesEmpleado = item.base * item.percentEmpleado;
      item.empresa = item.base * item.percentEmpresa;
    });

    const totalPercentEmpleado = items.reduce((sum, item) => sum + item.percentEmpleado, 0);
    const totalDeduccionesEmpleado = items.reduce((sum, item) => sum + item.deduccionesEmpleado, 0);
    const totalPercentEmpresa = items.reduce((sum, item) => sum + item.percentEmpresa, 0);
    const totalEmpresa = items.reduce((sum, item) => sum + item.empresa, 0);

    return {
      items,
      totalPercentEmpleado,
      totalDeduccionesEmpleado,
      totalPercentEmpresa,
      totalEmpresa
    };
  }

  // Calcular neto a cobrar (aproximado)
  calculateNeto(salary: SalaryData, benefits: BenefitsData, taxes: TaxesData): number {
    return salary.totalDevengos + benefits.totalDevengos - taxes.totalDeduccionesEmpleado;
  }

  calculateProrrataExtras(salary: SalaryData, employee: EmployeeData): number {
    const pagasExtra = employee.pagasextra ?? 0;
    if (pagasExtra === 0) {
      return 0;
    }

    const prorrataBase = salary.items.reduce((sum, item) => {
      if (!this.PRORRATA_BASE_CONCEPTS.has(item.concepto)) {
        return sum;
      }

      return sum + item.devengos;
    }, 0);

    return (prorrataBase * pagasExtra) / 12;
  }
}