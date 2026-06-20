import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  DEFAULT_SOCIAL_SECURITY_PERCENTAGES,
  MonthFormService,
  SocialSecurityPercentages
} from '../../core/services/month-form.service';
import { TAX_CONSTANTS } from '../../core/utils/constants';
import { BenefitItem, BenefitsData, EmployeeData, SalaryData, SalaryItem } from '../../core/models/models';

@Component({
  standalone: true,
  selector: 'app-irpf-summary-tab',
  imports: [CommonModule, FormsModule, MatCardModule, MatInputModule, MatButtonModule, MatExpansionModule],
  templateUrl: './irpf-summary-tab.html',
  styleUrl: './irpf-summary-tab.scss'
})
export class IrpfSummaryTabComponent implements OnInit {
  salarioBruto = 0;
  otrosBeneficios = 0;
  irpfEstatalRows: IrpfEstatalRow[] = DEFAULT_IRPF_ESTATAL_ROWS.map(row => ({ ...row }));
  irpfAutonomicoRows: IrpfAutonomicoRow[] = DEFAULT_IRPF_AUTONOMICO_ROWS.map(row => ({ ...row }));
  baseCotizacionEstatal: number[] = [...DEFAULT_BASE_COTIZACION_ESTATAL];
  baseCotizacionAutonomico: number[] = [...DEFAULT_BASE_COTIZACION_AUTONOMICO];
  baseCotizacionRendimientoTrabajo = 2000;
  annualSsEmpleadoPaid = 0;
  annualSsEmpresaPaid = 0;
  annualIrpfPaid = 0;
  socialSecurity: Record<SocialSecuritySide, Record<SocialSecurityKey, number>> = {
    employee: {
      desempleo: this.toPercent(DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.desempleo),
      formacionProfesional: this.toPercent(DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.formacionProfesional),
      contingenciasComunes: this.toPercent(DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.contingenciasComunes),
      mei: this.toPercent(DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.mei),
      fogasa: this.toPercent(DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.fogasa),
      atPe: this.toPercent(DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.atPe)
    },
    company: {
      desempleo: this.toPercent(DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.desempleo),
      formacionProfesional: this.toPercent(DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.formacionProfesional),
      contingenciasComunes: this.toPercent(DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.contingenciasComunes),
      mei: this.toPercent(DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.mei),
      fogasa: this.toPercent(DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.fogasa),
      atPe: this.toPercent(DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.atPe)
    }
  };
  readonly socialSecurityRows: Array<{ label: string; key: SocialSecurityKey }> = [
    { label: 'Desempleo', key: 'desempleo' },
    { label: 'Formacion Profesional', key: 'formacionProfesional' },
    { label: 'Contingencias Comunes', key: 'contingenciasComunes' },
    { label: 'MEI', key: 'mei' },
    { label: 'FOGASA', key: 'fogasa' },
    { label: 'AT/EP', key: 'atPe' }
  ];
  readonly exencionConceptRows: Array<{ label: string }> = [
    { label: 'MINIMO PERSONAL' },
    { label: 'DESCENDIENTES' },
    { label: 'ASCENDIENTES' },
    { label: 'MINUSVALIAS' }
  ];
  floatingEditor = {
    isOpen: false,
    label: '',
    value: 0,
    target: null as (FloatingEditorTarget | null)
  };

  constructor(private monthService: MonthFormService) {}

  ngOnInit(): void {
    this.loadState();
    this.refreshSummary();
  }

  get total(): number {
    return this.salarioBruto + this.otrosBeneficios;
  }

  get totalEmpleado(): number {
    const employee = this.socialSecurity.employee;
    return employee.desempleo
      + employee.formacionProfesional
      + employee.contingenciasComunes
      + employee.mei
      + employee.fogasa
      + employee.atPe;
  }

  get totalEmpresa(): number {
    const company = this.socialSecurity.company;
    return company.desempleo
      + company.formacionProfesional
      + company.contingenciasComunes
      + company.mei
      + company.fogasa
      + company.atPe;
  }

  get irpfEstatalImpuestosTotal(): number {
    return this.irpfEstatalRows.reduce((sum, row, index) => {
      return sum + this.getIrpfEstatalImpuesto(index, row);
    }, 0);
  }

