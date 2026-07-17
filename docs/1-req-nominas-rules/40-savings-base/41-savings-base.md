# Feature: Base del ahorro e inversiones

## Ubicacion
Card/accordion "Base del ahorro" en el bloque de RENTA, situado despues de "Paga extra 2".

## Proposito
Registrar operaciones de inversion y calcular automaticamente los impuestos asociados a intereses de la base del ahorro.

## Tabla "Inversiones"

Tabla con 9 columnas:
1. BANCO (editable texto)
2. VENTA (editable numerica)
3. COMPRA (editable numerica)
4. INTERES BRUTO (editable numerica)
5. IMPUESTOS (automatico)
6. IMPUESTOS ESPANA (editable numerica)
7. IMPUESTOS EXTRANJERO (editable numerica)
8. COMISIONES (editable numerica + check deducible)
9. TOTAL (automatico)

### Reglas por fila

- Columna IMPUESTOS (col 5):
```
IMPUESTOS = INTERES BRUTO * 0,19
```

- Columna TOTAL (col 9):
```
TOTAL = INTERES BRUTO - IMPUESTOS - COMISIONES_NO_DEDUCIBLES
```

Donde:
```
COMISIONES_NO_DEDUCIBLES =
  0, si el check "comision deducible" esta marcado
  COMISIONES, si el check "comision deducible" no esta marcado
```

## Filas dinamicas

- La tabla debe permitir anadir filas dinamicamente.
- Cada nueva fila debe inicializarse en 0 en todas las columnas numericas.
- El check de comision deducible debe inicializarse en `false`.

## Footer 1: Totales por columna

Debe existir un footer que sume cada columna sobre todas las filas:

```
TOTAL_BANCO = SUM(BANCO)
TOTAL_VENTA = SUM(VENTA)
TOTAL_COMPRA = SUM(COMPRA)
TOTAL_INTERES_BRUTO = SUM(INTERES_BRUTO)
TOTAL_IMPUESTOS = SUM(IMPUESTOS)
TOTAL_IMPUESTOS_ESPANA = SUM(IMPUESTOS_ESPANA)
TOTAL_IMPUESTOS_EXTRANJERO = SUM(IMPUESTOS_EXTRANJERO)
TOTAL_COMISIONES = SUM(COMISIONES)
TOTAL_GENERAL = SUM(TOTAL)
```

## Footer 2: Resumen adicional

Debajo del footer de totales por columna, mostrar un segundo footer con:

- TOTAL GASTOS DEDUCIBLES
```
TOTAL_GASTOS_DEDUCIBLES = SUM(INTERES_BRUTO) - SUM(COMISIONES_DEDUCIBLES)
```

Donde:
```
COMISIONES_DEDUCIBLES = COMISIONES de filas con check deducible = true
```

- IMPUESTOS (resumen adicional)
```
IMPUESTOS_RESUMEN = (TOTAL_GASTOS_DEDUCIBLES * 0,19) - TOTAL_IMPUESTOS_EXTRANJERO
```

## Comportamiento UI

- Cols 1, 2, 3, 4, 6, 7 y 8: editables.
- Col 5 (IMPUESTOS): no editable, calculo automatico.
- Col 9 (TOTAL): no editable, calculo automatico.
- El check de "comision deducible" debe mostrarse dentro de la columna COMISIONES.
- Formato numerico con 2 decimales.
- Permitir valores 0 y negativos solo si se define como valido a nivel de regla de negocio.

## Dependencias de salida

- TOTAL_GENERAL y IMPUESTOS_RESUMEN se usan para calculos agregados de la base del ahorro en pasos posteriores del resumen anual.
