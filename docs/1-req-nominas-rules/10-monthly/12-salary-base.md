# Feature: Salario base

## Ubicación
Tabla dentro de Card "NOMINA" en cada mes.

## Propósito
Capturar conceptos de salario y calcular devengos mensuales (dinero que se gana bruto).

## Tabla "SALARIO BASE"

Tabla con 3 columnas: Concepto (fijo) | Precio/Hora (editable) | Devengos (automático)

### Filas fijas

| # | Concepto | Columna 2: Precio/Hora | Columna 3: Devengos |
|----|----------|----------------------|------------------|
| 1 | Sueldo Base | **Editable**: decimal | Nº Días × Col2 |
| 2 | Antiguedad | **NO editable**: cálculo automático | Nº Días × Col2 |
| 3 | PLUS Convenio | **Editable**: decimal | Nº Días × Col2 |
| 4 | PLUS Voluntario | **Editable**: decimal | Nº Días × Col2 |
| 5 | Pacto no competencia | **Editable**: decimal | Nº Días × Col2 |
| 6 | Dedicación plena | **Editable**: decimal | Nº Días × Col2 |
| N | Filas adicionales (dinámicas) | **Editable**: decimal | Nº Días × Col2 |
| X | **TOTAL** (footer fijo) | Σ(Col2) | Σ(Col3) |

### Fórmulas

**Antiguedad (fila 2, Columna 2)**
```
= (Sueldo Base / 20) × Trienios
```
- Usa "Sueldo Base" de fila 1, Columna 2
- Usa "Trienios" de feature 11-employee-data.md
- Si Sueldo Base = 0 → Antiguedad = 0
- Si Trienios = 0 → Antiguedad = 0

**Devengos (cualquier fila, Columna 3)**
```
= Nº Días × Precio/Hora (Col2)
```
- Usa "Nº Días" de feature 11-employee-data.md

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
- Columna 2 (Precio/Hora): editable excepto fila 2 (Antiguedad)
- Columna 3 (Devengos): no editable, calcula automáticamente
- Tabla con scroll horizontal si muchas filas
- Footer anclado siempre visible abajo
- Botón "+" para añadir fila dinámicamente
- En filas dinámicas, nombre de concepto es editable

## Dependencias de salida
- **TOTAL Columna 3** → alimenta Bruto en 15-monthly-summary.md
- **TOTAL Columna 3** → alimenta Base Impuestos en 14-taxes-contributions.md
- **Columna 3 de Sueldo Base, Antiguedad, PLUS Convenio, PLUS Voluntario, Pacto no competencia y Dedicación plena** → alimenta Prorrata Extras en 15-monthly-summary.md

## Casos borde
1. Sueldo Base = 0 → Antiguedad = 0; Bruto = suma del resto
2. Nº Días = 0 → todos Devengos = 0; TOTAL = 0
3. Trienios = 0 → Antiguedad = 0 (válido)
4. Filas dinámicas > 10 → scroll debe funcionar correctamente
5. Valores negativos en filas dinámicas → permitidos si usuario lo introduce
