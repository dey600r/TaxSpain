# Feature: Beneficios

## Ubicación
Tabla dentro de Card "NOMINA" en cada mes.

## Propósito
Capturar beneficios (seguro, tickets, etc.) y calcular deducciones netas.

## Tabla "BENEFICIOS"

Tabla con 3 columnas: Concepto | Devengos (editable) | Deducciones (automático)

### Filas fijas

| # | Concepto | Columna 2: Devengos | Columna 3: Deducciones |
|----|----------|-------------------|----------------------|
| 1 | Seguro Médico | **Editable**: -41,67 | (Col2 × % Deducible) / 100 |
| 2 | Tickets | **Editable**: 48 | Mismo que Col2 |
| 3 | Seguro Vida | **Editable**: 7,78 | Mismo que Col2 |
| N | Filas adicionales | **Editable**: decimal | Mismo que Col2 |
| X | **TOTAL** (footer fijo) | Σ(Col2) | Σ(Col3) |

### Fórmulas

**Seguro Médico (fila 1, Columna 3)**
```
= (Devengos Columna 2 × % Deducible Seguro Médico) / 100
```
- Usa "Devengos" de fila 1, Columna 2
- Usa "% Deducible Seguro Médico" de feature 11-employee-data.md

**Tickets (fila 2, Columna 3)**
```
= Devengos (Columna 2)
```

**Seguro Vida y resto (filas N, Columna 3)**
```
= Devengos (Columna 2)
```

**TOTAL (footer, Columna 2)**
```
= Σ(Columna 2, filas 1 a N)
```

**TOTAL (footer, Columna 3)**
```
= Σ(Columna 3, filas 1 a N)
```

## Comportamiento UI
- Columna 1 (Concepto): no editable
- Columna 2 (Devengos): editable
- Columna 3 (Deducciones): no editable, calcula automáticamente
- Scroll si muchas filas; cuerpo de tabla con altura fija
- Footer anclado abajo
- Botón "+" para filas dinámicas
- Nombre de concepto en filas dinámicas es editable

## Validaciones
- Devengos: admite negativos (ej: seguro médico -41,67)
- % Deducible: rango 0-100

## Dependencias de salida
- **TOTAL Columna 2** → suma a Bruto en 15-monthly-summary.md
- **TOTAL Columna 3** → suma a Deducciones en 15-monthly-summary.md
- **Seguro Médico Columna 2** → afecta Base Impuestos en 14-taxes-contributions.md
- **Seguro Médico Columna 3** → se sustrae de Base SS en 14-taxes-contributions.md

## Casos borde
1. Devengos negativo (ej: -41,67) → deducción es también negativa o se trata según lógica
2. % Deducible = 0 → Seguro Médico deducción = 0
3. Múltiples filas dinámicas → scroll debe mantener footer visible