  get irpfAutonomicoImpuestosTotal(): number {
    return this.irpfAutonomicoRows.reduce((sum, row, index) => {
      return sum + this.getIrpfAutonomicoImpuesto(index, row);
    }, 0);
  }

  get irpfEstatalImpuestoFila1(): number {
    return this.calculateIrpfImpuestoForRow(this.irpfEstatalRows, 0, this.irpfEstatalRows[0]);
  }

  get irpfAutonomicoImpuestoFila1(): number {
    return this.calculateIrpfImpuestoForRow(this.irpfAutonomicoRows, 0, this.irpfAutonomicoRows[0]);
  }

  getIrpfEstatalImpuesto(index: number, row: IrpfEstatalRow): number {
    return this.calculateIrpfImpuestoForRow(this.irpfEstatalRows, index, row);
  }

  getIrpfAutonomicoImpuesto(index: number, row: IrpfAutonomicoRow): number {
    return this.calculateIrpfImpuestoForRow(this.irpfAutonomicoRows, index, row);
  }

  get totalBaseCotizacionEstatal(): number {
    return this.baseCotizacionEstatal.reduce((sum, value) => sum + value, 0);
  }

  get totalBaseCotizacionAutonomico(): number {
    return this.baseCotizacionAutonomico.reduce((sum, value) => sum + value, 0);
  }

  get impuestosBaseCotizacionEstatal(): number {
    const porcentaje = this.irpfEstatalRows[0]?.porcentaje ?? 0;
    return this.totalBaseCotizacionEstatal * (porcentaje / 100);
  }

  get impuestosBaseCotizacionAutonomico(): number {
    const porcentaje = this.irpfAutonomicoRows[0]?.porcentaje ?? 0;
    return this.totalBaseCotizacionAutonomico * (porcentaje / 100);
  }

  get baseCotizacionSsEmpleadoTotal(): number {
    return this.total * (this.totalEmpleado / 100);
  }

  get baseCotizacionSsEmpresaTotal(): number {
    return this.total * (this.totalEmpresa / 100);
  }

  get baseCotizacionTotal(): number {
    return this.baseCotizacionRendimientoTrabajo + this.baseCotizacionSsEmpleadoTotal;
  }

  get baseCotizacionBaseIrpf(): number {
    return this.total - this.baseCotizacionTotal;
  }

  get baseCotizacionPagadoTotal(): number {
    return this.baseCotizacionRendimientoTrabajo + this.annualSsEmpleadoPaid;
  }

  get baseCotizacionBaseIrpfPagada(): number {
    return this.total - this.baseCotizacionPagadoTotal;
  }

  get irpfNecesarioEstatalEuroRetencionIrpf(): number {
    return this.irpfEstatalImpuestosTotal - this.impuestosBaseCotizacionEstatal;
  }

  get irpfNecesarioEstatalPorcentajeRetencionIrpf(): number {
    if (this.baseCotizacionBaseIrpf <= 0) {
      return 0;
    }

    return (this.irpfNecesarioEstatalEuroRetencionIrpf / this.baseCotizacionBaseIrpf) * 100;
  }

  get irpfNecesarioAutonomicoEuroRetencionIrpf(): number {
    return this.irpfAutonomicoImpuestosTotal - this.impuestosBaseCotizacionAutonomico;
  }

  get irpfNecesarioAutonomicoPorcentajeRetencionIrpf(): number {
    if (this.baseCotizacionBaseIrpfPagada <= 0) {
      return 0;
    }

    return (this.irpfNecesarioAutonomicoEuroRetencionIrpf / this.baseCotizacionBaseIrpfPagada) * 100;
  }

  get irpfNecesarioTotalEuroRetencionIrpf(): number {
    return this.irpfNecesarioEstatalEuroRetencionIrpf + this.irpfNecesarioAutonomicoEuroRetencionIrpf;
  }

  get irpfNecesarioTotalPorcentajeRetencionIrpf(): number {
    return this.irpfNecesarioEstatalPorcentajeRetencionIrpf + this.irpfNecesarioAutonomicoPorcentajeRetencionIrpf;
  }

