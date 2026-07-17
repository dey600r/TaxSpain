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
| 2 | **automático** (Fin fila 1 + 0,01) | editable (20.199,99) | editable (12,00%) | automático |
| 3 | **automático** (Fin fila 2 + 0,01) | editable (35.199,99) | editable (15,00%) | automático |
| 4 | **automático** (Fin fila 3 + 0,01) | editable (59.999,99) | editable (18,50%) | automático |
| 5 | **automático** (Fin fila 4 + 0,01) | editable (299.999,99) | editable (22,50%) | automático |
| 6 | **automático** (Fin fila 5 + 0,01) | NO editable (null) | editable (24,50%) | automático |
| 7 | TOTAL | NO editable (null) | NO editable (null) | automático |

### Fórmulas - Inicio (Columna 1)

- Fila 1: editable por el usuario (valor inicial del primer tramo, normalmente 0).
- Filas 2–6: **no editable**, se autocalcula como:
  ```
  Inicio fila N = Fin fila (N-1) + 0,01
  ```

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
| 2 | **automático** (Fin fila 1 + 0,01) | editable (20.199,99) | editable (12,00%) | automático |
| 3 | **automático** (Fin fila 2 + 0,01) | editable (35.199,99) | editable (15,00%) | automático |
| 4 | **automático** (Fin fila 3 + 0,01) | editable (59.999,99) | editable (18,50%) | automático |
| 5 | **automático** (Fin fila 4 + 0,01) | editable (299.999,99) | editable (22,50%) | automático |
| 6 | **automático** (Fin fila 5 + 0,01) | NO editable (null) | editable (24,50%) | automático |
| 7 | TOTAL | NO editable (null) | NO editable (null) | automático |

### Fórmula - Inicio (Columna 1)

- Fila 1: editable por el usuario.
- Filas 2–6: **no editable**, se autocalcula como:
  ```
  Inicio fila N = Fin fila (N-1) + 0,01
  ```

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
- Columna 1 (Inicio): editable solo en fila 1; filas 2–6 son no editables y se autocalculan como Fin fila anterior + 0,01
- Columnas 2-3 (Fin y %): editables
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
