import { Injectable } from '@angular/core';
import { TAX_CONSTANTS } from '../utils/constants';
import { EmployeeData, SalaryData, SalaryItem, BenefitsData, BenefitItem, TaxesData, TaxItem } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class MonthFormService {

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
    const percentajeDeducibleAdeslas = employee.percentajeDeducibleAdeslas ?? 0;

    const updatedItems = benefits.items.map(item => {
      if (item.concepto === 'Adeslas') {
        return {
          ...item,
          devengosCalculados: Math.abs(item.devengos * percentajeDeducibleAdeslas) / 100
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
    isExtra: boolean
  ): TaxesData {
    const baseSalary = salary.totalDevengos;
    // BASE SS debe usar la COLUMNA 2 (devengos) de BENEFICIOS.
    const totalBeneficiosColumna2 = benefits.items.reduce((sum, item) => sum + item.devengos, 0);
    const adeslas = benefits.items.find(b => b.concepto === 'Adeslas')?.devengos || 0;
    const prorrataExtras = (baseSalary * employee.pagasextra) / 12;
    const baseSS = baseSalary + totalBeneficiosColumna2 - adeslas + prorrataExtras;
    const baseIRPF = baseSalary + adeslas;

    const items: TaxItem[] = [
      {
        concepto: 'Desempleo',
        base: isExtra ? 0 : baseSS,
        percentEmpleado: TAX_CONSTANTS.SS_EMPLOYEE_PERCENTAGES.DESEMPLEO,
        deduccionesEmpleado: 0,
        percentEmpresa: TAX_CONSTANTS.SS_COMPANY_PERCENTAGES.DESEMPLEO,
        empresa: 0
      },
      {
        concepto: 'Formacion Profesional',
        base: isExtra ? 0 : baseSS,
        percentEmpleado: TAX_CONSTANTS.SS_EMPLOYEE_PERCENTAGES.FORMACION_PROFESIONAL,
        deduccionesEmpleado: 0,
        percentEmpresa: TAX_CONSTANTS.SS_COMPANY_PERCENTAGES.FORMACION_PROFESIONAL,
        empresa: 0
      },
      {
        concepto: 'Contingencias Comunes',
        base: isExtra ? 0 : baseSS,
        percentEmpleado: TAX_CONSTANTS.SS_EMPLOYEE_PERCENTAGES.CONTINGENCIAS_COMUNES,
        deduccionesEmpleado: 0,
        percentEmpresa: TAX_CONSTANTS.SS_COMPANY_PERCENTAGES.CONTINGENCIAS_COMUNES,
        empresa: 0
      },
      {
        concepto: 'MEI',
        base: isExtra ? 0 : baseSS,
        percentEmpleado: TAX_CONSTANTS.SS_EMPLOYEE_PERCENTAGES.MEI,
        deduccionesEmpleado: 0,
        percentEmpresa: TAX_CONSTANTS.SS_COMPANY_PERCENTAGES.MEI,
        empresa: 0
      },
      {
        concepto: 'FOGASA',
        base: isExtra ? 0 : baseSS,
        percentEmpleado: TAX_CONSTANTS.SS_EMPLOYEE_PERCENTAGES.FOGASA,
        deduccionesEmpleado: 0,
        percentEmpresa: TAX_CONSTANTS.SS_COMPANY_PERCENTAGES.FOGASA,
        empresa: 0
      },
      {
        concepto: 'AT/PE',
        base: isExtra ? 0 : baseSS,
        percentEmpleado: TAX_CONSTANTS.SS_EMPLOYEE_PERCENTAGES.AT_PE,
        deduccionesEmpleado: 0,
        percentEmpresa: TAX_CONSTANTS.SS_COMPANY_PERCENTAGES.AT_PE,
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
}