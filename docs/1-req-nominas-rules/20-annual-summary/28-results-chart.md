# Feature: Gráfico de resultados (Borrador Renta)

## Ubicación
Card "Resultados gráfico" en colapsable "RENTA" (después de "Borrador Renta").

## Propósito
Visualizar en un gráfico de quesitos (pie) la distribución del importe pagado anual usando la Columna 2 (PAGADO €) de la tabla "Borrador Renta".

## Gráfico pie "Resultados"

Es un gráfico de tipo pie con 4 segmentos que representan la composición del total anual:
- Retención IRPF
- SS Empleado
- SS Empresa
- Resto

### Datos del gráfico

4 segmentos, valores en euros:

| Segmento | Fuente | Fórmula |
|----------|--------|---------|
| Retención IRPF | 27-results-calculations.md (fila 1, Col2) | Valor directo |
| SS Empleado | 27-results-calculations.md (fila 4, Col2) | Valor directo |
| SS Empresa | 27-results-calculations.md (fila 5, Col2) | Valor directo |
| RESTO | Calculado | (Salario Bruto + SS Empleado + SS Empresa) - TOTAL (fila 6, Col2) |

## Fórmulas

### Base del gráfico (denominador)
```
BaseGrafico = Salario Bruto (23-annual-income-summary.md, fila 1, Col2)
            + SS Empleado (27-results-calculations.md, fila 4, Col2)
            + SS Empresa (27-results-calculations.md, fila 5, Col2)
```

### Segmentos

**Retención IRPF**
```
= Borrador Renta (fila 1, Col2)
```

**SS Empleado**
```
= Borrador Renta (fila 4, Col2)
```

**SS Empresa**
```
= Borrador Renta (fila 5, Col2)
```

**RESTO**
```
= (Salario Bruto + SS Empleado + SS Empresa) - TOTAL (fila 6, Col2)
```

Donde:
```
TOTAL (fila 6, Col2) = Borrador Renta TOTAL PAGADO €
```

### Cálculo de porcentajes

```
Porcentaje segmento = (ValorSegmento / BaseGrafico) × 100
```

## Validaciones
- Si `BaseGrafico <= 0` -> mostrar gráfico vacío o mensaje "No hay datos".
- Si algún segmento es negativo -> clampear a `0`.
- Si `RESTO < 0` por incoherencias o redondeos -> clampear `RESTO = 0`.
- Si todos los segmentos son `0` -> mostrar mensaje "No hay detalles".

## Comportamiento UI
- Tipo gráfico: pie chart (pastel/quesitos).
- Colores sugeridos por segmento:
  - Retención IRPF: rojo/naranja
  - SS Empleado: amarillo
  - SS Empresa: azul
  - RESTO: verde
- Tooltip en hover: etiqueta + valor € + porcentaje.
- Leyenda visible con concepto y valor.
- Si un segmento vale 0, se puede ocultar para mejorar legibilidad.
- Responsive: adaptar tamaño del gráfico al contenedor.

## Dependencias de entrada
- **Salario Bruto** de 23-annual-income-summary.md (fila 1, Col2).
- **Retención IRPF PAGADO €** de 27-results-calculations.md (fila 1, Col2).
- **SS Empleado PAGADO €** de 27-results-calculations.md (fila 4, Col2).
- **SS Empresa PAGADO €** de 27-results-calculations.md (fila 5, Col2).
- **TOTAL PAGADO €** de 27-results-calculations.md (fila 6, Col2) para calcular RESTO.

## Dependencias de salida
- **Distribución visual anual** de importes pagados en RENTA.
- **Porcentaje por segmento** para lectura rápida de composición (IRPF, SS empleado, SS empresa, resto).
- **Indicador de coherencia**: RESTO permite detectar desviaciones entre base del gráfico y total pagado.

## Casos borde
1. BaseGrafico = 0 -> renderizar estado vacío.
2. TOTAL (fila 6, Col2) > (Salario Bruto + SS Empleado + SS Empresa) -> RESTO negativo, clampear a 0.
3. Segmentos con decimales extensos -> redondear visualmente a 2 decimales en UI.
4. Suma de porcentajes != 100 exacto por redondeos -> tolerar diferencia visual menor.