  get borradorRetencionIrpfPagadoEuro(): number {
    return this.annualIrpfPaid;
  }

  get borradorRetencionIrpfPagadoPercent(): number {
    if (this.total <= 0) {
      return 0;
    }

    return (this.borradorRetencionIrpfPagadoEuro / this.total) * 100;
  }

  get borradorRetencionIrpfEuro(): number {
    return this.irpfNecesarioTotalEuroRetencionIrpf - this.borradorRetencionIrpfPagadoEuro;
  }

  get borradorRetencionCapitalPagadoEuro(): number {
    return 0;
  }

  get borradorRetencionCapitalPagadoPercent(): number {
    if (this.total <= 0) {
      return 0;
    }

    return (this.borradorRetencionCapitalPagadoEuro / this.total) * 100;
  }

  get borradorRetencionCapitalEuro(): number {
    return 0 - this.borradorRetencionCapitalPagadoEuro;
  }

  get borradorSsEmpleadoPagadoEuro(): number {
    return this.annualSsEmpleadoPaid;
  }

  get borradorSsEmpleadoPagadoPercent(): number {
    if (this.total <= 0) {
      return 0;
    }

    return (this.borradorSsEmpleadoPagadoEuro / this.total) * 100;
  }

  get borradorSsEmpleadoEuro(): number {
    return this.baseCotizacionSsEmpleadoTotal - this.borradorSsEmpleadoPagadoEuro;
  }

  get borradorCuotasLiquidasPagadoEuro(): number {
    return this.borradorRetencionIrpfPagadoEuro + this.borradorRetencionCapitalPagadoEuro;
  }

  get borradorCuotasLiquidasPagadoPercent(): number {
    if (this.total <= 0) {
      return 0;
    }

    return (this.borradorCuotasLiquidasPagadoEuro / this.total) * 100;
  }

  get borradorCuotasLiquidasEuro(): number {
    return this.borradorRetencionIrpfEuro + this.borradorRetencionCapitalEuro;
  }

  get borradorIsPayable(): boolean {
    return this.borradorCuotasLiquidasEuro > 0;
  }

  get borradorIsCompensated(): boolean {
    return Math.abs(this.borradorCuotasLiquidasEuro) < 0.005;
  }

  refreshSummary(): void {
    this.salarioBruto = this.calculateAnnualImponibleIrpf();
    const annualPaidTotals = this.calculateAnnualSocialSecurityTotals();
    this.annualSsEmpleadoPaid = annualPaidTotals.employee;
    this.annualSsEmpresaPaid = annualPaidTotals.company;
    this.annualIrpfPaid = this.calculateAnnualRetencionesIrpfTotal();
  }

  onOtrosBeneficiosChange(): void {
    if (typeof this.otrosBeneficios !== 'number' || Number.isNaN(this.otrosBeneficios)) {
      this.otrosBeneficios = 0;
    }
    this.saveState();
  }

  openOtrosBeneficiosEditor(): void {
    this.floatingEditor = {
      isOpen: true,
      label: 'Otros beneficios',
      value: this.otrosBeneficios,
      target: { type: 'otrosBeneficios' }
    };
  }

  openSocialSecurityEditor(side: SocialSecuritySide, key: SocialSecurityKey, rowLabel: string): void {
    const label = `${rowLabel} (${side === 'employee' ? 'Empleado' : 'Empresa'})`;
    this.floatingEditor = {
      isOpen: true,
      label,
      value: this.socialSecurity[side][key],
      target: { type: 'socialSecurity', side, key }
    };
  }

  openIrpfEstatalEditor(rowIndex: number, field: IrpfEstatalField): void {
    const row = this.irpfEstatalRows[rowIndex];
    if (!row) {
      return;
    }

    const fieldLabel = field === 'inicio'
      ? 'Inicio'
      : (field === 'fin' ? 'Fin' : '%');
    const currentValue = row[field] ?? 0;

    this.floatingEditor = {
      isOpen: true,
      label: `IRPF Estatal - Tramo ${rowIndex + 1} - ${fieldLabel}`,
      value: currentValue,
      target: { type: 'irpfEstatal', rowIndex, field }
    };
  }

