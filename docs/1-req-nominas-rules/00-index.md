# Reglas funcionales de nóminas

## Propósito
Define estructura, fórmulas y comportamientos para nóminas mensuales, declaración anual de IRPF y gestión multiejercicio por pestañas de año en España.

## Estructura general

### Secciones mensuales colapsables
Las 14 secciones comparten **estructura y fórmulas idénticas**. Cambian únicamente los inputs del mes. Cada mes se representa como un panel colapsable en la misma página del dashboard.

- `Enero`, `Febrero`, `Marzo`, `Abril`, `Mayo`, `Junio`
- `Extra1` (entre Junio y Julio)
- `Julio`, `Agosto`, `Septiembre`, `Octubre`, `Noviembre`, `Diciembre`
- `Extra2` (después de Diciembre)
- `Resumen` (sección final para cálculos anuales)

Todas las secciones mensuales comparten estructura idéntica. Cambian solo los valores de entrada.

## Mapa de features

### Área mensual (10-monthly/)
Aplicable a cada mes (Enero...Diciembre, Extra1, Extra2).

| Fichero | Propósito |
|---------|----------|
| [11-employee-data.md](10-monthly/11-employee-data.md) | Inputs base del empleado (nombre, días, trienios, etc) |
| [12-salary-base.md](10-monthly/12-salary-base.md) | Tabla de conceptos de salario y devengos |
| [13-benefits.md](10-monthly/13-benefits.md) | Seguro, tickets, vida y deducciones |
| [14-taxes-contributions.md](10-monthly/14-taxes-contributions.md) | Seguridad Social, IRPF y retenciones |
| [15-monthly-summary.md](10-monthly/15-monthly-summary.md) | Resumen: bruto, neto, prorrata |
| [16-accumulated.md](10-monthly/16-accumulated.md) | Totales acumulados mes a mes |
| [17-partitions-chart.md](10-monthly/17-partitions-chart.md) | Gráfico pie de distribución |

### Área de resumen anual (20-annual-summary/)
Sección única al final, después de Extra2.

| Fichero | Propósito |
|---------|----------|
| [21-configuration-social-security.md](20-annual-summary/21-configuration-social-security.md) | Porcentajes SS (empleado/empresa) |
| [22-configuration-irpf-brackets.md](20-annual-summary/22-configuration-irpf-brackets.md) | Tramos IRPF estatal y autonómico |
| [23-annual-income-summary.md](20-annual-summary/23-annual-income-summary.md) | Consolidado bruto anual |
| [24-tax-exemptions.md](20-annual-summary/24-tax-exemptions.md) | Desgravaciones (mínimo personal, descendientes, etc) |
| [25-contribution-base.md](20-annual-summary/25-contribution-base.md) | Base de cotización final |
| [26-final-tax-calculation.md](20-annual-summary/26-final-tax-calculation.md) | Impuesto IRPF necesario |
| [27-results-calculations.md](20-annual-summary/27-results-calculations.md) | Tabla de borrador renta y consolidado |
| [28-results-chart.md](20-annual-summary/28-results-chart.md) | Gráfico de quesitos de resultados anuales |

### Área multiejercicio (30-yearly/)
Gestión de pestañas por año y aislamiento de datos por ejercicio fiscal.

| Fichero | Propósito |
|---------|----------|
| [31-years-tab.md](30-yearly/31-years-tab.md) | Pestañas de años: alta, edición, borrado y ordenación automática por año |

## Orden de lectura recomendado
1. Este fichero (orientación general)
2. [31-years-tab.md](30-yearly/31-years-tab.md) (contexto de gestión por año y aislamiento entre ejercicios)
3. [21-configuration-social-security.md](20-annual-summary/21-configuration-social-security.md) (parámetros fijos que alimentan todos los meses)
4. [22-configuration-irpf-brackets.md](20-annual-summary/22-configuration-irpf-brackets.md) (tramos de IRPF)
5. [11-employee-data.md](10-monthly/11-employee-data.md) hasta [17-partitions-chart.md](10-monthly/17-partitions-chart.md) (estructura repetible mensual)
6. [23-annual-income-summary.md](20-annual-summary/23-annual-income-summary.md) hasta [26-final-tax-calculation.md](20-annual-summary/26-final-tax-calculation.md) (cálculos finales)

## Reglas de sincronización
- Si cambia una fórmula en área mensual, revisar que los acumulados (16) y resumen anual (23-26) siguen siendo coherentes.
- Los porcentajes de SS (21) alimentan todas las nóminas mensuales (14).
- Los tramos IRPF (22) se usan en resumen anual (26).
- Si cambia la lógica de pestañas por año (31), validar que el aislamiento de estados por ejercicio sigue intacto para mensual y anual.
