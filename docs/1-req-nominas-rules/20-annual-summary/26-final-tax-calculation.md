# Feature: IRPF Necesario

## Ubicación
Card "IRPF Necesario" en colapsable "RENTA" (después de Extra2).

## Propósito
Calcular el IRPF definitivo adeudado (o a devolver) después de aplicar desgravaciones y comparar con retenciones ya pagadas.

## Tabla "IRPF Necesario"

Tabla con 7 columnas: Concepto | Estatal € | Estatal % | Autonómico € | Autonómico % | Total € | Total %

### Filas fijas

| # | Concepto | Col2: Est. € | Col3: Est. % | Col4: Aut. € | Col5: Aut. % | Col6: Total € | Col7: Total % |
|----|----------|-------------|------------|-------------|------------|-------------|------------|
| 1 | Retención IRPF | automático | automático | automático | automático | automático | automático |
| 2 | Retención Capital | automático | automático | automático | automático |
| 3 | **CUOTAS LIQUIDAS** | automático | automático | automático | automático | automático | automático |

## Fórmulas

### Retención IRPF (fila 1)

**Estatal € (Columna 2)**
```
= TOTAL Impuestos Estatal (fila 7, Col4 de 22-configuration-irpf-brackets.md)
  - IMPUESTOS Estatal (fila 6, Col2 de 24-tax-exemptions.md)
```

**Estatal % (Columna 3)**
```
= (Retención IRPF Estatal € / BASE IRPF Col2 de 25-contribution-base.md) × 100
```

Validación: dividir por 0 → mostrar 0%.

**Autonómico € (Columna 4)**
```
= TOTAL Impuestos Autonómico (fila 7, Col4 de 22-configuration-irpf-brackets.md)
  - IMPUESTOS Autonómico (fila 6, Col3 de 24-tax-exemptions.md)
```

**Autonómico % (Columna 5)**
```
= (Retención IRPF Autonómico € / BASE IRPF Col3 de 25-contribution-base.md) × 100
```

Validación: dividir por 0 → mostrar 0%.

### Retención Capital (fila 2)

**Estatal € (Columna 2)**
```
= IMPUESTOS_RESUMEN (footer 2, 10-saving-base.md) / 2
```

**Estatal % (Columna 3)**
```
= 0,19 / 2
```

Validación: dividir por 0 → mostrar 0%.

**Autonómico € (Columna 4)**
```
= IMPUESTOS_RESUMEN (footer 2, 10-saving-base.md) / 2
```

**Autonómico % (Columna 5)**
```
= 0,19 / 2
```

Validación: dividir por 0 → mostrar 0%.

### CUOTAS LIQUIDAS (fila 3)

**Total € (Columna 6)**
```
= Estatal € (fila 1, Col2) + Autonómico € (fila 1, Col4) + Capital €
```

**Total % (Columna 7)**
```
= Estatal % (fila 1, Col3) + Autonómico % (fila 1, Col5) + Capital %
```

**Comparación con Retenciones Pagadas**
```
Diferencia = CUOTAS LIQUIDAS Total € - Retenciones IRPF Pagadas (Extra2 Total de 16-accumulated.md)

Si Diferencia > 0: Usuario debe pagar
Si Diferencia < 0: Administración devuelve
Si Diferencia ≈ 0: Compensado
```

## Comportamiento UI
- Todas las filas y columnas: solo lectura
- Formato moneda (€) con 2 decimales
- Formato porcentaje (%) con 2 decimales
- Mostrar claramente la diferencia: CUOTAS LIQUIDAS vs Retenciones Pagadas
- Si es diferencia > 0: color rojo (cantidad a pagar)
- Si es diferencia < 0: color verde (devolución)

## Dependencias de entrada
- **TOTAL Impuestos** de 22-configuration-irpf-brackets.md (ambas tablas)
- **IMPUESTOS** de 24-tax-exemptions.md (ambas columnas)
- **BASE IRPF** de 25-contribution-base.md (ambas columnas)
- **Retenciones IRPF Pagadas** (acumuladas de 16-accumulated.md, Extra2)

## Dependencias de salida
- **CUOTAS LIQUIDAS Total €** → comparar con retenciones reales para determinar devolución/pago
- **Este cálculo es el resultado final** de toda la declaración anual

## Casos borde
1. BASE IRPF = 0 → IRPF necesario = 0
2. Si la base imponible final queda por debajo del mínimo personal exento, la cuota líquida debe resolverse a 0
3. IRPF necesario < retenciones pagadas → devolución positiva
4. IRPF necesario > retenciones pagadas → cantidad a pagar
5. Cambio de tramos o desgravaciones → recalcula automáticamente
6. División por cero en % → mostrar 0%, nunca error
