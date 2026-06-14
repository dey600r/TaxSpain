# Feature: Base de cotización

## Ubicación
Card "Base de Cotización" en colapsable "RENTA" (después de Extra2).

## Propósito
Consolidar la base final sobre la que se calcula el IRPF definitivo anual.

## Tabla "Base de Cotización"

Tabla con 3 columnas: Concepto | Importe Total | Importe Pagado

### Filas fijas

| # | Concepto | Columna 2: Total | Columna 3: Pagado |
|----|----------|-----------------|-----------------|
| 1 | Rendimiento Trabajo | editable (2000) | no editable |
| 2 | SS Empleado | automático | automático |
| 3 | SS Empresa | automático | no editable |
| 4 | **TOTAL** | automático | automático |
| 5 | **BASE IRPF** | automático | automático |

## Fórmulas

### Rendimiento Trabajo (fila 1)
**Columna 2 (Total):**
```
= Editable, valor por defecto 2000
```

Puede ajustarse si hay ingresos extra profesionales.

**Columna 3 (Pagado):**
```
= Mismo valor que Columna 2
```

### SS Empleado (fila 2)
**Columna 2 (Total)**
```
= (TOTAL de 23-annual-income-summary.md × TOTAL % EMPLEADO de 21-configuration-social-security.md)
```

**Columna 3 (Pagado)**
```
= Cotización SS Empleado Total (Col3, Extra2) de 16-accumulated.md
```

### SS Empresa (fila 3)
**Columna 2 (Total)**
```
= (TOTAL de 23-annual-income-summary.md × TOTAL % EMPRESA de 21-configuration-social-security.md)
```

**Columna 3 (Pagado)**
```
= Cotización SS Empresa Total (Col3, Extra2) de 16-accumulated.md
```

### TOTAL (fila 4)
**Columna 2 (Total)**
```
= Rendimiento Trabajo + SS Empleado
```

Solo suma filas 1 y 2 (NO incluye SS Empresa).

**Columna 3 (Pagado)**
```
= Rendimiento Trabajo + SS Empleado (Pagado)
```

### BASE IRPF (fila 5)
**Columna 2 (Total)**
```
= TOTAL de 23-annual-income-summary.md - TOTAL (fila 4, Col2)
```

**Columna 3 (Pagado)**
```
= TOTAL de 23-annual-income-summary.md - TOTAL (fila 4, Col3)
```

## Comportamiento UI
- Columna 2: Rendimiento Trabajo editable, resto automático
- Columna 3: solo lectura (referencial)
- Formato moneda con 2 decimales
- BASE IRPF es crucial para cálculo IRPF final (26)

## Dependencias de entrada
- **TOTAL** de 23-annual-income-summary.md
- **TOTAL % EMPLEADO** de 21-configuration-social-security.md
- **TOTAL % EMPRESA** de 21-configuration-social-security.md
- **Cotización SS Empleado Total (Extra2)** de 16-accumulated.md
- **Cotización SS Empresa Total (Extra2)** de 16-accumulated.md

## Dependencias de salida
- **BASE IRPF (fila 5, Col2)** → usado en 22-configuration-irpf-brackets.md (cálculo de impuestos por tramo)
- **BASE IRPF (fila 5, Col3)** → usado en 26-final-tax-calculation.md (validación)

## Casos borde
1. Rendimiento Trabajo = 0 → BASE IRPF = TOTAL - SS Empleado
2. SS Empleado = 0 (sin cotización) → BASE IRPF = TOTAL - Rendimiento
3. BASE IRPF negativo (muy raro) → mostrar advertencia
4. Cambio de SS % → recalcula automáticamente
