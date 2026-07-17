import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { DEFAULT_SOCIAL_SECURITY_PERCENTAGES, MonthFormService, SocialSecurityPercentages } from '../../core/services/month-form.service';
import { TAX_CONSTANTS } from '../../core/utils/constants';
import { EmployeeData, SalaryData, SalaryItem, BenefitsData, BenefitItem, TaxesData } from '../../core/models/models';
import { YearTabsService } from '../../core/services/year-tabs.service';

@Component({
  standalone: true,
  selector: 'app-month-tab',
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './month-tab.html',
  styleUrls: ['./month-tab.scss'],
})
export class MonthTabComponent implements OnInit, OnChanges {
  @Input() monthName!: string;
  @Input() year = new Date().getFullYear();
  isNominaOpen = false;

  duplicatePanel = {
    isOpen: false,
    sourceMonth: TAX_CONSTANTS.MONTHS[0]
  };

  acumuladoRows = [
    { concepto: 'Imponible IRPF', calculos: 0, total: 0 },
    { concepto: 'Retenciones IRPF', calculos: 0, total: 0 },
    { concepto: 'Cotizacion SS Empleado', calculos: 0, total: 0 },
    { concepto: 'Cotizacion SS Empresa', calculos: 0, total: 0 },
    { concepto: 'Recibido', calculos: 0, total: 0 }
  ];

  particionesTotal = 0;
  particionesSlices: Array<{
    label: string;
    value: number;
    percentage: number;
    color: string;
    path: string;
  }> = [];

  floatingEditor = {
    isOpen: false,
    target: '' as 'salaryConcept' | 'salaryPrecioHora' | 'benefitConcept' | 'benefitDevengos' | 'irpfPercent' | '',
    rowIndex: -1,
    label: '',
    inputType: 'number' as 'text' | 'number',
    value: '' as string | number
  };

  resumenMensual = {
    bruto: 0,
    deducciones: 0,
    neto: 0,
    prorrataExtras: 0
  };

  employee: EmployeeData = {
    nombre: TAX_CONSTANTS.DEFAULTS.NOMBRE,
    nempleado: TAX_CONSTANTS.DEFAULTS.N_EMPLEADO,
    ndias: TAX_CONSTANTS.DEFAULTS.N_DIAS,
    pagasextra: TAX_CONSTANTS.DEFAULTS.PAGAS_EXTRA,
    horasextra: TAX_CONSTANTS.DEFAULTS.HORAS_EXTRA,
    percentajeDeducibleSeguroMedico: TAX_CONSTANTS.DEFAULTS.PERCENT_DEDUCIBLE_SEGURO_MEDICO,
    trienios: TAX_CONSTANTS.DEFAULTS.TRIENIOS
  };

  salary: SalaryData = {
    items: [
      { concepto: 'Sueldo Base', precioHora: 0, devengos: 0 },
      { concepto: 'Antiguedad', precioHora: 0, devengos: 0 },
      { concepto: 'PLUS Convenio', precioHora: 0, devengos: 0 },
      { concepto: 'PLUS Voluntario', precioHora: 0, devengos: 0 },
      { concepto: 'Pacto no competencia', precioHora: 0, devengos: 0 },
      { concepto: 'Dedicacion plena', precioHora: 0, devengos: 0 }
    ],
    totalDevengos: 0,
    totalPrecioHora: 0
  };

  benefits: BenefitsData = {
    items: [
      { concepto: 'Seguro Medico', devengos: TAX_CONSTANTS.DEFAULTS.SEGURO_MEDICO, devengosCalculados: 0 },
      { concepto: 'Tickets', devengos: TAX_CONSTANTS.DEFAULTS.TICKETS, devengosCalculados: 0 },
      { concepto: 'Seguro Vida', devengos: TAX_CONSTANTS.DEFAULTS.SEGURO_VIDA, devengosCalculados: 0 }
    ],
    totalDevengos: 0,
    totalCalculados: 0
  };