  openIrpfAutonomicoEditor(rowIndex: number, field: IrpfAutonomicoField): void {
    const row = this.irpfAutonomicoRows[rowIndex];
    if (!row) {
      return;
    }

    const fieldLabel = field === 'inicio'
      ? 'Inicio'
      : (field === 'fin' ? 'Fin' : '%');
    const currentValue = row[field] ?? 0;

    this.floatingEditor = {
      isOpen: true,
      label: `IRPF Autonomico - Tramo ${rowIndex + 1} - ${fieldLabel}`,
      value: currentValue,
      target: { type: 'irpfAutonomico', rowIndex, field }
    };
  }

  openBaseCotizacionEditor(rowIndex: number, side: BaseCotizacionSide): void {
    const rowLabel = this.exencionConceptRows[rowIndex]?.label;
    if (!rowLabel) {
      return;
    }

    const list = side === 'estatal' ? this.baseCotizacionEstatal : this.baseCotizacionAutonomico;
    const currentValue = list[rowIndex] ?? 0;
    const sideLabel = side === 'estatal' ? 'Estatal' : 'Autonomico';

    this.floatingEditor = {
      isOpen: true,
      label: `Base de cotizacion - ${rowLabel} (${sideLabel})`,
      value: currentValue,
      target: { type: 'baseCotizacion', rowIndex, side }
    };
  }

  openBaseCotizacionRentaEditor(): void {
    this.floatingEditor = {
      isOpen: true,
      label: 'Base de Cotizacion - RENDIMIENTO TRABAJO',
      value: this.baseCotizacionRendimientoTrabajo,
      target: { type: 'baseCotizacionRenta' }
    };
  }

  closeFloatingEditor(): void {
    this.floatingEditor.isOpen = false;
    this.floatingEditor.target = null;
  }

  saveFloatingEditor(): void {
    const parsed = Number(this.floatingEditor.value);
    const value = Number.isNaN(parsed) ? 0 : parsed;

    if (this.floatingEditor.target?.type === 'otrosBeneficios') {
      this.otrosBeneficios = value;
      this.onOtrosBeneficiosChange();
    }

    if (this.floatingEditor.target?.type === 'socialSecurity') {
      const { side, key } = this.floatingEditor.target;
      this.socialSecurity[side][key] = this.normalizePercent(value);
      this.saveState();
    }

    if (this.floatingEditor.target?.type === 'irpfEstatal') {
      const { rowIndex, field } = this.floatingEditor.target;
      const row = this.irpfEstatalRows[rowIndex];
      if (row) {
        row[field] = this.normalizeAmount(value);
        this.saveState();
      }
    }

    if (this.floatingEditor.target?.type === 'irpfAutonomico') {
      const { rowIndex, field } = this.floatingEditor.target;
      const row = this.irpfAutonomicoRows[rowIndex];
      if (row) {
        row[field] = this.normalizeAmount(value);
        this.saveState();
      }
    }

    if (this.floatingEditor.target?.type === 'baseCotizacion') {
      const { rowIndex, side } = this.floatingEditor.target;
      const target = side === 'estatal' ? this.baseCotizacionEstatal : this.baseCotizacionAutonomico;
      if (target[rowIndex] !== undefined) {
        target[rowIndex] = this.normalizeAmount(value);
        this.saveState();
      }
    }

    if (this.floatingEditor.target?.type === 'baseCotizacionRenta') {
      this.baseCotizacionRendimientoTrabajo = this.normalizeAmount(value);
      this.saveState();
    }

    this.closeFloatingEditor();
  }

