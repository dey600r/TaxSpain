# Feature: Resumen de gastos mensuales

## Ubicacion
Seccion `3-savings/10-monthly` en el mes actual, como resumen de la tabla `GASTOS`.

## Proposito
Mostrar un resumen fijo por tipo de gasto para controlar cuanto del neto mensual ya esta comprometido y cuanto resta disponible.

## Tabla "SUMMARY EXPENSES"

Tabla con 5 columnas y 6 filas fijas.

### Columnas

| Columna | Nombre | Tipo de dato | Calculo |
|---|---|---|---|
| 1 | TIPO | texto | fijo por fila |
| 2 | SUMA € | numerico decimal | suma de importes por tipo |
| 3 | SUMA % | porcentaje decimal | SUMA € / NETO MENSUAL |
| 4 | RESTO € | numerico decimal | NETO MENSUAL - SUMA € |
| 5 | RESTO % | porcentaje decimal | 100 - SUMA % |

### Filas fijas (orden obligatorio)

1. Gasto Fijo
2. Gasto Estimado
3. Inversion Fija
4. Inversion estimada
5. Ahorro
6. Total

## Dependencia de origen

- Tabla origen: `GASTOS`.
- Columna usada para agregacion: `IMPORTE`.
- Columna usada para agrupacion: `TIPO`.
- Valor externo requerido: `NETO MENSUAL` del mes actual.

## Formulas

Para las filas 1 a 5 (por tipo):

```text
SUMA_EUROS(tipo) = Σ IMPORTE de GASTOS donde TIPO = tipo
SUMA_PORCENTAJE(tipo) = (SUMA_EUROS(tipo) / NETO_MENSUAL) × 100
RESTO_EUROS(tipo) = NETO_MENSUAL - SUMA_EUROS(tipo)
RESTO_PORCENTAJE(tipo) = 100 - SUMA_PORCENTAJE(tipo)
```

Para la fila 6 (`Total`):

```text
SUMA_EUROS(Total) = Σ SUMA_EUROS de las filas 1..5
SUMA_PORCENTAJE(Total) = (SUMA_EUROS(Total) / NETO_MENSUAL) × 100
RESTO_EUROS(Total) = NETO_MENSUAL - SUMA_EUROS(Total)
RESTO_PORCENTAJE(Total) = 100 - SUMA_PORCENTAJE(Total)
```

## Reglas de calculo y visualizacion

1. Redondeo visual de importes y porcentajes a 2 decimales.
2. `SUMA %` y `RESTO %` se muestran con simbolo `%`.
3. Los importes se muestran con simbolo `€`.
4. El orden de filas es fijo y no editable.
5. La fila `Total` siempre se recalcula automaticamente a partir de las filas 1..5.

## Validaciones y casos borde

1. Si `NETO_MENSUAL <= 0`, entonces `SUMA % = 0` y `RESTO % = 0` para todas las filas, evitando division por cero o porcentajes invalidos.
2. Si no existen gastos de un `TIPO`, su `SUMA €` debe ser `0`.
3. Si no existen filas en `GASTOS`, las 6 filas del resumen deben mostrarse con `SUMA € = 0`, `SUMA % = 0`, `RESTO € = NETO_MENSUAL` y `RESTO % = 0`.
4. Importes negativos en `GASTOS` (ajustes o devoluciones) deben participar en la suma de forma algebraica.

## Criterios de aceptacion

1. Existe una tabla resumen con exactamente 5 columnas y 6 filas fijas.
2. Las filas incluyen exactamente los tipos definidos mas la fila `Total`.
3. `SUMA €` se calcula por agrupacion de `TIPO` sobre `IMPORTE` de `GASTOS`.
4. `SUMA %`, `RESTO €` y `RESTO %` siguen exactamente las formulas definidas.
5. La fila `Total` coincide con la suma de las 5 filas de tipo.
6. No se producen errores por division por cero cuando `NETO_MENSUAL <= 0`.