  taxes: TaxesData = {
    items: [],
    totalPercentEmpleado: 0,
    totalDeduccionesEmpleado: 0,
    totalPercentEmpresa: 0,
    totalEmpresa: 0
  };

  irpfPercent = TAX_CONSTANTS.DEFAULTS.IRPF_PERCENT;
  neto = 0;

  constructor(
    private monthService: MonthFormService,
    private yearTabsService: YearTabsService
  ) {}

  ngOnInit() {
    this.loadState();
    this.calculateAll();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['year'] && !changes['year'].firstChange) {
      this.loadState();
      this.calculateAll();
    }
  }

  onNominaPanelOpened() {
    this.isNominaOpen = true;
    this.loadState();
    this.calculateAll();
  }

  get storageKey(): string {
    return this.yearTabsService.getMonthStorageKey(this.year, this.monthName);
  }

  calculateAll() {
    this.salary = this.monthService.calculateSalaryDevengos(this.salary, this.employee);
    this.benefits = this.monthService.calculateBenefits(this.benefits, this.employee);
    const isExtra = this.monthName.includes('Extra');
    const socialSecurityPercentages = this.getSocialSecurityPercentages();
    this.taxes = this.monthService.calculateTaxes(
      this.salary,
      this.benefits,
      this.employee,
      this.irpfPercent,
      isExtra,
      socialSecurityPercentages
    );
    this.recalculateResumenMensual();
    this.recalculateAcumulado();
    this.recalculateParticiones();
    this.neto = this.resumenMensual.neto;
    this.saveState();
  }

  addSalaryRow() {
    this.salary.items.push({ concepto: 'Nuevo', precioHora: 0, devengos: 0, custom: true });
    this.calculateAll();
  }

  addBenefitRow() {
    this.benefits.items.push({ concepto: 'Nuevo', devengos: 0, devengosCalculados: 0, custom: true });
    this.calculateAll();
  }

  deleteSalaryRow(index: number) {
    const item = this.salary.items[index];
    if (!item || !item.custom) {
      return;
    }
    this.salary.items.splice(index, 1);
    this.calculateAll();
  }

  deleteBenefitRow(index: number) {
    const item = this.benefits.items[index];
    if (!item || !item.custom) {
      return;
    }
    this.benefits.items.splice(index, 1);
    this.calculateAll();
  }

  trackByIndex(index: number, item: any) {
    return index;
  }

  onInputChange() {
    this.calculateAll();
  }

  openFloatingEditor(
    target: 'salaryConcept' | 'salaryPrecioHora' | 'benefitConcept' | 'benefitDevengos' | 'irpfPercent',
    label: string,
    value: string | number,
    inputType: 'text' | 'number',
    rowIndex = -1
  ) {
    this.floatingEditor = {
      isOpen: true,
      target,
      rowIndex,
      label,
      inputType,
      value
    };
  }

  closeFloatingEditor() {
    this.floatingEditor.isOpen = false;
  }

  saveFloatingEditor() {
    const { target, rowIndex, value, inputType } = this.floatingEditor;

    if (target === 'salaryConcept' && rowIndex >= 0 && this.salary.items[rowIndex]) {
      this.salary.items[rowIndex].concepto = String(value ?? '');
    }

    if (target === 'benefitConcept' && rowIndex >= 0 && this.benefits.items[rowIndex]) {
      this.benefits.items[rowIndex].concepto = String(value ?? '');
    }

    if (target === 'salaryPrecioHora' && rowIndex >= 0 && this.salary.items[rowIndex]) {
      const parsed = Number(value);
      if (!Number.isNaN(parsed)) {
        this.salary.items[rowIndex].precioHora = parsed;
      }
    }

    if (target === 'benefitDevengos' && rowIndex >= 0 && this.benefits.items[rowIndex]) {
      const parsed = Number(value);
      if (!Number.isNaN(parsed)) {
        this.benefits.items[rowIndex].devengos = parsed;
      }
    }

    if (target === 'irpfPercent') {
      const parsed = Number(value);
      if (!Number.isNaN(parsed)) {
        this.irpfPercent = parsed;
      }
    }

    if (inputType === 'text' && typeof value !== 'string') {
      this.floatingEditor.value = String(value ?? '');
    }

    this.closeFloatingEditor();
    this.onInputChange();
  }

  openDuplicatePanel() {
    const firstAvailable = TAX_CONSTANTS.MONTHS.find(month => month !== this.monthName);
    this.duplicatePanel = {
      isOpen: true,
      sourceMonth: firstAvailable ?? this.monthName
    };
  }

  closeDuplicatePanel() {
    this.duplicatePanel.isOpen = false;
  }

  applyDuplicateData() {
    if (!this.isBrowser) {
      this.closeDuplicatePanel();
      return;
    }

    if (!this.duplicatePanel.sourceMonth || this.duplicatePanel.sourceMonth === this.monthName) {
      this.closeDuplicatePanel();
      return;
    }

    const sourceKey = this.yearTabsService.getMonthStorageKey(this.year, this.duplicatePanel.sourceMonth);
    const saved = window.localStorage.getItem(sourceKey);
    if (!saved) {
      this.closeDuplicatePanel();
      return;
    }

    try {
      const parsed = JSON.parse(saved) as StoredMonthState;
      this.applyStoredState(parsed);
      this.calculateAll();
    } catch {
      // ignore invalid source month state
    }

    this.closeDuplicatePanel();
  }

  private recalculateResumenMensual() {
    const bruto = this.salary.totalDevengos + this.benefits.totalDevengos;
    const deducciones = this.benefits.totalCalculados + this.taxes.totalDeduccionesEmpleado;
    const neto = bruto - deducciones;
    const prorrataExtras = this.monthService.calculateProrrataExtras(this.salary, this.employee);

    this.resumenMensual = {
      bruto,
      deducciones,
      neto,
      prorrataExtras
    };
  }

  private recalculateAcumulado() {
    const current = this.buildAcumuladoCalculos(this.taxes, this.resumenMensual.neto);
    const previous = this.getPreviousMonthAcumuladoTotals();

    this.acumuladoRows = [
      {
        concepto: 'Imponible IRPF',
        calculos: current.imponibleIrpf,
        total: current.imponibleIrpf + previous.imponibleIrpf
      },
      {
        concepto: 'Retenciones IRPF',
        calculos: current.retencionesIrpf,
        total: current.retencionesIrpf + previous.retencionesIrpf
      },
      {
        concepto: 'Cotizacion SS Empleado',
        calculos: current.cotizacionSsEmpleado,
        total: current.cotizacionSsEmpleado + previous.cotizacionSsEmpleado
      },
      {
        concepto: 'Cotizacion SS Empresa',
        calculos: current.cotizacionSsEmpresa,
        total: current.cotizacionSsEmpresa + previous.cotizacionSsEmpresa
      },
      {
        concepto: 'Recibido',
        calculos: current.recibido,
        total: current.recibido + previous.recibido
      }
    ];
  }

  private recalculateParticiones() {
    const source = [
      { label: 'Retenciones IRPF', row: this.acumuladoRows.find(r => r.concepto === 'Retenciones IRPF'), color: 'var(--mat-sys-error)' },
      { label: 'Cotizacion SS Empleado', row: this.acumuladoRows.find(r => r.concepto === 'Cotizacion SS Empleado'), color: 'var(--mat-sys-inverse-primary)' },
      { label: 'Cotizacion SS Empresa', row: this.acumuladoRows.find(r => r.concepto === 'Cotizacion SS Empresa'), color: 'var(--mat-sys-primary-fixed)' },
      { label: 'Recibido (Neto)', row: this.acumuladoRows.find(r => r.concepto === 'Recibido'), color: 'var(--mat-sys-primary)' }
    ];

    const normalized = source.map(item => ({
      label: item.label,
      value: Math.max(item.row?.calculos ?? 0, 0),
      color: item.color
    }));

    const total = normalized.reduce((sum, item) => sum + item.value, 0);
    this.particionesTotal = total;

    if (total <= 0) {
      this.particionesSlices = [];
      return;
    }

    let startAngle = -90;
    this.particionesSlices = normalized.map((item, index) => {
      const rawSweep = (item.value / total) * 360;
      const sweep = index === normalized.length - 1
        ? (270 - startAngle)
        : rawSweep;
      const endAngle = startAngle + sweep;
      const path = this.createPieSlicePath(100, 100, 88, startAngle, endAngle);
      const percentage = (item.value / total) * 100;
      startAngle = endAngle;

      return {
        label: item.label,
        value: item.value,
        percentage,
        color: item.color,
        path
      };
    });
  }

  private createPieSlicePath(cx: number, cy: number, radius: number, startDeg: number, endDeg: number): string {
    const start = this.polarToCartesian(cx, cy, radius, startDeg);
    const end = this.polarToCartesian(cx, cy, radius, endDeg);
    const largeArcFlag = endDeg - startDeg > 180 ? 1 : 0;

    return [
      `M ${cx} ${cy}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      'Z'
    ].join(' ');
  }

  private polarToCartesian(cx: number, cy: number, radius: number, angleDeg: number) {
    const radians = (angleDeg * Math.PI) / 180;
    return {
      x: cx + (radius * Math.cos(radians)),
      y: cy + (radius * Math.sin(radians))
    };
  }

  private buildAcumuladoCalculos(taxes: TaxesData, neto: number) {
    const irpf = taxes.items.find(item => item.concepto === 'IRPF');
    const irpfDeducciones = irpf?.deduccionesEmpleado ?? 0;

    return {
      imponibleIrpf: irpf?.base ?? 0,
      retencionesIrpf: irpfDeducciones,
      cotizacionSsEmpleado: taxes.totalDeduccionesEmpleado - irpfDeducciones,
      cotizacionSsEmpresa: taxes.totalEmpresa,
      recibido: neto
    };
  }

  private getPreviousMonthAcumuladoTotals() {
    const emptyTotals = {
      imponibleIrpf: 0,
      retencionesIrpf: 0,
      cotizacionSsEmpleado: 0,
      cotizacionSsEmpresa: 0,
      recibido: 0
    };

    if (!this.isBrowser) {
      return emptyTotals;
    }

    const currentIndex = TAX_CONSTANTS.MONTHS.indexOf(this.monthName);
    if (currentIndex <= 0) {
      return emptyTotals;
    }

    const previousMonth = TAX_CONSTANTS.MONTHS[currentIndex - 1];
    const saved = window.localStorage.getItem(this.yearTabsService.getMonthStorageKey(this.year, previousMonth));
    if (!saved) {
      return emptyTotals;
    }

    try {
      const parsed = JSON.parse(saved) as StoredMonthState;
      if (parsed.acumuladoTotals) {
        return parsed.acumuladoTotals;
      }
    } catch {
      return emptyTotals;
    }

    // Compatibilidad con estados antiguos sin acumuladoTotals
    return this.getPreviousMonthsAcumuladoSums();
  }

  private getPreviousMonthsAcumuladoSums() {
    const totals = {
      imponibleIrpf: 0,
      retencionesIrpf: 0,
      cotizacionSsEmpleado: 0,
      cotizacionSsEmpresa: 0,
      recibido: 0
    };

    if (!this.isBrowser) {
      return totals;
    }

    const currentIndex = TAX_CONSTANTS.MONTHS.indexOf(this.monthName);
    if (currentIndex <= 0) {
      return totals;
    }

    const previousMonths = TAX_CONSTANTS.MONTHS.slice(0, currentIndex);
    const socialSecurityPercentages = this.getSocialSecurityPercentages();
    previousMonths.forEach(month => {
      const saved = window.localStorage.getItem(this.yearTabsService.getMonthStorageKey(this.year, month));
      if (!saved) {
        return;
      }

      try {
        const parsed = JSON.parse(saved) as {
          employee?: EmployeeData;
          salary?: { items: Array<Partial<SalaryItem> & { custom?: boolean }> };
          benefits?: { items: Array<Partial<BenefitItem> & { custom?: boolean }> };
          irpfPercent?: number;
        };

        const employee: EmployeeData = parsed.employee ?? {
          ...this.employee
        };

        const salary: SalaryData = {
          items: (parsed.salary?.items ?? []).map(savedItem => ({
            concepto: savedItem.concepto ?? 'Nuevo',
            precioHora: savedItem.concepto === 'Antiguedad' ? 0 : (savedItem.precioHora ?? 0),
            devengos: 0,
            custom: savedItem.custom
          })),
          totalDevengos: 0,
          totalPrecioHora: 0
        };

        const benefits: BenefitsData = {
          items: (parsed.benefits?.items ?? []).map(savedItem => ({
            concepto: savedItem.concepto ?? 'Nuevo',
            devengos: savedItem.devengos ?? 0,
            devengosCalculados: 0,
            custom: savedItem.custom
          })),
          totalDevengos: 0,
          totalCalculados: 0
        };

        if (!salary.items.length || !benefits.items.length) {
          return;
        }

        const irpfPercent = typeof parsed.irpfPercent === 'number' ? parsed.irpfPercent : TAX_CONSTANTS.DEFAULTS.IRPF_PERCENT;
        const salaryCalculated = this.monthService.calculateSalaryDevengos(salary, employee);
        const benefitsCalculated = this.monthService.calculateBenefits(benefits, employee);
        const taxesCalculated = this.monthService.calculateTaxes(
          salaryCalculated,
          benefitsCalculated,
          employee,
          irpfPercent,
          month.includes('Extra'),
          socialSecurityPercentages
        );
        const neto = (salaryCalculated.totalDevengos + benefitsCalculated.totalDevengos)
          - (benefitsCalculated.totalCalculados + taxesCalculated.totalDeduccionesEmpleado);
        const values = this.buildAcumuladoCalculos(taxesCalculated, neto);

        totals.imponibleIrpf += values.imponibleIrpf;
        totals.retencionesIrpf += values.retencionesIrpf;
        totals.cotizacionSsEmpleado += values.cotizacionSsEmpleado;
        totals.cotizacionSsEmpresa += values.cotizacionSsEmpresa;
        totals.recibido += values.recibido;
      } catch {
        // ignore invalid month state
      }
    });

    return totals;
  }

  private get isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  private getSocialSecurityPercentages(): SocialSecurityPercentages {
    if (!this.isBrowser) {
      return DEFAULT_SOCIAL_SECURITY_PERCENTAGES;
    }

    try {
      const saved = window.localStorage.getItem(this.yearTabsService.getSummaryStorageKey(this.year));
      if (!saved) {
        return DEFAULT_SOCIAL_SECURITY_PERCENTAGES;
      }

      const parsed = JSON.parse(saved) as {
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

      const employee = parsed.socialSecurity?.employee;
      const company = parsed.socialSecurity?.company;
      if (!employee || !company) {
        return DEFAULT_SOCIAL_SECURITY_PERCENTAGES;
      }

      return {
        employee: {
          desempleo: this.toDecimal(employee.desempleo, DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.desempleo),
          formacionProfesional: this.toDecimal(employee.formacionProfesional, DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.formacionProfesional),
          contingenciasComunes: this.toDecimal(employee.contingenciasComunes, DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.contingenciasComunes),
          mei: this.toDecimal(employee.mei, DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.mei),
          fogasa: this.toDecimal(employee.fogasa, DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.fogasa),
          atPe: this.toDecimal(employee.atPe, DEFAULT_SOCIAL_SECURITY_PERCENTAGES.employee.atPe),
        },
        company: {
          desempleo: this.toDecimal(company.desempleo, DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.desempleo),
          formacionProfesional: this.toDecimal(company.formacionProfesional, DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.formacionProfesional),
          contingenciasComunes: this.toDecimal(company.contingenciasComunes, DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.contingenciasComunes),
          mei: this.toDecimal(company.mei, DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.mei),
          fogasa: this.toDecimal(company.fogasa, DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.fogasa),
          atPe: this.toDecimal(company.atPe, DEFAULT_SOCIAL_SECURITY_PERCENTAGES.company.atPe),
        }
      };
    } catch {
      return DEFAULT_SOCIAL_SECURITY_PERCENTAGES;
    }
  }

  private toDecimal(value: number | undefined, fallback: number): number {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return fallback;
    }
    return value / 100;
  }

  get monthOptions(): string[] {
    return TAX_CONSTANTS.MONTHS;
  }

  private applyStoredState(parsed: StoredMonthState) {
    if (parsed.employee) {
      this.employee = parsed.employee;
    }

    if (parsed.salary?.items) {
      this.salary.items = parsed.salary.items.map(savedItem => ({
        concepto: savedItem.concepto ?? 'Nuevo',
        precioHora: savedItem.concepto === 'Antiguedad' ? 0 : (savedItem.precioHora ?? 0),
        devengos: 0,
        custom: savedItem.custom
      }));
    }

    if (parsed.benefits?.items) {
      this.benefits.items = parsed.benefits.items.map(savedItem => ({
        concepto: savedItem.concepto ?? 'Nuevo',
        devengos: savedItem.devengos ?? 0,
        devengosCalculados: 0,
        custom: savedItem.custom
      }));
    }

    if (typeof parsed.irpfPercent === 'number') {
      this.irpfPercent = parsed.irpfPercent;
    }
  }

  private loadState() {
    if (!this.isBrowser) {
      return;
    }

    try {
      const saved = window.localStorage.getItem(this.storageKey);
      if (!saved) {
        return;
      }

      const parsed = JSON.parse(saved) as StoredMonthState;
      this.applyStoredState(parsed);
    } catch {
      // ignore invalid stored state
    }
  }

  private saveState() {
    if (!this.isBrowser) {
      return;
    }

    try {
      const state = {
        employee: this.employee,
        salary: {
          items: this.salary.items.map(item => ({
            concepto: item.concepto,
            precioHora: item.concepto === 'Antiguedad' ? undefined : item.precioHora,
            custom: item.custom
          }))
        },
        benefits: {
          items: this.benefits.items.map(item => ({
            concepto: item.concepto,
            devengos: item.devengos,
            custom: item.custom
          }))
        },
        irpfPercent: this.irpfPercent,
        acumuladoTotals: {
          imponibleIrpf: this.acumuladoRows.find(row => row.concepto === 'Imponible IRPF')?.total ?? 0,
          retencionesIrpf: this.acumuladoRows.find(row => row.concepto === 'Retenciones IRPF')?.total ?? 0,
          cotizacionSsEmpleado: this.acumuladoRows.find(row => row.concepto === 'Cotizacion SS Empleado')?.total ?? 0,
          cotizacionSsEmpresa: this.acumuladoRows.find(row => row.concepto === 'Cotizacion SS Empresa')?.total ?? 0,
          recibido: this.acumuladoRows.find(row => row.concepto === 'Recibido')?.total ?? 0
        }
      };
      window.localStorage.setItem(this.storageKey, JSON.stringify(state));
    } catch {
      // ignore storage errors
    }
  }
}

type StoredMonthState = {
  employee?: EmployeeData;
  salary?: { items: Array<Partial<SalaryItem> & { custom?: boolean }> };
  benefits?: { items: Array<Partial<BenefitItem> & { custom?: boolean }> };
  irpfPercent?: number;
  acumuladoTotals?: {
    imponibleIrpf: number;
    retencionesIrpf: number;
    cotizacionSsEmpleado: number;
    cotizacionSsEmpresa: number;
    recibido: number;
  };
};