  private calculateAnnualImponibleIrpf(): number {
    if (!this.isBrowser) {
      return 0;
    }

    return TAX_CONSTANTS.MONTHS.reduce((sum, month) => {
      const saved = window.localStorage.getItem(`month-tab-state-${month}`);
      if (!saved) {
        return sum;
      }

      try {
        const parsed = JSON.parse(saved) as StoredMonthState;
        const employee = this.buildEmployee(parsed.employee);
        const salary = this.buildSalary(parsed.salary?.items);
        const benefits = this.buildBenefits(parsed.benefits?.items);

        if (!salary.items.length || !benefits.items.length) {
          return sum;
        }

        const irpfPercent = typeof parsed.irpfPercent === 'number'
          ? parsed.irpfPercent
          : TAX_CONSTANTS.DEFAULTS.IRPF_PERCENT;
        const irpfExtraPercent = typeof parsed.irpfExtraPercent === 'number'
          ? parsed.irpfExtraPercent
          : 0;

        const salaryCalculated = this.monthService.calculateSalaryDevengos(salary, employee);
        const benefitsCalculated = this.monthService.calculateBenefits(benefits, employee);
        const taxesCalculated = this.monthService.calculateTaxes(
          salaryCalculated,
          benefitsCalculated,
          employee,
          irpfPercent,
          irpfExtraPercent,
          month.includes('Extra'),
          this.getSocialSecurityPercentagesDecimal()
        );

        const imponibleIrpf = taxesCalculated.items.find(item => item.concepto === 'IRPF')?.base ?? 0;
        return sum + imponibleIrpf;
      } catch {
        return sum;
      }
    }, 0);
  }

  private calculateAnnualSocialSecurityTotals(): { employee: number; company: number } {
    if (!this.isBrowser) {
      return { employee: 0, company: 0 };
    }

    return TAX_CONSTANTS.MONTHS.reduce((totals, month) => {
      const saved = window.localStorage.getItem(`month-tab-state-${month}`);
      if (!saved) {
        return totals;
      }

      try {
        const parsed = JSON.parse(saved) as StoredMonthState;
        const employee = this.buildEmployee(parsed.employee);
        const salary = this.buildSalary(parsed.salary?.items);
        const benefits = this.buildBenefits(parsed.benefits?.items);

        if (!salary.items.length || !benefits.items.length) {
          return totals;
        }

        const irpfPercent = typeof parsed.irpfPercent === 'number'
          ? parsed.irpfPercent
          : TAX_CONSTANTS.DEFAULTS.IRPF_PERCENT;
        const irpfExtraPercent = typeof parsed.irpfExtraPercent === 'number'
          ? parsed.irpfExtraPercent
          : 0;

        const salaryCalculated = this.monthService.calculateSalaryDevengos(salary, employee);
        const benefitsCalculated = this.monthService.calculateBenefits(benefits, employee);
        const taxesCalculated = this.monthService.calculateTaxes(
          salaryCalculated,
          benefitsCalculated,
          employee,
          irpfPercent,
          irpfExtraPercent,
          month.includes('Extra'),
          this.getSocialSecurityPercentagesDecimal()
        );

        const employeePaid = taxesCalculated.items
          .filter(item => SOCIAL_SECURITY_CONCEPTS.includes(item.concepto))
          .reduce((sum, item) => sum + item.deduccionesEmpleado, 0);
        const companyPaid = taxesCalculated.items
          .filter(item => SOCIAL_SECURITY_CONCEPTS.includes(item.concepto))
          .reduce((sum, item) => sum + item.empresa, 0);

        return {
          employee: totals.employee + employeePaid,
          company: totals.company + companyPaid
        };
      } catch {
        return totals;
      }
    }, { employee: 0, company: 0 });
  }

