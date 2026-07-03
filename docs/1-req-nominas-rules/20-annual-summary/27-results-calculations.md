# Feature: BORRADOR RENTA

## Ubicación
Card "Borrador Renta" en colapsable "RENTA" (después de Extra2).

## Propósito
Calcular un borrador de la renta final con los datos de introducidos en las mensualidades y los tramos de IRPF.

## Tabla "Borrador Renta"

Tabla con 4 columnas: Concepto | PAGADO € | PAGADO % | BORRADOR €

### Filas fijas

| # | Concepto | Col2: PAGADO € | Col3: PAGADO % | Col4: BORRADOR € |
|---|----------|----------------|----------------|----------------- |
| 1 | Retención IRPF | automático | automático | automático |
| 2 | Retención Capital | automático | automático | automático |
| 3 | **CUOTAS LIQUIDAS** | automático | automático | automático |
| 4 | SS Empleado | automático | automático | automático |
| 5 | SS Empresa | automático | automático | automático |
| 6 | TOTAL | automático | automático | automático |

## Fórmulas

### Retención IRPF (fila 1)

**PAGADO € (Columna 2)**
```
= TOTAL Retenciones IRPF ACUMULADO (fila 2, Col3 de 16-accumulated.md)
```

**PAGADO % (Columna 3)**
```
= (Borrador Renta PAGADO € fila 1 / TOTAL RESUMEN NOMINAS (fila 3 col 2 en 23-annual-income-summary.md)) × 100
```

Validación: dividir por 0 → mostrar 0%.

**BORRADOR € (Columna 4)**
```
= TOTAL Cuotas Liquidas IRPF NECESARIO (fila 3, Col6 de 26-final-tax-calculation.md)
  - Borrador renta PAGADO € fila 1
```

### Retención Capital (fila 2)

**PAGADO € (Columna 2)**
```
= 0 (no implementado en esta versión)
```

**PAGADO % (Columna 3)**
```
= (Borrador Renta PAGADO € fila 2 / TOTAL RESUMEN NOMINAS (fila 3 col 2 en 23-annual-income-summary.md)) × 100
```

Validación: dividir por 0 → mostrar 0%.

**BORRADOR € (Columna 4)**
```
= TOTAL Retencion del capital IRPF NECESARIO (fila 2, Col6 de 26-final-tax-calculation.md)
  - Borrador renta PAGADO € fila 2
```

### CUOTAS LIQUIDAS (fila 3)

**PAGADO € (Columna 2)**
```
= PAGADO € fila 1 + PAGADO € fila 2
```

**PAGADO % (Columna 3)**
```
= (Borrador Renta PAGADO € fila 3 / TOTAL RESUMEN NOMINAS (fila 3 col 2 en 23-annual-income-summary.md)) × 100
```

Validación: dividir por 0 → mostrar 0%.

**BORRADOR € (Columna 4)**
```
= BORRADOR € fila 1 + BORRADOR € fila 2
```

**Comparación con Retenciones Pagadas**
```
Si Diferencia > 0: Usuario debe pagar -> Colorear los numeros en rojo
Si Diferencia < 0: Administración devuelve -> Colorear los numeros en verde
Si Diferencia ≈ 0: Compensado -> Colorear los numeros en verde
```

### SS Empleado (fila 4)

**PAGADO € (Columna 2)**
```
= SS Empleado Pagado Base de cotizacion (Columna 3 fila 2 en 25-contribution-base.md)
```

**PAGADO % (Columna 3)**
```
= (Borrador Renta PAGADO € fila 4 / TOTAL RESUMEN NOMINAS (fila 3 col 2 en 23-annual-income-summary.md)) × 100
```

Validación: dividir por 0 → mostrar 0%.

**BORRADOR € (Columna 4)**
```
= SS Empleado Total Base de cotizacion (Columna 2 fila 2 en 25-contribution-base.md)
  - Borrador renta PAGADO € fila 4
```

**Comparación con Retenciones Pagadas**
```
Si Diferencia > 0: Usuario debe pagar -> Colorear los numeros en rojo
Si Diferencia < 0: Administración devuelve -> Colorear los numeros en verde
Si Diferencia ≈ 0: Compensado -> Colorear los numeros en verde
```

### SS Empresa (fila 5)

**PAGADO € (Columna 2)**
```
= SS Empresa Pagado Base de cotizacion (Columna 3 fila 3 en 25-contribution-base.md)
```

