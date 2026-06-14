# Feature: Exención de impuestos

## Ubicación
Card "Exención de impuestos" en colapsable "RENTA" (después de Extra2).

## Propósito
Calcular desgravaciones permitidas (mínimo personal, descendientes, etc) que reducen la base imponible de IRPF.

## Tabla "Exención de impuestos"

Tabla con 3 columnas: Concepto | Importe Estatal | Importe Autonómico

### Filas fijas

| # | Concepto | Columna 2: Estatal | Columna 3: Autonómico |
|----|----------|------------------|----------------------|
| 1 | Mínimo personal | editable (5.550) | editable (5.956,65) |
| 2 | Descendientes | editable (0) | editable (0) |
| 3 | Ascendientes | editable (0) | editable (0) |
| 4 | Minusvalías | editable (0) | editable (0) |
| 5 | **TOTAL** | automático | automático |
| 6 | **IMPUESTOS** | automático | automático |

## Fórmulas

### TOTAL (fila 5)
```
= Σ(Columna N, filas 1-4)
```

### IMPUESTOS (fila 6)
**Estatal (Columna 2)**
```
= TOTAL (fila 5, Col2) × % del primer tramo IRPF ESTATAL (de 22-configuration-irpf-brackets.md)
```

**Autonómico (Columna 3)**
```
= TOTAL (fila 5, Col3) × % del primer tramo IRPF AUTONOMICO (de 22-configuration-irpf-brackets.md)
```

## Valores por defecto (España 2026)

**Estatal:**
- Mínimo personal: 5.550 €
- Descendientes: 0 € (editable según número de hijos)
- Ascendientes: 0 € (editable si los mantiene)
- Minusvalías: 0 € (editable si aplica)

**Autonómico (ej: Comunidad Valenciana):**
- Mínimo personal: 5.956,65 €
- Descendientes: 0 €
- Ascendientes: 0 €
- Minusvalías: 0 €

## Comportamiento UI
- Filas 1-4 (conceptos): editables
- Fila 5 (TOTAL): no editable, suma automática
- Fila 6 (IMPUESTOS): no editable, cálculo automático
- Formato moneda con 2 decimales
- Permite agregar dinámicamente nuevas desgravaciones

## Dependencias de entrada
- **% primer tramo IRPF** de 22-configuration-irpf-brackets.md
- **TOTAL** de 23-annual-income-summary.md (referencia para contexto)

## Dependencias de salida
- **IMPUESTOS Estatal (fila 6, Col2)** → usado en 26-final-tax-calculation.md
- **IMPUESTOS Autonómico (fila 6, Col3)** → usado en 26-final-tax-calculation.md
- **TOTAL Estatal y Autonómico** → reduce base imponible

## Casos borde
1. Mínimo personal = 0 → IRPF mínimo exento también = 0
2. Descendientes muy alto → usuario introduce cantidad manualmente
3. Combinación de desgravaciones → suma correctamente en TOTAL
4. IRPF máximo exento > Base IRPF → cero impuestos (después validar en 26)
