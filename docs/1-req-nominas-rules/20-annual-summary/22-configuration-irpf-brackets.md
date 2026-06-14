# Feature: Configuración - Tramos IRPF

## Ubicación
Cards "IRPF ESTATAL" e "IRPF AUTONOMICO" en colapsable "CONFIGURACION RENTA" (después de Extra2).

## Propósito
Configurar y mantener los tramos de IRPF para gobierno central (estatal) y autonómico.

## TABLA "IRPF ESTATAL"

Tabla con 4 columnas: Inicio | Fin | % | Impuestos

### Filas fijas

| # | Inicio | Fin | % | Impuestos |
|----|--------|-----|---|-----------|
| 1 | editable (0) | editable (12.449,99) | editable (9,5%) | automático |
| 2 | editable (12.450) | editable (20.199,99) | editable (12,00%) | automático |
| 3 | editable (20.200) | editable (35.199,99) | editable (15,00%) | automático |
| 4 | editable (35.200) | editable (59.999,99) | editable (18,50%) | automático |
| 5 | editable (60.000) | editable (299.999,99) | editable (22,50%) | automático |
| 6 | editable (300.000) | NO editable (null) | editable (24,50%) | automático |
| 7 | TOTAL | NO editable (null) | NO editable (null) | automático |

### Fórmulas - Impuestos (Columna 4)

Para cada fila (1-6):
```
Si Base IRPF (de 25-contribution-base.md) está en rango [Inicio, Fin]:
  = (Parte de Base en rango × % tramo) / 100
Si no está en rango:
  = 0
```

Más precisamente:
```
Impuesto fila N = ((MIN(Base IRPF, Fin N) - MAX(0, Inicio N - Base IRPF acumulada)) × % N) / 100
```

O simplificado (cálculo por exceso):
```
Fila 1: ((Base - 0) - (Base - 12.449,99)) × 9,5% / 100 = (Si Base <= 12.449,99: Base × 9,5%; si no: 12.449,99 × 9,5%)
Fila 2: ((Base - 12.450) - (Base - 20.199,99)) × 12% / 100 = (Si Base entre 12.450 y 20.199,99: (Base - 12.450) × 12%)
...
```

**TOTAL (fila 7)**
```
= Σ(Impuestos, filas 1-6)
```

## TABLA "IRPF AUTONOMICO"

Estructura idéntica a IRPF ESTATAL.

### Filas fijas (valores por defecto para Comunidad Valenciana)

| # | Inicio | Fin | % | Impuestos |
|----|--------|-----|---|-----------|
| 1 | editable (0) | editable (12.449,99) | editable (9,5%) | automático |
| 2 | editable (12.450) | editable (20.199,99) | editable (12,00%) | automático |
| 3 | editable (20.200) | editable (35.199,99) | editable (15,00%) | automático |
| 4 | editable (35.200) | editable (59.999,99) | editable (18,50%) | automático |
| 5 | editable (60.000) | editable (299.999,99) | editable (22,50%) | automático |
| 6 | editable (300.000) | NO editable (null) | editable (24,50%) | automático |
| 7 | TOTAL | NO editable (null) | NO editable (null) | automático |

## Valores por defecto (España 2026 - Estatal)

Estos son los tramos fiscales estatales oficiales. Pueden variar por Comunidad Autónoma en la tabla IRPF AUTONOMICO.

| Tramo | Inicio | Fin | % |
|-------|--------|-----|---|
| 1 | 0 | 12.449,99 | 9,5% |
| 2 | 12.450 | 20.199,99 | 12,00% |
| 3 | 20.200 | 35.199,99 | 15,00% |
| 4 | 35.200 | 59.999,99 | 18,50% |
| 5 | 60.000 | 299.999,99 | 22,50% |
| 6 | >= 300.000 | — | 24,50% |

## Comportamiento UI
- Columnas 1-3: editables
- Columna 4 (Impuestos): no editable, calcula automáticamente
- Fin de último tramo (fila 6) es null (sin límite superior)
- TOTAL (fila 7) suma automáticamente
- Cambios se aplican al resumen anual (26-final-tax-calculation.md)

## Dependencias de entrada
- Base IRPF de 25-contribution-base.md

## Dependencias de salida
- TOTAL Impuestos Estatal → usado en 24-tax-exemptions.md y 26-final-tax-calculation.md
- TOTAL Impuestos Autonómico → usado en 24-tax-exemptions.md y 26-final-tax-calculation.md

## Casos borde
1. Base IRPF = 0 → todos Impuestos = 0
2. Base IRPF < 1.200 → probablemente exento (validar con 24-tax-exemptions.md)
3. Base IRPF muy alta → aplican múltiples tramos (sumatorio correcto)
4. Cambio de región → cambiar porcentajes de tabla IRPF AUTONOMICO
