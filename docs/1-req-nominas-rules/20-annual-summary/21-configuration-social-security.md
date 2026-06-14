# Feature: Configuración - Seguridad Social

## Ubicación
Card "Seguridad Social" en colapsable "CONFIGURACION RENTA" (después de Extra2).

## Propósito
Configurar y mantener los porcentajes de cotización a Seguridad Social para empleado y empresa.

## Tabla "Seguridad Social"

Tabla con 3 columnas: Concepto | Empleado (%) | Empresa (%)

### Filas fijas

| # | Concepto | Columna 2: EMPLEADO | Columna 3: EMPRESA |
|----|----------|-------------------|------------------|
| 1 | Desempleo | editable (1,55%) | editable (5,50%) |
| 2 | Formación Profesional | editable (0,10%) | editable (0,60%) |
| 3 | Contingencias Comunes | editable (4,7%) | editable (23,60%) |
| 4 | MEI | editable (0,15%) | editable (0,75%) |
| 5 | FOGASA | editable (0%) | editable (0,20%) |
| 6 | AT/EP | editable (0%) | editable (1,50%) |
| 7 | **TOTAL** | automático | automático |

## Fórmulas

### TOTAL (fila 7, cualquier columna)
```
= Σ(Columna N, filas 1-6)
```

## Valores por defecto (España 2026)
**Empleado:**
- Desempleo: 1,55%
- Formación Profesional: 0,10%
- Contingencias Comunes: 4,7%
- MEI: 0,15%
- FOGASA: 0%
- AT/EP: 0%

**Empresa:**
- Desempleo: 5,50%
- Formación Profesional: 0,60%
- Contingencias Comunes: 23,60%
- MEI: 0,75%
- FOGASA: 0,20%
- AT/EP: 1,50%

## Comportamiento UI
- Todas las filas (excepto TOTAL) son editables
- TOTAL (fila 7) es automático y no editable
- Formato porcentaje (%)
- Campos numéricos con validación 0-100%
- Cambios se aplican a todos los meses (sincronización)

## Comportamiento importante
Estos porcentajes **alimentan todas las nóminas mensuales**. Específicamente:
- Columna 2 (EMPLEADO) → tabla 14-taxes-contributions.md Columna 3 % EMPLEADOS
- Columna 3 (EMPRESA) → tabla 14-taxes-contributions.md Columna 5 % EMPRESA

Si se cambian aquí, todas las nóminas mensuales se recalculan automáticamente.

## Dependencias de entrada
- Valores por defecto de legislación española

## Dependencias de salida
- % EMPLEADO → usado en todas las nóminas mensuales (14-taxes-contributions.md)
- % EMPRESA → usado en todas las nóminas mensuales (14-taxes-contributions.md)
- TOTAL EMPLEADO → referencia en 25-contribution-base.md
- TOTAL EMPRESA → referencia en 25-contribution-base.md

## Casos borde
1. Cambio de legislación (cambio de año o reforma) → actualizar valores
2. Empleado en situación especial (baja, jubilación, etc) → crear nueva fila dinámica
3. % = 0 en algún concepto → válido, cotización = 0 para ese concepto