  private calculateAnnualRetencionesIrpfTotal(): number {
    if (!this.isBrowser) {
      return 0;
    }

    return TAX_CONSTANTS.MONTHS.reduce((sum, month) => {
      const saved = window.localStorage.getItem(`month-tab-state-${month}`);
      if (!saved) {
        return sum;
      }

      try {
        const parsed = JSON.parse(saved) as StoredMonthState;
        const employee = this.buildEmployee(parsed.employee);
        const salary = this.buildSalary(parsed.salary?.items);
        const benefits = this.buildBenefits(parsed.benefits?.items);

        if (!salary.items.length || !benefits.items.length) {
          return sum;
        }

        const irpfPercent = typeof parsed.irpfPercent === 'number'
          ? parsed.irpfPercent
          : TAX_CONSTANTS.DEFAULTS.IRPF_PERCENT;
        const irpfExtraPercent = typeof parsed.irpfExtraPercent === 'number'
          ? parsed.irpfExtraPercent
          : 0;

        const salaryCalculated = this.monthService.calculateSalaryDevengos(salary, employee);
        const benefitsCalculated = this.monthService.calculateBenefits(benefits, employee);
        const taxesCalculated = this.monthService.calculateTaxes(
          salaryCalculated,
          benefitsCalculated,
          employee,
          irpfPercent,
          irpfExtraPercent,
          month.includes('Extra'),
          this.getSocialSecurityPercentagesDecimal()
        );

        const retencionIrpf = taxesCalculated.items.find(item => item.concepto === 'IRPF')?.deduccionesEmpleado ?? 0;
        return sum + retencionIrpf;
      } catch {
        return sum;
      }
    }, 0);
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

  private loadState(): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      const saved = window.localStorage.getItem(IRPF_SUMMARY_STORAGE_KEY);
      if (!saved) {
        return;
      }

      const parsed = JSON.parse(saved) as {
        otrosBeneficios?: number;
        irpfEstatalRows?: Array<Partial<IrpfEstatalRow>>;
        irpfAutonomicoRows?: Array<Partial<IrpfAutonomicoRow>>;
        baseCotizacionEstatal?: number[];
        baseCotizacionAutonomico?: number[];
        baseCotizacionRendimientoTrabajo?: number;
        socialSecurity?: {
          employee?: Partial<{
            desempleo: number;
            formacionProfesional: number;
            contingenciasComunes: number;
            mei: number;
            fogasa: number;
            atPe: number;
          }>;
          company?: Partial<{
            desempleo: number;
            formacionProfesional: number;
            contingenciasComunes: number;
            mei: number;
            fogasa: number;
            atPe: number;
          }>;
        };
      };
      if (typeof parsed.otrosBeneficios === 'number') {
        this.otrosBeneficios = parsed.otrosBeneficios;
      }

      if (Array.isArray(parsed.irpfEstatalRows)) {
        this.irpfEstatalRows = DEFAULT_IRPF_ESTATAL_ROWS.map((defaultRow, index) => {
          const savedRow = parsed.irpfEstatalRows?.[index];
          return {
            inicio: this.normalizeAmount(savedRow?.inicio ?? defaultRow.inicio),
            fin: defaultRow.fin === null ? null : this.normalizeAmount(savedRow?.fin ?? defaultRow.fin),
            porcentaje: defaultRow.porcentaje === null
              ? null
              : this.normalizePercent(savedRow?.porcentaje ?? defaultRow.porcentaje),
            impuestos: 0
          };
        });
      }

      if (Array.isArray(parsed.irpfAutonomicoRows)) {
        this.irpfAutonomicoRows = DEFAULT_IRPF_AUTONOMICO_ROWS.map((defaultRow, index) => {
          const savedRow = parsed.irpfAutonomicoRows?.[index];
          return {
            inicio: this.normalizeAmount(savedRow?.inicio ?? defaultRow.inicio),
            fin: defaultRow.fin === null ? null : this.normalizeAmount(savedRow?.fin ?? defaultRow.fin),
            porcentaje: defaultRow.porcentaje === null
              ? null
              : this.normalizePercent(savedRow?.porcentaje ?? defaultRow.porcentaje),
            impuestos: 0
          };
        });
      }

      if (Array.isArray(parsed.baseCotizacionEstatal)) {
        this.baseCotizacionEstatal = DEFAULT_BASE_COTIZACION_ESTATAL.map(
          (defaultValue, index) => this.normalizeAmount(parsed.baseCotizacionEstatal?.[index] ?? defaultValue)
        );
      }

      if (Array.isArray(parsed.baseCotizacionAutonomico)) {
        this.baseCotizacionAutonomico = DEFAULT_BASE_COTIZACION_AUTONOMICO.map(
          (defaultValue, index) => this.normalizeAmount(parsed.baseCotizacionAutonomico?.[index] ?? defaultValue)
        );
      }

      if (typeof parsed.baseCotizacionRendimientoTrabajo === 'number') {
        this.baseCotizacionRendimientoTrabajo = this.normalizeAmount(parsed.baseCotizacionRendimientoTrabajo);
      }

      if (parsed.socialSecurity?.employee && parsed.socialSecurity?.company) {
        this.socialSecurity.employee.desempleo = this.normalizePercent(parsed.socialSecurity.employee.desempleo);
        this.socialSecurity.employee.formacionProfesional = this.normalizePercent(parsed.socialSecurity.employee.formacionProfesional);
        this.socialSecurity.employee.contingenciasComunes = this.normalizePercent(parsed.socialSecurity.employee.contingenciasComunes);
        this.socialSecurity.employee.mei = this.normalizePercent(parsed.socialSecurity.employee.mei);
        this.socialSecurity.employee.fogasa = this.normalizePercent(parsed.socialSecurity.employee.fogasa);
        this.socialSecurity.employee.atPe = this.normalizePercent(parsed.socialSecurity.employee.atPe);

        this.socialSecurity.company.desempleo = this.normalizePercent(parsed.socialSecurity.company.desempleo);
        this.socialSecurity.company.formacionProfesional = this.normalizePercent(parsed.socialSecurity.company.formacionProfesional);
        this.socialSecurity.company.contingenciasComunes = this.normalizePercent(parsed.socialSecurity.company.contingenciasComunes);
        this.socialSecurity.company.mei = this.normalizePercent(parsed.socialSecurity.company.mei);
        this.socialSecurity.company.fogasa = this.normalizePercent(parsed.socialSecurity.company.fogasa);
        this.socialSecurity.company.atPe = this.normalizePercent(parsed.socialSecurity.company.atPe);
      }
    } catch {
      // ignore invalid summary state
    }
  }

  private saveState(): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      window.localStorage.setItem(IRPF_SUMMARY_STORAGE_KEY, JSON.stringify({
        otrosBeneficios: this.otrosBeneficios,
        irpfEstatalRows: this.irpfEstatalRows,
        irpfAutonomicoRows: this.irpfAutonomicoRows,
        baseCotizacionEstatal: this.baseCotizacionEstatal,
        baseCotizacionAutonomico: this.baseCotizacionAutonomico,
        baseCotizacionRendimientoTrabajo: this.baseCotizacionRendimientoTrabajo,
        socialSecurity: this.socialSecurity
      }));
    } catch {
      // ignore storage errors
    }
  }

  private getSocialSecurityPercentagesDecimal(): SocialSecurityPercentages {
    return {
      employee: {
        desempleo: this.socialSecurity.employee.desempleo / 100,
        formacionProfesional: this.socialSecurity.employee.formacionProfesional / 100,
        contingenciasComunes: this.socialSecurity.employee.contingenciasComunes / 100,
        mei: this.socialSecurity.employee.mei / 100,
        fogasa: this.socialSecurity.employee.fogasa / 100,
        atPe: this.socialSecurity.employee.atPe / 100
      },
      company: {
        desempleo: this.socialSecurity.company.desempleo / 100,
        formacionProfesional: this.socialSecurity.company.formacionProfesional / 100,
        contingenciasComunes: this.socialSecurity.company.contingenciasComunes / 100,
        mei: this.socialSecurity.company.mei / 100,
        fogasa: this.socialSecurity.company.fogasa / 100,
        atPe: this.socialSecurity.company.atPe / 100
      }
    };
  }

  private normalizePercent(value: unknown): number {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      return 0;
    }

    return Math.max(parsed, 0);
  }

  private normalizeAmount(value: unknown): number {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      return 0;
    }

    return Math.max(parsed, 0);
  }

  private toPercent(value: number): number {
    return value * 100;
  }

  private calculateIrpfImpuestoForRow(
    rows: Array<{ inicio: number; porcentaje: number | null; impuestos?: number }>,
    index: number,
    row?: { inicio: number; porcentaje: number | null; impuestos?: number }
  ): number {
    const currentRow = row ?? rows[index];
    if (!currentRow) {
      return 0;
    }

    const totalBaseCotizacionColumna3 = this.baseCotizacionBaseIrpfPagada;
    const inicioFilaActual = currentRow.inicio ?? 0;
    const porcentajeFilaActual = (currentRow.porcentaje ?? 0) / 100;

    if (porcentajeFilaActual <= 0) {
      return currentRow.impuestos ?? 0;
    }

    const siguienteFila = rows[index + 1];

    let base = 0;
    if (siguienteFila) {
      const inicioFilaSiguiente = siguienteFila.inicio ?? 0;
      base = (totalBaseCotizacionColumna3 < inicioFilaActual ? 0 : (totalBaseCotizacionColumna3 - inicioFilaActual)) - (totalBaseCotizacionColumna3 < inicioFilaSiguiente ? 0 : (totalBaseCotizacionColumna3 - inicioFilaSiguiente));
    } else {
      base = (totalBaseCotizacionColumna3 < inicioFilaActual ? 0 : (totalBaseCotizacionColumna3 - inicioFilaActual));
    }

    return Math.max(base, 0) * porcentajeFilaActual;
  }

  private get isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
}

