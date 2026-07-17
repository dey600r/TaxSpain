# Feature: Dashboard - Gráfico comparativo de impuestos por año

## Ubicación
Página `/dashboard`. Card visible en la vista principal del Dashboard.

## Propósito
Mostrar de un vistazo la evolución interanual de los impuestos pagados y el salario bruto total para todos los años registrados en la aplicación.

## Card "Impuestos por año"

### Tipo de gráfico
Gráfico de barras agrupadas con línea superpuesta (combo chart), implementado en SVG inline.

### Eje X
Cada año registrado en la aplicación (uno o más grupos).

### Barras (4 por año)
Cada grupo de barras representa un año y contiene **4 barras** con los siguientes datos procedentes de la columna **PAGADO €** de la tabla Borrador Renta (`27-results-calculations.md`):

| # | Serie | Fuente de dato |
|---|-------|----------------|
| 1 | Retención IRPF | `borradorRetencionIrpfPagadoEuro` = suma anual de deducciones IRPF sobre todos los meses |
| 2 | Retención Capital | Siempre 0 en esta versión (no implementado) |
| 3 | SS Empleado | `borradorSsEmpleadoPagadoEuro` = suma anual de cotizaciones SS empleado |
| 4 | SS Empresa | `borradorSsEmpresaPagadoEuro` = suma anual de cotizaciones SS empresa |

### Línea
Representa el **Salario Bruto Total** anual (suma de Imponible IRPF sobre todos los meses del año, procedente de `23-annual-income-summary.md`).

### Eje Y
Importes en euros. Escala lineal desde 0 hasta el máximo de `salarioBruto` entre todos los años × 1,1 (10% de margen).

## Fuente de datos
- Por cada año registrado en `year-tabs-state` de localStorage, se leen todos los meses usando las claves `month-tab-state-{year}-{mes}`.
- Para calcular los importes se utiliza el servicio `MonthFormService` con los porcentajes SS almacenados en `irpf-summary-state-{year}` (o los valores por defecto si no existen).
- El cálculo es consistente con el que realiza `IrpfSummaryTabComponent`.

## Comportamiento UI
- Si no hay datos (ningún año con meses rellenos), se muestra un mensaje "No hay datos registrados."
- El SVG es responsive (ancho 100%, `viewBox` fijo).
- Las barras están centradas dentro del grupo; el ancho máximo de grupo está limitado para que no sean excesivamente anchas con pocos años.
- Una leyenda debajo del gráfico identifica cada serie con su color.

## Colores
| Serie | Color |
|-------|-------|
| Retención IRPF | `--mat-sys-error` |
| Retención Capital | `--mat-sys-tertiary` |
| SS Empleado | `--mat-sys-secondary` |
| SS Empresa | `--mat-sys-primary` |
| Línea Salario Bruto | `--mat-sys-on-surface` |

## Criterios de aceptación
1. La card aparece en el dashboard con título "Impuestos por año".
2. Por cada año registrado se muestra un grupo de 4 barras correctamente agrupadas.
3. La línea de salario bruto conecta los puntos centrales de cada grupo.
4. Los valores de cada barra coinciden con la columna PAGADO € de la tabla Borrador Renta del año correspondiente.
5. La leyenda identifica cada serie.
6. Con un solo año los elementos siguen siendo legibles (barras centradas, no excesivamente anchas).
7. Sin datos se muestra el mensaje de "sin datos".
