// Constantes de la aplicación para cálculos de nómina
export const TAX_CONSTANTS = {
  // Porcentajes empleados SS
  SS_EMPLOYEE_PERCENTAGES: {
    DESEMPLEO: 0.0155,
    FORMACION_PROFESIONAL: 0.001,
    CONTINGENCIAS_COMUNES: 0.047,
    MEI: 0.0015,
    FOGASA: 0,
    AT_PE: 0,
  },
  // Porcentajes empresa SS
  SS_COMPANY_PERCENTAGES: {
    DESEMPLEO: 0.055,
    FORMACION_PROFESIONAL: 0.006,
    CONTINGENCIAS_COMUNES: 0.236,
    MEI: 0.0075,
    FOGASA: 0.002,
    AT_PE: 0.015,
  },
  // Valores por defecto
  DEFAULTS: {
    NOMBRE: '',
    N_EMPLEADO: null,
    N_DIAS: 30,
    PAGAS_EXTRA: 2,
    HORAS_EXTRA: 0,
    PERCENT_DEDUCIBLE_SEGURO_MEDICO: null,
    TRIENIOS: null,
    SEGURO_MEDICO: -41.67,
    TICKETS: 48,
    SEGURO_VIDA: 7.78,
    IRPF_PERCENT: 22.22,
  },
  // Meses
  MONTHS: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Extra1',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre', 'Extra2'
  ],
};