const IRPF_SUMMARY_STORAGE_KEY = 'irpf-summary-state';

type SocialSecurityKey = 'desempleo' | 'formacionProfesional' | 'contingenciasComunes' | 'mei' | 'fogasa' | 'atPe';
type SocialSecuritySide = 'employee' | 'company';
type IrpfEstatalField = 'inicio' | 'fin' | 'porcentaje';
type IrpfAutonomicoField = 'inicio' | 'fin' | 'porcentaje';
type BaseCotizacionSide = 'estatal' | 'autonomico';
type FloatingEditorTarget =
  | { type: 'otrosBeneficios' }
  | { type: 'socialSecurity'; side: SocialSecuritySide; key: SocialSecurityKey }
  | { type: 'irpfEstatal'; rowIndex: number; field: IrpfEstatalField }
  | { type: 'irpfAutonomico'; rowIndex: number; field: IrpfAutonomicoField }
  | { type: 'baseCotizacion'; rowIndex: number; side: BaseCotizacionSide }
  | { type: 'baseCotizacionRenta' };

type IrpfEstatalRow = {
  inicio: number;
  fin: number | null;
  porcentaje: number | null;
  impuestos: number;
};

type IrpfAutonomicoRow = {
  inicio: number;
  fin: number | null;
  porcentaje: number | null;
  impuestos: number;
};

