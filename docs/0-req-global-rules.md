
## 0. Visión general

Esta aplicación debera permitir introducir los datos de la nomina del usuario mes a mes para poder calcular el IRPF a final del año. Por tanto se intenta modelar la **vida fiscal y financiera anual** de un empleado en España:

1. **12 secciones mensuales colapsables** (`Enero` … `Diciembre`) con estructura idéntica → simulan la nómina del mes y el reparto de gastos/ahorro/inversión.
2. **2 secciones de pagas extra colapsables** (`Extra1`, `Extra2`) con estructura igual a las mensuales pero **sin cotización SS** y con **retención IRPF EXTRA** distinta.

Modelo de datos sugerido:

INPUTS USUARIOS
- `year`: array object
    - `month`: array object (14)
        - `empleado`: { nombre, nempleado, ndias, pagasextra, horasextra, percentajeDeducibleSeguroMedico, trienios } array creciente
        - `salario`: { sueldoBase, antiguedad, plusConvenio, plusVoluntario, pactoNoCompetencia, dedicacionPlena } array creciente
        - `beneficios`: { seguroMedico, tickets, seguroVida } array creciente
        - `impuestos`: { irpf}

---


## 3. Vistas sugeridas para la app

0. **header** - Se debe crear un header con una altura de 50 px que no se oculte cuando haces scroll
1. **Dashboard principal**: Debe tener unos margenes laterales deun 10%
1.1 **Panel anual** - Una vista inicial donde indique el año 2026 y que tenga un panel o estructura principal para navegar entre años. Representaría la renta de cada año.
1.2 **Sección mensual colapsable** - Una sección mensual dentro de la vista anual que representa cada uno de los meses del año más `Extra1` (entre Junio y Julio) y `Extra2` (después de diciembre).
1.3 **Calculo de nominas** - Dentro de cada sección mensual colapsable que es igual, el usuario deberá poder introducir los datos de su nomina y poder calcular automáticamente los valores de su nomina mensual y al final de año.

---

## 4. Validaciones y casos borde

- Días del mes ≠ 30 (febrero, meses con altas/bajas) → recalcular prorratas.
- Cambio de antigüedad a mitad de año (nuevo trienio).
- Cambio de CCAA durante el año → IRPF a prorrata por días en cada CCAA.
- Pérdidas patrimoniales: compensación entre ganancias y pérdidas dentro de la misma base (4 años).
- Ingresos < mínimo personal → cuota líquida = 0.
- Inversión `D2` con BBVA neto → recalcular bruto antes de sumar a la base.
- División por cero (`#DIV/0!` aparece en `J7`, `J14`, `J15` cuando D=0): tratar como 0 % en UI.

---

**Fin del documento.**