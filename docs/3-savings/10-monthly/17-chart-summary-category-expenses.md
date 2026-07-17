# Feature: Grafico pie resumen de gastos mensuales por clasificacion

## Ubicacion
Seccion `3-savings/10-monthly` en el mes actual, asociada al resumen por clasificacion.

## Proposito
Visualizar de forma inmediata la distribucion del dinero gastado por clasificacion en el mes activo, mostrando tanto porcentaje como valor en euros.

## Tipo de grafico

- Tipo: Pie chart (grafico circular).
- Serie unica con 9 segmentos.

## Categorias representadas

El grafico debe incluir exactamente estas 9 categorias:

1. Vivienda
2. Alimentacion
3. Ocio
4. Trabajo
5. Vehiculos
6. Inversion
7. Regalos
8. Ahorro
9. Ropa

## Fuente de datos

- Tabla origen: `GASTOS`.
- Campo de agrupacion: `CLASIFICACION`.
- Campo de agregacion: `IMPORTE`.
- Contexto: mes activo.

## Metricas por categoria

Para cada categoria `c`:

```text
VALOR_EUROS(c) = Σ IMPORTE de GASTOS donde CLASIFICACION = c
TOTAL_EUROS = Σ VALOR_EUROS(c) para las 9 categorias
PORCENTAJE(c) = (VALOR_EUROS(c) / TOTAL_EUROS) × 100
```

## Reglas de calculo

1. Cada segmento del pie usa `PORCENTAJE(c)` como proporcion angular.
2. El valor mostrado en tooltip y/o etiqueta debe incluir:
   - nombre de categoria,
   - `VALOR_EUROS(c)` en `€`,
   - `PORCENTAJE(c)` con `%`.
3. Redondeo visual a 2 decimales para euros y porcentaje.
4. La suma de porcentajes mostrados debe ser 100% (salvo pequenas diferencias de redondeo visual).

## Comportamiento UI esperado

1. El grafico se recalcula automaticamente cuando cambian las filas de `GASTOS` del mes activo.
2. Debe existir leyenda con las 9 categorias.
3. Cada categoria mantiene color consistente dentro del mes activo.
4. El tooltip de cada segmento muestra categoria, euros y porcentaje.

## Estados y casos borde

1. Si `TOTAL_EUROS = 0`, el grafico debe mostrarse en estado vacio seguro (sin error), con porcentajes en 0.
2. Si una categoria no tiene movimientos, su `VALOR_EUROS` es 0 y su segmento puede ocultarse o renderizarse como 0 sin romper la leyenda.
3. Si existen importes negativos en una categoria, deben reflejarse en `VALOR_EUROS(c)` de forma algebraica; si el motor de graficos no admite valores negativos en pie, se debe aplicar estado seguro definido por UI (por ejemplo, bloquear render del pie y mostrar mensaje de datos no representables).
4. Si solo una categoria tiene valor distinto de 0, debe ocupar el 100% del grafico.

## Dependencias de entrada

- Datos de `GASTOS` del mes activo.
- Catalogo de clasificaciones valido: Vivienda, Alimentacion, Ocio, Trabajo, Vehiculos, Inversion, Regalos, Ahorro, Ropa.

## Dependencias de salida

- Distribucion visual por clasificacion para analisis rapido.
- Soporte visual al control de gasto, inversion y ahorro mensual.

## Criterios de aceptacion

1. Existe un grafico pie con exactamente 9 categorias definidas.
2. Cada categoria muestra porcentaje y valor en euros.
3. Los datos se agregan por `CLASIFICACION` usando `IMPORTE` de `GASTOS` del mes activo.
4. El grafico se actualiza automaticamente tras cambios en gastos.
5. El sistema maneja correctamente el caso `TOTAL_EUROS = 0` sin errores visibles.
