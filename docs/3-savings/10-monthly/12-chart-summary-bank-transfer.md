# Feature: Gráfico pie resumen de transferencias bancarias mensuales

## Ubicación
Sección `3-savings/10-monthly` en el mes actual, asociada al resumen de transferencias.

## Propósito
Visualizar de forma inmediata la distribución del dinero transferido entre categorías para el mes activo, mostrando tanto porcentaje como valor en euros.

## Tipo de gráfico

- Tipo: Pie chart (gráfico circular).
- Serie única con 5 segmentos.

## Categorías representadas

El gráfico debe incluir exactamente estas 5 categorías:

1. Gasto Fijo
2. Gasto Estimado
3. Inversion Fija
4. Inversion Estimada
5. Ahorro

## Fuente de datos

- Tabla origen: `TRANSFERENCIAS`.
- Campo de agrupación: `TIPO`.
- Campo de agregación: `IMPORTE`.
- Contexto: mes activo.

## Métricas por categoría

Para cada categoría `c`:

```text
VALOR_EUROS(c) = Σ IMPORTE de TRANSFERENCIAS donde TIPO = c
TOTAL_EUROS = Σ VALOR_EUROS(c) para las 5 categorías
PORCENTAJE(c) = (VALOR_EUROS(c) / TOTAL_EUROS) × 100
```

## Reglas de cálculo

1. Cada segmento del pie usa `PORCENTAJE(c)` como proporción angular.
2. El valor mostrado en tooltip y/o etiqueta debe incluir:
   - nombre de categoría,
   - `VALOR_EUROS(c)` en `€`,
   - `PORCENTAJE(c)` con `%`.
3. Redondeo visual a 2 decimales para euros y porcentaje.
4. La suma de porcentajes mostrados debe ser 100% (salvo pequeñas diferencias de redondeo visual).

## Comportamiento UI esperado

1. El gráfico se recalcula automáticamente cuando cambian las filas de `TRANSFERENCIAS` del mes activo.
2. Debe existir leyenda con las 5 categorías.
3. Cada categoría mantiene color consistente dentro del mes activo.
4. El tooltip de cada segmento muestra categoría, euros y porcentaje.

## Estados y casos borde

1. Si `TOTAL_EUROS = 0`, el gráfico debe mostrarse en estado vacío seguro (sin error), con porcentajes en 0.
2. Si una categoría no tiene movimientos, su `VALOR_EUROS` es 0 y su segmento puede ocultarse o renderizarse como 0 sin romper la leyenda.
3. Si existen importes negativos en una categoría, deben reflejarse en `VALOR_EUROS(c)` de forma algebraica; si el motor de gráficos no admite valores negativos en pie, se debe aplicar estado seguro definido por UI (por ejemplo, bloquear render del pie y mostrar mensaje de datos no representables).
4. Si solo una categoría tiene valor distinto de 0, debe ocupar el 100% del gráfico.

## Dependencias de entrada

- Datos de `TRANSFERENCIAS` del mes activo.
- Catálogo de tipos válido: Gasto Fijo, Gasto Estimado, Inversion Fija, Inversion Estimada, Ahorro.

## Dependencias de salida

- Distribución visual por categoría para análisis rápido.
- Soporte visual al control de gasto, inversion y ahorro mensual.

## Criterios de aceptación

1. Existe un gráfico pie con exactamente 5 categorías definidas.
2. Cada categoría muestra porcentaje y valor en euros.
3. Los datos se agregan por `TIPO` usando `IMPORTE` de `TRANSFERENCIAS` del mes activo.
4. El gráfico se actualiza automáticamente tras cambios en transferencias.
5. El sistema maneja correctamente el caso `TOTAL_EUROS = 0` sin errores visibles.