# Feature: Datos empleado

## Ubicación
Card independiente en cada mes (Enero ... Diciembre, Extra1, Extra2).

## Propósito
Capturar parámetros base del empleado que afectan cálculos de nómina.

## Card "DATOS EMPLEADO"

Panel con inputs que deben tener el label dentro del input. Los inputs deben estar colocados en columnas y no en vertical.

### Campos

| # | Label | Tipo | Default | Placeholder | Descripción |
|----|-------|------|---------|-------------|-------------|
| 1 | Nombre | Texto | vacío | John Doe | Identificación empleado |
| 2 | Nº Empleado | Número | vacío | 123456 | ID interno |
| 3 | Nº Días | Número | 30 | — | Días laborales del mes; ajustar si: febrero, cambios CCAA, altas/bajas |
| 4 | Pagas Extra | Número | 2 | — | Total de pagas extra en año. Afecta prorrata |
| 5 | Horas Extra | Número | 0 | — | Horas extras del mes (no usado en esta versión) |
| 6 | % Deducible Seguro Médico | Decimal | vacío | 0 | Porcentaje del seguro que es deducible |
| 7 | Trienios | Número | vacío | 1 | Antigüedad en trienios; afecta cálculo de antiguedad |

## Dependencias de salida
- **Nº Días** → multiplica todos los devengos en 12-salary-base.md
- **Trienios** → alimenta fórmula de antiguedad en 12-salary-base.md
- **% Deducible Seguro** → multiplica deducción en 13-benefits.md
- **Pagas Extra** → alimenta prorrata en 15-monthly-summary.md

## Casos borde
1. Nº Días = 0 → evitar división por cero; mostrar error de entrada
2. Nº Días ≠ 30 → prorratas deben recalcularse (febrero, cambios de CCAA)
3. Pagas Extra = 0 → prorrata = 0
4. Trienios = 0 → antiguedad = 0 (válido, empleado nuevo)

## Validaciones
- Nº Días: rango 1-31
- Pagas Extra: rango 0-14
- Trienios: rango 0-99
- % Deducible: rango 0-100
- Nombre: texto no vacío (opcional)
- Nº Empleado: número válido (opcional)
