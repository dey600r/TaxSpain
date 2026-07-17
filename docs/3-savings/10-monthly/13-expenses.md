# Feature: Gastos mensuales

## Ubicacion
Seccion `3-savings/10-monthly` en el mes actual.

## Proposito
Registrar gastos, inversion y ahorro mensual por categoria, y medir su peso respecto al neto de nomina del mes.

## Tabla "GASTOS"

Tabla con columnas funcionales: Cuenta Origen | Tipo | Clasificacion | Concepto | Importe | % Neto | Cap. Reaccion %

### Columnas

| Columna | Nombre | Tipo de dato | Edicion |
|---|---|---|---|
| 1 | CUENTA ORIGEN | texto | editable |
| 2 | TIPO | dropdown | editable |
| 3 | CLASIFICACION | dropdown | editable |
| 4 | CONCEPTO | texto | editable |
| 5 | IMPORTE | numerico decimal | editable |
| 6 | % NETO | porcentaje decimal | automatico |
| 7 | CAP. REACCION % | porcentaje decimal | editable |

### Datos maestros (dropdown TIPO)

Valores permitidos:
- Gasto Fijo
- Gasto Estimado
- Inversion Fija
- Inversion estimada
- Ahorro

### Datos maestros (dropdown CLASIFICACION)

Valores permitidos:
- Vivienda
- Alimentacion
- Ocio
- Trabajo
- Vehiculos
- Inversion
- Regalos
- Ahorro
- Ropa

## Formulas

### % NETO (por fila)
```text
PorcentajeNetoFila = (ImporteFila / NetoMensualMesActual) × 100
```

Validaciones:
- Si `NetoMensualMesActual <= 0` -> `PorcentajeNetoFila = 0`.
- Redondeo visual a 2 decimales.

### Footer: Total Importe
```text
TotalImporte = Σ(ImporteFila)
```

### Footer: Total % NETO
```text
TotalPorcentajeNeto = Σ(PorcentajeNetoFila)
```

### Footer: Promedio CAP. REACCION %
```text
PromedioCapReaccion = promedio(CapReaccionFila%)
```

Regla:
- Solo considerar filas con valor numerico valido en `CAP. REACCION %`.

## Comportamiento UI
- Tabla editable por filas.
- `TIPO` y `CLASIFICACION` se renderizan como dropdown con catalogos cerrados.
- `IMPORTE` acepta decimales.
- `% NETO` es solo lectura y recalcula automaticamente ante cambios de `IMPORTE` o `NETO MENSUAL`.
- `CAP. REACCION %` es editable numerico por fila.
- Debe existir footer fijo con:
  - suma total de `IMPORTE`,
  - suma total de `% NETO`,
  - promedio de `CAP. REACCION %` (si aplica en UI).

## Reglas visuales recomendadas para Total % NETO
- `TotalPorcentajeNeto < 90` -> estilo normal.
- `90 <= TotalPorcentajeNeto < 100` -> color warning.
- `TotalPorcentajeNeto >= 100` -> color rojo (error/critico).

## Dependencias de entrada
- `NetoMensualMesActual` del mes actual (fuente funcional: neto de nomina mensual).

## Dependencias de salida
- `TotalImporte` y `TotalPorcentajeNeto` para control mensual de gasto/inversion/ahorro.
- `CAP. REACCION %` para estimar margen de ajuste por partida.

## Validaciones
- `CUENTA ORIGEN`: texto libre, admite vacio.
- `TIPO`: solo admite valores del catalogo definido.
- `CLASIFICACION`: solo admite valores del catalogo definido.
- `CONCEPTO`: texto libre, admite vacio.
- `IMPORTE`: numerico decimal, admite negativos para ajustes/devoluciones.
- `% NETO`: calculado, no editable.
- `CAP. REACCION %`: rango recomendado `0-100`.

## Casos borde
1. Neto mensual igual a 0 -> `% NETO` por fila y total en 0 sin errores de division.
2. Neto mensual negativo -> `% NETO` por fila y total en 0.
3. Sin filas de gastos -> footer en 0 para importe y porcentaje.
4. Importes mixtos (positivos y negativos) -> total calculado por suma algebraica.
5. CAP. REACCION % vacio en algunas filas -> excluir del promedio de capacidad de reaccion.
6. Cambio de neto mensual por recalculo de nomina -> recalculo inmediato de todos los `% NETO`.

## Criterios de aceptacion
1. Existe una tabla "GASTOS" con las 7 columnas funcionales definidas en este documento.
2. `TIPO` y `CLASIFICACION` solo permiten seleccionar valores de sus respectivos catalogos.
3. `% NETO` se calcula por fila como `IMPORTE / NETO MENSUAL` y se muestra en porcentaje.
4. `CAP. REACCION %` es editable y numerico por fila.
5. El footer muestra, al menos, total de `IMPORTE` y total de `% NETO`.
6. No se producen errores por division por cero cuando `NETO MENSUAL <= 0`.
