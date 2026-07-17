# Feature: Resumen de transferencias bancarias mensuales

## Ubicación
Sección `3-savings/10-monthly` en el mes actual, como resumen de la tabla `TRANSFERENCIAS`.

## Propósito
Mostrar un resumen fijo por tipo de transferencia para controlar cuánto del neto mensual ya está comprometido y cuánto resta disponible.

## Tabla "SUMMARY BANK TRANSFER"

Tabla con 5 columnas y 6 filas fijas.

### Columnas

| Columna | Nombre | Tipo de dato | Cálculo |
|---|---|---|---|
| 1 | TIPO | texto | fijo por fila |
| 2 | SUMA € | numérico decimal | suma de importes por tipo |
| 3 | SUMA % | porcentaje decimal | SUMA € / NETO MENSUAL |
| 4 | RESTO € | numérico decimal | NETO MENSUAL - SUMA € |
| 5 | RESTO % | porcentaje decimal | 100 - SUMA % |

### Filas fijas (orden obligatorio)

1. Gasto Fijo
2. Gasto Estimado
3. Inversion Fija
4. Inversion Estimada
5. Ahorro
6. Total

## Dependencia de origen

- Tabla origen: `TRANSFERENCIAS`.
- Columna usada para agregación: `IMPORTE`.
- Columna usada para agrupación: `TIPO`.
- Valor externo requerido: `NETO MENSUAL` del mes actual.

## Fórmulas

Para las filas 1 a 5 (por tipo):

```text
SUMA_EUROS(tipo) = Σ IMPORTE de TRANSFERENCIAS donde TIPO = tipo
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

## Reglas de cálculo y visualización

1. Redondeo visual de importes y porcentajes a 2 decimales.
2. `SUMA %` y `RESTO %` se muestran con símbolo `%`.
3. Los importes se muestran con símbolo `€`.
4. El orden de filas es fijo y no editable.
5. La fila `Total` siempre se recalcula automáticamente a partir de las filas 1..5.

## Validaciones y casos borde

1. Si `NETO_MENSUAL <= 0`, entonces `SUMA % = 0` y `RESTO % = 0` para todas las filas, evitando división por cero o porcentajes inválidos.
2. Si no existen transferencias de un `TIPO`, su `SUMA €` debe ser `0`.
3. Si no existen filas en `TRANSFERENCIAS`, las 6 filas del resumen deben mostrarse con `SUMA € = 0`, `SUMA % = 0`, `RESTO € = NETO_MENSUAL` y `RESTO % = 0`.
4. Importes negativos en `TRANSFERENCIAS` (ajustes o devoluciones) deben participar en la suma de forma algebraica.

## Criterios de aceptación

1. Existe una tabla resumen con exactamente 5 columnas y 6 filas fijas.
2. Las filas incluyen exactamente los tipos definidos más la fila `Total`.
3. `SUMA €` se calcula por agrupación de `TIPO` sobre `IMPORTE` de `TRANSFERENCIAS`.
4. `SUMA %`, `RESTO €` y `RESTO %` siguen exactamente las fórmulas definidas.
5. La fila `Total` coincide con la suma de las 5 filas de tipo.
6. No se producen errores por división por cero cuando `NETO_MENSUAL <= 0`.