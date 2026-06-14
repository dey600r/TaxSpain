# Feature: Resumen anual de nóminas

## Ubicación
Card "Resumen de nominas" en colapsable "RENTA" (después de Extra2).

## Propósito
Consolidar el bruto anual y otros ingresos para cálculo de IRPF definitivo.

## Tabla "Resumen de nominas"

Tabla con 2 columnas: Concepto | Importe

### Filas fijas

| # | Concepto | Columna 2: Importe |
|----|----------|-----------|
| 1 | Salario Bruto | automático |
| 2 | Otros beneficios | editable (default 0) |
| 3 | **TOTAL** | automático |

## Fórmulas

### Salario Bruto (fila 1)
```
= Imponible IRPF Total (Col3) de 16-accumulated.md (Extra2, fila 1)
```

Nota: Es el acumulado anual de todas las nóminas de enero a diciembre + Extra1 + Extra2.

### Otros beneficios (fila 2)
```
= Valor editable, default 0
```

Permite incluir ingresos adicionales no derivados de nómina (ej: rendimientos del capital, venta de bienes, herencias, etc).

### TOTAL (fila 3)
```
= Salario Bruto + Otros beneficios
```

## Comportamiento UI
- Salario Bruto: no editable (cálculo automático desde nóminas)
- Otros beneficios: editable (número positivo)
- TOTAL: no editable (suma automática)
- Formato moneda con 2 decimales
- Si cambia alguna nómina mensual, Salario Bruto se recalcula automáticamente

## Dependencias de entrada
- **Imponible IRPF Total** de 16-accumulated.md (Extra2, Col3, fila 1)

## Dependencias de salida
- **TOTAL** → usado en 24-tax-exemptions.md
- **TOTAL** → usado en 25-contribution-base.md
- **TOTAL** → referencia para 26-final-tax-calculation.md

## Casos borde
1. Salario Bruto = 0 (sin nóminas) → TOTAL = Otros beneficios
2. Otros beneficios negativo (pérdidas) → permitido, afecta TOTAL
3. Cambio retroactivo de nómina mensual → recalcula automáticamente aquí
