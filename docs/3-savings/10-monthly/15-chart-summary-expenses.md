# Feature: Grafico pie resumen de gastos mensuales

## Ubicacion
Seccion `3-savings/10-monthly` en el mes actual, asociada al resumen de gastos.

## Proposito
Visualizar de forma inmediata la distribucion del dinero gastado entre categorias para el mes activo, mostrando tanto porcentaje como valor en euros.

## Tipo de grafico

- Tipo: Pie chart (grafico circular).
- Serie unica con 5 segmentos.

## Categorias representadas

El grafico debe incluir exactamente estas 5 categorias:

1. Gasto Fijo
2. Gasto Estimado
3. Inversion Fija
4. Inversion estimada
5. Ahorro

## Fuente de datos

- Tabla origen: `GASTOS`.
- Campo de agrupacion: `TIPO`.
- Campo de agregacion: `IMPORTE`.
- Contexto: mes activo.

## Metricas por categoria

Para cada categoria `c`:

```text
VALOR_EUROS(c) = Σ IMPORTE de GASTOS donde TIPO = c
TOTAL_EUROS = Σ VALOR_EUROS(c) para las 5 categorias
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
2. Debe existir leyenda con las 5 categorias.
3. Cada categoria mantiene color consistente dentro del mes activo.
4. El tooltip de cada segmento muestra categoria, euros y porcentaje.

## Estados y casos borde

1. Si `TOTAL_EUROS = 0`, el grafico debe mostrarse en estado vacio seguro (sin error), con porcentajes en 0.
2. Si una categoria no tiene movimientos, su `VALOR_EUROS` es 0 y su segmento puede ocultarse o renderizarse como 0 sin romper la leyenda.
3. Si existen importes negativos en una categoria, deben reflejarse en `VALOR_EUROS(c)` de forma algebraica; si el motor de graficos no admite valores negativos en pie, se debe aplicar estado seguro definido por UI (por ejemplo, bloquear render del pie y mostrar mensaje de datos no representables).
4. Si solo una categoria tiene valor distinto de 0, debe ocupar el 100% del grafico.

## Dependencias de entrada

- Datos de `GASTOS` del mes activo.
- Catalogo de tipos valido: Gasto Fijo, Gasto Estimado, Inversion Fija, Inversion estimada, Ahorro.

## Dependencias de salida

- Distribucion visual por categoria para analisis rapido.
- Soporte visual al control de gasto, inversion y ahorro mensual.

## Criterios de aceptacion

1. Existe un grafico pie con exactamente 5 categorias definidas.
2. Cada categoria muestra porcentaje y valor en euros.
3. Los datos se agregan por `TIPO` usando `IMPORTE` de `GASTOS` del mes activo.
4. El grafico se actualiza automaticamente tras cambios en gastos.
5. El sistema maneja correctamente el caso `TOTAL_EUROS = 0` sin errores visibles.
