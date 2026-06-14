# Feature: Seguridad Social e impuestos

## Ubicación
Tabla dentro de Card "NOMINA" en cada mes.

## Propósito
Calcular cotizaciones SS (empleado/empresa) e IRPF retenido.

## Tabla "IMPUESTOS"

Tabla con 6 columnas: Concepto | Base | % Empleado | Deducción Empleado | % Empresa | Empresa

### Filas fijas (Seguridad Social)

| Concepto | Col2: Base | Col3: % Empl. | Col4: Deducción Empl. | Col5: % Empresa | Col6: Empresa |
|----------|-----------|---|---|---|---|
| Desempleo | automático | editable | automático | editable | automático |
| Formación Profesional | automático | editable | automático | editable | automático |
| Contingencias Comunes | automático | editable | automático | editable | automático |
| MEI | automático | editable | automático | editable | automático |
| FOGASA | automático | editable | automático | editable | automático |
| AT/EP | automático | editable | automático | editable | automático |

### Filas fijas (IRPF)

| Concepto | Col2: Base | Col3: % Empl. | Col4: Deducción Empl. | Col5: % Empresa | Col6: Empresa |
|----------|-----------|---|---|---|---|
| IRPF | automático | **editable (default 22,22%)** | automático | vacío (no editable) | vacío (no editable) |
| IRPF EXTRA | automático | **editable (default 0%)** | automático | vacío (no editable) | vacío (no editable) |
| **TOTAL** | — | Σ(Col3) | Σ(Col4) | Σ(Col5) | Σ(Col6) |

## Fórmulas

### Base (Columna 2)

**Para SS (Desempleo hasta AT/EP) y IRPF**
```
= (TOTAL Salario Base Col3 de 12-salary-base.md
   + TOTAL Beneficios Col2 de 13-benefits.md)
  - Seguro Médico (Beneficios Col2 de 13-benefits.md)
  + Prorrata Extras (de 15-monthly-summary.md Col2 fila 4)
```

Validaciones:
- Si resultado < 0 → usar 0
- Aplicable a todas las filas SS e IRPF

**Para IRPF solo (fila IRPF)**
```
= (TOTAL Salario Base Col3 de 12-salary-base.md
   + Seguro Médico Col2 de 13-benefits.md)
```

Nota: Incluye seguro médico (a diferencia de SS).

### Deducción Empleado (Columna 4)

```
= (Base Columna 2 × % Empleado Columna 3) / 100
```

Validaciones:
- Redondear a 2 decimales
- Si Base = 0 → Deducción = 0

### Empresa (Columna 6)

```
= (Base Columna 2 × % Empresa Columna 5) / 100
```

## Parámetros por defecto
- Los porcentajes SS (Col3 y Col5) vienen de feature 21-configuration-social-security.md
- IRPF default: 22,22% (editable en cada mes)
- IRPF EXTRA default: 0% (editable en cada mes)
- El usuario puede hacer override en esta tabla si es necesario

## Comportamiento UI
- **Base (Col2)**: no editable
- **% Empleado (Col3)**: editable para todas las filas
- **Deducción Empleado (Col4)**: no editable
- **% Empresa (Col5)**: editable para SS, no editable para IRPF
- **Empresa (Col6)**: no editable
- Footer con TOTAL de cada columna

## Dependencias de salida
- **TOTAL Columna 4** → suma a Deducciones en 15-monthly-summary.md
- **TOTAL Columna 6** → suma a SS Empresa en 16-accumulated.md
- **IRPF Columna 2 (Base)** → usado en 16-accumulated.md (Imponible IRPF)
- **IRPF Columna 4 (Deducción)** → usado en 16-accumulated.md (Retenciones IRPF)
- **IRPF EXTRA Columna 4** → usado en cálculo de Cotización SS Empleado en 16-accumulated.md

## Casos borde
1. Base = 0 → todas las deducciones = 0
2. % = 0 → deducción = 0
3. División por cero (#DIV/0) → mostrar 0 en UI, nunca error
4. IRPF % puede ser 0 en meses intermedios (si el % anual se reparte diferente)
5. IRPF EXTRA suele ser 0 excepto en Extra1 y Extra2
