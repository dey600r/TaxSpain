# Feature: Acumulados mensuales

## Ubicación
Card "ACUMULADO" en cada mes.

## Propósito
Mostrar acumulado mes a mes de impuestos, cotizaciones y recibido.

## Tabla "ACUMULADO"

Tabla con 3 columnas: Concepto | Cálculos (este mes) | Total (acumulado hasta este mes)

| Concepto | Col2: Cálculos | Col3: Total |
|----------|---|---|
| Imponible IRPF | valor de 14-taxes-contributions.md | suma acumulada |
| Retenciones IRPF | valor de 14-taxes-contributions.md | suma acumulada |
| Cotización SS Empleado | cálculo | suma acumulada |
| Cotización SS Empresa | valor de 14-taxes-contributions.md | suma acumulada |
| Recibido | valor de 15-monthly-summary.md | suma acumulada |

## Fórmulas

### Imponible IRPF (Columna 2, fila 1)
```
= Base IRPF de 14-taxes-contributions.md (Columna 2, fila IRPF)
```

### Retenciones IRPF (Columna 2, fila 2)
```
= Deducción Empleado IRPF de 14-taxes-contributions.md (Columna 4, fila IRPF)
```

### Cotización SS Empleado (Columna 2, fila 3)
```
= TOTAL Impuestos Columna 4 de 14-taxes-contributions.md
  - Deducción IRPF
```

Solo SS, excluye IRPF.

### Cotización SS Empresa (Columna 2, fila 4)
```
= TOTAL Empresa de 14-taxes-contributions.md (Columna 6, TOTAL row)
```

### Recibido (Columna 2, fila 5)
```
= Neto de 15-monthly-summary.md (fila 3)
```

### Acumulado (Columna 3) para cualquier concepto

**Si es Enero:**
```
= Cálculos (Columna 2)
```

**Si es otro mes:**
```
= Cálculos (Columna 2) + Columna 3 del mes anterior
```

Ejemplo:
- Enero Col3 = Enero Col2
- Febrero Col3 = Febrero Col2 + Enero Col3
- Marzo Col3 = Marzo Col2 + Febrero Col3

**Meses especiales:**
- Extra1 → acumula después de Junio
- Extra2 → acumula después de Diciembre

## Comportamiento UI
- Solo lectura
- Formato moneda con 2 decimales
- Enero: Columna 3 = Columna 2 (no hay mes anterior)
- Mostrar claramente el acumulado anual en Extra2 Col3 (será referencia para resumen anual)

## Dependencias de salida
- **Cotización SS Empresa Total (Extra2 Col3)** → usado en 25-contribution-base.md
- **Recibido Total (Extra2 Col3)** → base para 23-annual-income-summary.md
- **Imponible IRPF Total (Extra2 Col3)** → referencia para cálculos anuales
- **Retenciones IRPF Total (Extra2 Col3)** → comparar contra IRPF necesario

## Casos borde
1. Enero → no hay mes anterior, Col3 copia Col2
2. Extra1 (mes 7) → acumula después de Junio (mes 6)
3. Extra2 (mes 14) → acumula después de Diciembre (mes 13)
4. Cambio de mes → acumulado solo se recalcula si cambia el mes anterior