**PAGADO % (Columna 3)**
```
= (Borrador Renta PAGADO € fila 5 / TOTAL RESUMEN NOMINAS (fila 3 col 2 en 23-annual-income-summary.md)) × 100
```

Validación: dividir por 0 → mostrar 0%.

**BORRADOR € (Columna 4)**
```
= SS Empresa Total Base de cotizacion (Columna 2 fila 3 en 25-contribution-base.md)
  - Borrador renta PAGADO € fila 5
```

### TOTAL (fila 6)

Fila de consolidado final del borrador renta. Resume el resultado conjunto de CUOTAS LIQUIDAS, SS Empleado y SS Empresa.

**PAGADO € (Columna 2)**
```
= CUOTAS LIQUIDAS COLUMNA 2 PAGADO € + SS EMPLEADO COLUMNA 2 PAGADO € + SS EMPRESA COLUMNA 2 PAGADO €
```

**PAGADO % (Columna 3)**
```
= CUOTAS LIQUIDAS COLUMNA 3 PAGADO % + SS EMPLEADO COLUMNA 3 PAGADO % + SS EMPRESA COLUMNA 3 PAGADO %
```

**BORRADOR € (Columna 4)**
```
= CUOTAS LIQUIDAS COLUMNA 4 BORRADOR € + SS EMPLEADO COLUMNA 4 BORRADOR € + SS EMPRESA COLUMNA 4 BORRADOR €
```

Validación: si algún valor origen no existe, tratarlo como 0 para mantener la suma consistente.

**Comparación con Retenciones Pagadas**
```
Si Diferencia > 0: Usuario debe pagar -> Colorear los numeros en rojo
Si Diferencia < 0: Administración devuelve -> Colorear los numeros en verde
Si Diferencia ≈ 0: Compensado -> Colorear los numeros en verde
```

## Comportamiento UI
- Todas las filas y columnas: solo lectura
- Formato moneda (€) con 2 decimales
- Formato porcentaje (%) con 2 decimales
- Mostrar claramente la diferencia: CUOTAS LIQUIDAS vs Retenciones Pagadas
- Si es diferencia > 0: color rojo (cantidad a pagar)
- Si es diferencia < 0: color verde (devolución)

## Dependencias de entrada
- **Retenciones IRPF pagadas acumuladas** en mensualidades: 16-accumulated.md (fila Retenciones IRPF, total anual en Extra2 Col3)
- **TOTAL Resumen de nominas**: 23-annual-income-summary.md (fila 3, Col2)
- **Cuotas liquidas necesarias**: 26-final-tax-calculation.md (fila 3, Col6)
- **Retención capital necesaria**: 26-final-tax-calculation.md (fila 2, Col6)
- **SS Empleado Total** (Col2, fila 2): 25-contribution-base.md
- **SS Empleado Pagado** (Col3, fila 2): 25-contribution-base.md
- **SS Empresa Total** (Col2, fila 3): 25-contribution-base.md
- **SS Empresa Pagado** (Col3, fila 3): 25-contribution-base.md
- **Sumatorios internos para TOTAL (fila 6)**: valores calculados en esta misma tabla para filas 3 (CUOTAS LIQUIDAS), 4 (SS Empleado) y 5 (SS Empresa), columnas 2, 3 y 4

## Dependencias de salida
- **Diferencia final (BORRADOR € en CUOTAS LIQUIDAS)** para decidir pago/devolución
- **Porcentaje pagado acumulado** frente al total anual declarado
- **Consolidado final TOTAL (fila 6)**:
  - Col2: total anual pagado
  - Col3: porcentaje total pagado
  - Col4: saldo final borrador (pago o devolución)
- **Indicador visual de estado**:
  - > 0: pendiente de pago (rojo)
  - <= 0: devolución o compensado (verde)

## Casos borde
1. **TOTAL Resumen de nominas = 0**: los porcentajes PAGADO % deben ser 0 para evitar división por cero
2. **Sin retenciones guardadas en meses**: PAGADO € debe ser 0 en todas las filas
3. **BORRADOR € = 0**: estado compensado (sin pago ni devolución)
4. **BORRADOR € < 0**: devolución a favor del usuario (mostrar en verde)
5. **BORRADOR € > 0**: cantidad pendiente de pago (mostrar en rojo)
6. **Retención capital no implementada**: mantener fila en 0 sin afectar sumatorios

