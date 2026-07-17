# Feature: Resumen de gastos mensuales por clasificacion

## Ubicacion
Seccion `3-savings/10-monthly` en el mes actual, como resumen de la tabla `GASTOS` por `CLASIFICACION`.

## Proposito
Mostrar un resumen fijo por clasificacion para controlar cuanto del neto mensual ya esta comprometido y cuanto resta disponible por categoria de gasto.

## Tabla "SUMMARY CATEGORY EXPENSES"

Tabla con 5 columnas y 10 filas fijas.

### Columnas

| Columna | Nombre | Tipo de dato | Calculo |
|---|---|---|---|
| 1 | CLASIFICACION | texto | fijo por fila |
| 2 | SUMA € | numerico decimal | suma de importes por clasificacion |
| 3 | SUMA % | porcentaje decimal | SUMA € / NETO_MENSUAL |
| 4 | RESTO € | numerico decimal | NETO_MENSUAL - SUMA € |
| 5 | RESTO % | porcentaje decimal | 100 - SUMA % |

### Filas fijas (orden obligatorio)

1. Vivienda
2. Alimentacion
3. Ocio
4. Trabajo
5. Vehiculos
6. Inversion
7. Regalos
8. Ahorro
9. Ropa
10. Total

## Dependencia de origen

- Tabla origen: `GASTOS`.
- Columna usada para agregacion: `IMPORTE`.
- Columna usada para agrupacion: `CLASIFICACION`.
- Valor externo requerido: `NETO_MENSUAL` del mes actual.

## Formulas

Para las filas 1 a 9 (por clasificacion):

```text
SUMA_EUROS(clasificacion) = Σ IMPORTE de GASTOS donde CLASIFICACION = clasificacion
SUMA_PORCENTAJE(clasificacion) = (SUMA_EUROS(clasificacion) / NETO_MENSUAL) × 100
RESTO_EUROS(clasificacion) = NETO_MENSUAL - SUMA_EUROS(clasificacion)
RESTO_PORCENTAJE(clasificacion) = 100 - SUMA_PORCENTAJE(clasificacion)
```

Para la fila 10 (`Total`):

```text
SUMA_EUROS(Total) = Σ SUMA_EUROS de las filas 1..9
SUMA_PORCENTAJE(Total) = (SUMA_EUROS(Total) / NETO_MENSUAL) × 100
RESTO_EUROS(Total) = NETO_MENSUAL - SUMA_EUROS(Total)
RESTO_PORCENTAJE(Total) = 100 - SUMA_PORCENTAJE(Total)
```

## Reglas de calculo y visualizacion

1. Redondeo visual de importes y porcentajes a 2 decimales.
2. `SUMA %` y `RESTO %` se muestran con simbolo `%`.
3. Los importes se muestran con simbolo `€`.
4. El orden de filas es fijo y no editable.
5. La fila `Total` siempre se recalcula automaticamente a partir de las filas 1..9.

## Validaciones y casos borde

1. Si `NETO_MENSUAL <= 0`, entonces `SUMA % = 0` y `RESTO % = 0` para todas las filas, evitando division por cero o porcentajes invalidos.
2. Si no existen gastos de una `CLASIFICACION`, su `SUMA €` debe ser `0`.
3. Si no existen filas en `GASTOS`, las 10 filas del resumen deben mostrarse con `SUMA € = 0`, `SUMA % = 0`, `RESTO € = NETO_MENSUAL` y `RESTO % = 0`.
4. Importes negativos en `GASTOS` (ajustes o devoluciones) deben participar en la suma de forma algebraica.

## Criterios de aceptacion

1. Existe una tabla resumen con exactamente 5 columnas y 10 filas fijas.
2. Las filas incluyen exactamente las 9 clasificaciones definidas mas la fila `Total`.
3. `SUMA €` se calcula por agrupacion de `CLASIFICACION` sobre `IMPORTE` de `GASTOS`.
4. `SUMA %`, `RESTO €` y `RESTO %` siguen exactamente las formulas definidas.
5. La fila `Total` coincide con la suma de las 9 filas de clasificacion.
6. No se producen errores por division por cero cuando `NETO_MENSUAL <= 0`.
