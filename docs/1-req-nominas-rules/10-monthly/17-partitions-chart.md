# Feature: Gráfico de particiones

## Ubicación
Card "PARTICIONES" en cada mes.

## Propósito
Visualizar gráfico pie con porcentajes de distribución de nómina bruta.

## Gráfico pie "PARTICIONES"

Es un gráfico de tipo pie que representa los porcentajes que recibe el empleado integro de su nómina y lo que le retira el estado.

### Datos del gráfico
4 segmentos, valores de 16-accumulated.md (Columna 2, este mes):

| Segmento | Fuente | Fórmula |
|----------|--------|---------|
| Retenciones IRPF | 16-accumulated.md (fila 2, Col2) | % sobre Bruto |
| Cotización SS Empleado | 16-accumulated.md (fila 3, Col2) | % sobre Bruto |
| Cotización SS Empresa | 16-accumulated.md (fila 4, Col2) | % sobre Bruto (informativo) |
| Recibido (Neto) | 16-accumulated.md (fila 5, Col2) | % sobre Bruto |

### Cálculo de porcentajes

```
Porcentaje segmento = (Valor segmento / Bruto de 15-monthly-summary.md) × 100
```

Validaciones:
- Si Bruto = 0 → mostrar gráfico vacío o mensaje "No hay datos"
- Si algún segmento < 0 → clampear a 0 (evitar segmentos negativos)

## Comportamiento UI
- Tipo gráfico: pie chart (pastel)
- Colores diferenciados por segmento:
  - Retenciones IRPF: rojo/naranja
  - Cotización SS Empleado: amarillo
  - Cotización SS Empresa: azul (informativo)
  - Recibido (Neto): verde
- Tooltip en hover: muestra valor €, % y etiqueta
- Leyenda visible indicando concepto y valor
- Si algún segmento = 0, omitirlo del gráfico
- Responsive: adaptar tamaño al contenedor

## Dependencias de entrada
- **Bruto** de 15-monthly-summary.md
- **Retenciones IRPF** de 16-accumulated.md
- **Cotización SS Empleado** de 16-accumulated.md
- **Cotización SS Empresa** de 16-accumulated.md
- **Recibido (Neto)** de 16-accumulated.md

## Casos borde
1. Bruto = 0 → mostrar gráfico vacío o mensaje
2. Algún segmento negativo → clampearlo a 0
3. Todos los segmentos = 0 → mostrar mensaje "No hay detalles"
4. Suma de segmentos ≠ Bruto (por redondeos) → UI tolera diferencias < 1€