const DEFAULT_IRPF_ESTATAL_ROWS: IrpfEstatalRow[] = [
  { inicio: 0, fin: 12449.99, porcentaje: 9.5, impuestos: 0 },
  { inicio: 12450, fin: 20199.99, porcentaje: 12, impuestos: 0 },
  { inicio: 20200, fin: 35199.99, porcentaje: 15, impuestos: 0 },
  { inicio: 35200, fin: 59999.99, porcentaje: 18.5, impuestos: 0 },
  { inicio: 60000, fin: 299999.99, porcentaje: 22.5, impuestos: 0 },
  { inicio: 300000, fin: null, porcentaje: 24.5, impuestos: 0 }
];

const DEFAULT_IRPF_AUTONOMICO_ROWS: IrpfAutonomicoRow[] = [
  { inicio: 0, fin: 12449.99, porcentaje: 9.5, impuestos: 0 },
  { inicio: 12450, fin: 20199.99, porcentaje: 12, impuestos: 0 },
  { inicio: 20200, fin: 35199.99, porcentaje: 15, impuestos: 0 },
  { inicio: 35200, fin: 59999.99, porcentaje: 18.5, impuestos: 0 },
  { inicio: 60000, fin: 299999.99, porcentaje: 22.5, impuestos: 0 },
  { inicio: 300000, fin: null, porcentaje: 24.5, impuestos: 0 }
];

const DEFAULT_BASE_COTIZACION_ESTATAL = [5550, 0, 0, 0];
const DEFAULT_BASE_COTIZACION_AUTONOMICO = [5956.65, 0, 0, 0];
const SOCIAL_SECURITY_CONCEPTS: string[] = [
  'Desempleo',
  'Formacion Profesional',
  'Contingencias Comunes',
  'MEI',
  'FOGASA',
  'AT/PE'
];

type StoredMonthState = {
  employee?: EmployeeData;
  salary?: { items: Array<Partial<SalaryItem> & { custom?: boolean }> };
  benefits?: { items: Array<Partial<BenefitItem> & { custom?: boolean }> };
  irpfPercent?: number;
  irpfExtraPercent?: number;
};
