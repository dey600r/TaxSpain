# Feature: Transfers bancarios mensuales

## Ubicación
Sección `3-savings/10-monthly` en el mes actual.

## Propósito
Registrar transferencias entre cuentas y medir su peso respecto al neto de nómina del mes.

## Tabla "TRANSFERS"

Tabla con 6 columnas: Cuenta Origen | Cuenta Destino | Concepto | Tipo | Importe | % Neto

### Columnas

| Columna | Nombre | Tipo de dato | Edición |
|---|---|---|---|
| 1 | CUENTA ORIGEN | texto | editable |
| 2 | CUENTA DESTINO | texto | editable |
| 3 | CONCEPTO | texto | editable |
| 4 | TIPO | dropdown | editable |
| 5 | IMPORTE | numérico decimal | editable |
| 6 | % NETO | porcentaje decimal | automático |

### Datos maestros (dropdown TIPO)

Valores permitidos:
- Gasto Fijo
- Gasto Estimado
- Inversion Fija
- Inversion Estimada
- Ahorro

## Fórmulas

### % NETO (por fila)
```
%NetoFila = (ImporteFila / NetoNominaMesActual) × 100
```

Validaciones:
- Si `NetoNominaMesActual <= 0` -> `%NetoFila = 0`.
- Redondeo visual a 2 decimales.

### Footer: Total Importe
```
TotalImporte = Σ(ImporteFila)
```

### Footer: Total % NETO
```
TotalPorcentajeNeto = Σ(%NetoFila)
```

## Comportamiento UI
- Tabla editable por filas.
- Debe existir footer fijo con:
  - Suma total de `IMPORTE`.
  - Suma total de `% NETO`.
- `% NETO` por fila y total se muestran con 2 decimales y símbolo `%`.
- El campo `TIPO` debe renderizarse como dropdown alimentado por los datos maestros definidos arriba.

## Reglas visuales del footer para Total % NETO
- `TotalPorcentajeNeto < 90` -> estilo normal.
- `90 <= TotalPorcentajeNeto < 100` -> color warning.
- `TotalPorcentajeNeto >= 100` -> color rojo (error/critico).

## Dependencias de entrada
- `NetoNominaMesActual` del mes actual (fuente funcional: neto de nómina mensual).

## Dependencias de salida
- `TotalImporte` y `TotalPorcentajeNeto` para control mensual de gasto/inversion/ahorro.
- Señal visual de riesgo cuando el total consume casi todo o supera el neto mensual.

## Validaciones
- `IMPORTE` admite decimales y negativos (por ejemplo, devolución o ajuste).
- `TIPO` solo admite valores del catálogo.
- Celdas de texto permiten vacío, pero se recomienda completar para trazabilidad.

## Casos borde
1. Neto de nómina igual a 0 -> todos los `% NETO` deben mostrarse en 0 sin errores de división.
2. Neto de nómina negativo -> todos los `% NETO` deben mostrarse en 0.
3. Sin filas de transferencias -> footer en 0 para importe y porcentaje.
4. Total `% NETO` exactamente 90,00 -> warning.
5. Total `% NETO` exactamente 100,00 -> rojo.
6. Mezcla de importes positivos y negativos -> total calculado por suma algebraica.
