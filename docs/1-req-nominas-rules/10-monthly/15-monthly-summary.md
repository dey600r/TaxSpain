# Feature: Resumen mensual

## Ubicación
Card "RESUMEN MENSUAL" en cada mes.

## Propósito
Mostrar resumen consolidado: bruto, deducciones, neto, prorrata extras.

## Tabla "RESUMEN MENSUAL"

Tabla con 2 columnas: Concepto (fijo) | Base (automático)

| # | Concepto | Valor |
|----|----------|-------|
| 1 | Bruto | automático |
| 2 | Deducciones | automático |
| 3 | Neto | automático |
| 4 | Prorrata Extras | automático |

## Fórmulas

### Bruto (fila 1)
```
= TOTAL Salario Base Columna 3 de 12-salary-base.md
  + TOTAL Beneficios Columna 2 de 13-benefits.md
```

### Deducciones (fila 2)
```
= TOTAL Beneficios Deducciones Columna 3 de 13-benefits.md
  + TOTAL Impuestos Empleado Columna 4 de 14-taxes-contributions.md
```

Incluye: SS empleado, IRPF, IRPF EXTRA, etc.

### Neto (fila 3)
```
= Bruto - Deducciones
```

### Prorrata Extras (fila 4)
```
= ((Sueldo Base + Antiguedad + PLUS Convenio + PLUS Voluntario + Pacto no competencia + Dedicación plena Columna 3 de 12-salary-base.md) × Pagas Extra) / 12
```

Usa "Pagas Extra" de feature 11-employee-data.md

Validaciones:
- Si Pagas Extra = 0 → Prorrata = 0 (no mostrar error)
- Si Pagas Extra > 0 → distribuye proporcionalmente a los 12 meses

## Comportamiento UI
- Solo lectura (no editable)
- Formato moneda con 2 decimales
- Orden vertical: Bruto → Deducciones → Neto → Prorrata
- Visualmente diferenciado (Neto destacado)

## Dependencias de salida
- **Bruto** → usado en acumulados 16-accumulated.md y resumen anual
- **Neto** → mostrado al usuario como "recibido"
- **Neto** → base para cálculos de resumen en 23-annual-income-summary.md
- **Prorrata Extras** → alimenta Base en 14-taxes-contributions.md

## Casos borde
1. Si Bruto < 0 (caso muy raro) → mostrar advertencia
2. Si Deducciones > Bruto → Neto negativo (válido en casos especiales)
3. Si Pagas Extra = 0 → Prorrata = 0, sin error
