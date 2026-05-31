

## 1. Secciones mensuales colapsables: `Enero` … `Diciembre` y `Resumen`

Las 14 secciones comparten **estructura y fórmulas idénticas**. Cambian únicamente los inputs del mes. Cada mes se representa como un panel colapsable en la misma página del dashboard, conservando el mismo contenido que antes estaban en pestañas.

A continuación las 15 secciones:
- `Enero`
- `Febrero`
- `Marzo`
- `Abril`
- `Mayo`
- `Junio`
- `Extra1`
- `Julio`
- `Agosto`
- `Septiembre`
- `Octubre`
- `Noviembre`
- `Diciembre`
- `Extra2`
- `Resumen`

### 1.1 COLAPSABLE `NOMINA`

Se deben crear el layout principal horizontal que se puedan colapsar con un boton en el que incluyan el contenido siguiente:
- `Nomina`: Debe contener los calculos de la nómina por tanto todos los input siguientes:
    - BOTON DUPLICAR DATOS: Debe haber un boton con un icono de "DUPLICAR" a la derecha del titulo `Nomina` que abra un panel con un desplegable de los meses y las 2 extra. Además en la esquina superior izquierda del panel un check para guardar los datos. Cuando se pulse el boton check, se debe cerrar el panel y copiar todos los datos inputs del mes elegido en el desplegable del panel. 
    - CARDS:
        - CARD: DATOS EMPLEADO
        - CARD: SALARIO BASE, BENEFICIOS e IMPUESTOS (en paralelo en la misma fila)
        - CARD: RESUMEN SEMANAL y ACUMULADO (en paralelo en la misma fila)


#### 1.1.1 CARD: `DATOS EMPLEADO`

Panel con inputs que deben tener el label dentro del input. Los input deben estar colocados en columnas y no en vertical
1 - Label: `Nombre` -> Input texto -> Valor por defecto vacio -> Placeholder John Doe
2 - Label: `Nº Empleado` -> Input numero -> Valor por defecto vacio -> Placeholder 123456
3 - Label: `Nº Días` -> Input numero -> Valor por defecto: 30
4 - Label: `Pagas Extra` -> Input numero -> Valor por defecto: 2
5 - Label: `Horas Extra` -> Input numero -> Valor por defecto: 0
6 - Label: `% Deducible Seguro Medico` -> Input decimal -> Valor por defecto vacio -> Placeholder 0
7 - Label: `Trienios` -> Input numero -> Valor por defecto vacio -> Placeholder 1

#### 1.1.2 CARD: `NOMINA`

En la siguiente sección se debe contener las tablas de manera paralela en la misma card de nomina

##### 1.1.2.1 TABLA `SALARIO BASE`
Tabla con 3 columnas:

COLUMNA 1 (no editable) -> `CONCEPTO`
FILAS FIJAS
1 - Label: `Sueldo Base`
2 - Label: `Antiguedad`
3 - Label: `PLUS Convenio`
4 - Label: `PLUS Voluntario`
5 - Label: `Pacto no competencia`
6 - Label: `Dedicacion plena`
FILAS ADICIONALES
7 - Un boton para añadir mas filas automaticamente y añadira un input text para indicar el concepto
X - Fila fija al final con el cálculo de sumatorio de la columna (no editable). Esta fila será anclada como footer visible siempre debajo de la tabla.

COLUMNA 2 (editable) -> `PRECIO/HORA`
FILAS FIJAS
1 - Sueldo base -> Input decimal 
2 - Antiguedad -> NO EDITABLE y NO INPUT decimal -> Calculo automático: (Suedo Base / 20) * Trienios 
3 - PLUS Convenio -> Input decimal
4 - PLUS Voluntario -> Input decimal
5 - Pacto no competencia -> Input decimal
6 - Dedicacion plena -> Input decimal
FILAS ADICIONALES
7 - Cuando se añada una fila se podrá introducir valores decimales
X - Fila fija al final con el cálculo automático del sumatorio de todos los valores de esta columna (no editable). Esta fila será anclada como footer.

COLUMNA 3 (no editable) -> `DEVENGOS`
FILAS FIJAS - Se calculan automaticamente porque no son editables
1 - Sueldo base -> Nº Dias * Sueldo Base (COLUMNA 2)
2 - Antiguedad -> Nº Dias * Antiguedad (COLUMNA 2)
3 - PLUS Convenio -> Nº Dias * PLUS Convenio (COLUMNA 2)
4 - PLUS Voluntario -> Nº Dias * PLUS Voluntario (COLUMNA 2)
5 - Pacto no competencia -> Nº Dias * Pacto de nocompetencia (COLUMNA 2)
6 - Dedicacion plena -> Nº Dias * Dedicación plena (COLUMNA 2)
FILAS ADICIONALES
7 - Cuando se añada una fila se podrá introducir valores decimales
X - Fila fija al final con el cálculo automático de sumatorio de toda la columna 3 de devengos (no editable). El cuerpo de la tabla tendrá altura fija y scroll cuando haya muchas filas; el footer permanecerá anclado abajo.

##### 1.1.2.2 TABLA `BENEFICIOS`

Conceptos: Seguro Medico, Tickets, Seguro Vida.

Tabla con 3 columnas:

COLUMNA 1 (no editable) -> `CONCEPTO`
FILAS FIJAS
1 - Label: `Seguro Medico`
2 - Label: `Tickets` 
3 - Label: `Seguro Vida`
FILAS ADICIONALES
7 - Un boton para añadir mas filas automaticamente y añadira un input text para indicar el concepto
X - Fila fija al final con el cálculo de sumatorio de la columna (no editable). El cuerpo de la tabla tendrá altura fija y scroll cuando haya muchas filas; el footer permanecerá anclado abajo.

COLUMNA 2 (editable) -> `DEVENGOS`
FILAS FIJAS
1 - Seguro Medico -> Input decimal -> Valor por defecto -41,67
2 - Tickets -> Input decimal -> Valor por defecto 48
3 - Seguro Vida -> Input decimal -> Valor por defecto 7,78
FILAS ADICIONALES
7 - Cuando se añada una fila se podrá introducir valores decimales
X - Fila fija al final con el cálculo automático del sumatorio de todos los valores de esta columna (no editable). El cuerpo de la tabla tendrá altura fija y scroll cuando haya muchas filas; el footer permanecerá anclado abajo.

COLUMNA 3 (no editable) -> `DEDUCCIONES`
FILAS FIJAS - Se calculan automaticamente porque no son editables
1 - Seguro Medico -> Calculo automático: (Seguro Medico * `% Deducible Seguro Medico`) / 100
2 - Tickets -> Calculo automático: Mismo valor que `Tickets` (COLUMNA 2)
3 - Seguro Vida -> Calculo automático: Mismo valor que `Seguro Vida` (COLUMNA 2)
FILAS ADICIONALES
7 - Cuando se añada una fila se podrá introducir valores decimales
X - Fila fija al final con el cálculo automático del sumatorio de todos los valores de esta columna (no editable). El cuerpo de la tabla tendrá altura fija y scroll cuando haya muchas filas; el footer permanecerá anclado abajo.


##### 1.1.2.3 TABLA `IMPUESTOS`

Para cada concepto SS (Desempleo, Formación Profesional, Contingencias Comunes, MEI, FOGASA, AT/EP):

Tabla con 6 columnas:

COLUMNA 1 (no editable) -> `CONCEPTO`
FILAS FIJAS
1 - Label: `Desempleo`
2 - Label: `Formacion Profesional` 
3 - Label: `Contingencias Comunes`
4 - Label: `MEI`
5 - Label: `FOGASA`
6 - Label: `AT/PE`
FILAS ADICIONALES: Separadas por una fila
7 - LABEL: `IRPF`
8 - LABEL: `IRPF EXTRA`
9 - LABEL: `TOTAL`

COLUMNA 2 (no editable) -> `BASE`
FILAS FIJAS - Se calculan automaticamente porque no son editables
1 - Desempleo -> Calculo automatico: (TOTAL COLUMNA 3 TABLA SALARIO BASE + TOTAL COLUMNA 2 TABLA BENEFICIOS) - COLUMNA 2 (SEGURO MEDICO) TABLA BENEFICIOS + PRORATA EXTRAS COLUMNA 2 TABLA RESUMEN RESULTADOS
2 - Formacion Profesional -> Calculo automático: mismo valor que Desempleo
3 - Contingencias Comunes -> Calculo automático: mismo valor que Desempleo
4 - MEI -> Calculo automático: mismo valor que Desempleo
5 - FOGASA -> Calculo automático: mismo valor que Desempleo
6 - AT/PE -> Calculo automático: mismo valor que Desempleo
FILAS ADICIONALES
7 - IRPF -> Calculo automático: (TOTAL COLUMNA 3 TABLA SALARIO BASE + SEGURO MEDICO COLUMNA 2 TABLA BENEFICIOS)
8 - IRPF EXTRA -> Mismo valor que el IRPF
9 - TOTAL Fila fija al final: vacio

COLUMNA 3 -> `% EMPLEADOS`
FILAS FIJAS - Datos proporcionados por defecto
1 - Desempleo -> Valor indicado en el colapsable de Resumen la RENTA en la tabla Seguridad Social en la columna 2 EMPLEADOS en la fila 1 Desempleo
2 - Formacion Profesional -> Valor indicado en el colapsable de Resumen la RENTA en la tabla Seguridad Social en la columna 2 EMPLEADOS en la fila 2 Formacion Profesional
3 - Contingencias Comunes -> Valor indicado en el colapsable de Resumen la RENTA en la tabla Seguridad Social en la columna 2 EMPLEADOS en la fila 3 Contingencias Comunes
4 - MEI -> Valor indicado en el colapsable de Resumen la RENTA en la tabla Seguridad Social en la columna 2 EMPLEADOS en la fila 4 MEI
5 - FOGASA -> Valor indicado en el colapsable de Resumen la RENTA en la tabla Seguridad Social en la columna 2 EMPLEADOS en la fila 5 FOGASA
6 - AT/PE -> Valor indicado en el colapsable de Resumen la RENTA en la tabla Seguridad Social en la columna 2 EMPLEADOS en la fila 6 AT/PE
FILAS ADICIONALES
7 - IRPF -> Valor editable -> Valor por defecto 22,22%
8 - IRPF EXTRA -> Valor editable -> Valor por defecto 0%
9 - TOTAL Fila fija al final con el total: Sumatorio de esta columna de porcentajes

COLUMNA 4 (no editable) -> `DEDUCCIONES EMPLEADO`
FILAS FIJAS - Se calculan automaticamente porque no son editables
1 - Desempleo -> Calculo automatico: Desempleo COLUMNA 2 * Desempleo COLUMNA 3
2 - Formacion Profesional -> Calculo automático:  Formacion Profesional COLUMNA 2 * Formacion Profesional COLUMNA 3
3 - Contingencias Comunes -> Calculo automático:  Contingencias Comunes COLUMNA 2 * Contingencias Comunes COLUMNA 3
4 - MEI -> Calculo automático:  MEI COLUMNA 2 * MEI COLUMNA 3
5 - FOGASA -> Calculo automático:  FOGASA COLUMNA 2 * FOGASA COLUMNA 3
6 - AT/PE -> Calculo automático:  AT/PE COLUMNA 2 * AT/PE COLUMNA 3
FILAS ADICIONALES
7 - IRPF -> Calculo automático: (IRPF COLUMNA 2 * IRPF COLUMNA 3) / 100
8 - IRPF EXTRA -> Calculo automático: (IRPF EXTRA COLUMNA 2 * IRPF EXTRA COLUMNA 3) / 100
9 - TOTAL Fila fija al final: Sumatorio de esta columna

COLUMNA 5 -> `% EMPRESA`
FILAS FIJAS - Datos proporcionados por defecto
1 - Desempleo -> Valor indicado en el colapsable de Resumen la RENTA en la tabla Seguridad Social en la columna 2 EMPRESA en la fila 1 Desempleo
2 - Formacion Profesional -> Valor indicado en el colapsable de Resumen la RENTA en la tabla Seguridad Social en la columna 2 EMPRESA en la fila 2 Formacion Profesional
3 - Contingencias Comunes -> Valor indicado en el colapsable de Resumen la RENTA en la tabla Seguridad Social en la columna 2 EMPRESA en la fila 3 Contingencias Comunes
4 - MEI -> Valor indicado en el colapsable de Resumen la RENTA en la tabla Seguridad Social en la columna 2 EMPRESA en la fila 4 MEI
5 - FOGASA -> Valor indicado en el colapsable de Resumen la RENTA en la tabla Seguridad Social en la columna 2 EMPRESA en la fila 5 FOGASA
6 - AT/PE -> Valor indicado en el colapsable de Resumen la RENTA en la tabla Seguridad Social en la columna 2 EMPRESA en la fila 6 AT/PE 
FILAS ADICIONALES
7 - IRPF -> Vacio no editable
8 - IRPF EXTRA -> Vacio no editable
9 - TOTAL Fila fija al final con el total: Sumatorio de esta columna de porcentajes

COLUMNA 6 (no editable) -> ` EMPRESA`
FILAS FIJAS - Se calculan automaticamente porque no son editables
1 - Desempleo -> Calculo automatico: Desempleo COLUMNA 4 * Desempleo COLUMNA 5
2 - Formacion Profesional -> Calculo automático:  Formacion Profesional COLUMNA 4 * Formacion Profesional COLUMNA 5
3 - Contingencias Comunes -> Calculo automático:  Contingencias Comunes COLUMNA 4 * Contingencias Comunes COLUMNA 5
4 - MEI -> Calculo automático:  MEI COLUMNA 4 * MEI COLUMNA 5
5 - FOGASA -> Calculo automático:  FOGASA COLUMNA 4 * FOGASA COLUMNA 5
6 - AT/PE -> Calculo automático:  AT/PE COLUMNA 4 * AT/PE COLUMNA 5
FILAS ADICIONALES
7 - IRPF -> Vacio no editable
8 - IRPF EXTRA -> Vacio no editable
9 - TOTAL Fila fija al final: Sumatorio de esta columna

#### 1.1.2 CARD: `RESUMEN MENSUAL`

#### 1.1.2.1 TABLA: `RESUMEN MENSUAL`

Esta tabla indicara el resumen de la nomina mensual con datos como el bruto y neto:

Tabla con 2 columnas:

COLUMNA 1 (no editable) -> `CONCEPTO`
FILAS FIJAS
1 - Label: `Bruto`
2 - Label: `Deducciones` 
3 - Label: `Neto`
4 - Label: `Prorrata Extras`

COLUMNA 2 (no editable) -> `BASE`
FILAS FIJAS - Se calculan automaticamente porque no son editables
1 - Bruto -> Calculo automatico: (TOTAL COLUMNA 3 TABLA SALARIO BASE + TOTAL COLUMNA 2 TABLA BENEFICIOS)
2 - Deducciones -> Calculo automatico: (TOTAL COLUMNA 3 TABLA BENEFICIOS + TOTAL COLUMNA 4 TABLA IMPUESTOS)
3 - Neto -> Calculo automático: Bruto - Deducciones (las columnas anteriores de esta misma tabla)
4 - Prorrata Extras -> Calculo automático: (TOTAL COLUMNA 3 TABLA SALARIO BASE * Pagas Extra) / 12

#### 1.1.3 CARD: `ACUMULADO`
#### 1.1.3.1 TABLA: `ACUMULADO`

Esta tabla indicara el acumulado del  durante los meses anteriores del mismo año:

Tabla con 3 columnas:

COLUMNA 1 (no editable) -> `CONCEPTO`
FILAS FIJAS
1 - Label: `Imponible IRPF`
2 - Label: `Retenciones IRPF` 
3 - Label: `Cotizacion SS Empleado`
4 - Label: `Cotizacion SS Empresa`
5 - Label: `Recibido`

COLUMNA 2 (no editable) -> `CALCULOS`
FILAS FIJAS - Se calculan automaticamente porque no son editables
1 - Imponible IRPF -> Mismo valor que la tabla IMPUESTOS en la columna 2 valor IRPF
2 - Retenciones IRPF -> Mismo valor que la tabla IMPUESTOS en la columna 4 valor IRPF
3 - Cotizacion SS Empleado -> Calculo automático: TOTAL COLUMNA 4 TABLA IMPUESTOS - (IRPF COLUMNA 4 TABLA IMPUESTOS + IRPF EXTRA COLUMNA 4 TABLA IMPUESTOS)
4 - Cotizacion SS Empresa -> Mismo valor que la tabla IMPUESTOS en la columna 6 valor TOTAL
5 - Recibido -> Mismo valor que la tabla RESUMEN MENSUAL en la columna 2 valor Neto

COLUMNA 3 (no editable) -> `TOTAL`
FILAS FIJAS - Se calculan automaticamente porque no son editables
1 - Imponible IRPF -> Calculo automático: Imponible IRPF COLUMNA 2 + Imponible IRPF COLUMNA 2 del mes anterior (si es enero no hay mes anterior)
2 - Retenciones IRPF -> Calculo automático: Retenciones IRPF COLUMNA 2 + Retenciones IRPF COLUMNA 2 del mes anterior (si es enero no hay mes anterior)
3 - Cotizacion SS Empleado -> Calculo automático: Cotizacion SS Empleado + Cotizacion SS Empleado del mes anterior (si es enero no hay mes anterior)
4 - Cotizacion SS Empresa -> Calculo automático: Cotizacion SS Empresa + Cotizacion SS Empresa del mes anterior (si es enero no hay mes anterior)
5 - Recibido -> -> Calculo automático: Recibido COLUMNA 2 + Recibido COLUMNA 2 del mes anterior (si es enero no hay mes anterior)


#### 1.1.4 CARD: `PARTICIONES`
#### 1.1.4.1 CHART PIE: `PARTICIONES`

Es un grafico de tipo pie que represente los porcentajes que recibo integro para mi de mi nomina y lo que me retira el estado.

El gráfico debe coger 4 valores claros de la tabla ACUMULADOS en los que represente el porcentaje con un tooltip en cada quesito que se muestre el valor:
- Retenciones IRPF (COLUMNA 2)
- Cotizacion SS Empleado (COLUMNA 2)
- Cotizacion SS Empresa  (COLUMNA 2)
- Recibido (NETO) (COLUMNA 2)

## 2. Resumen colapsable

Este colapsable va al final de la lista de meses despues de Extra 2 y su funcion es hacer un resumen del año para poder hacer la declaración de la renta

### 2.1 COLAPSABLE `CONFIGURACION RENTA`

En esta sección se utilizará para configurar los tramos de IRPF y de Seguridad Social

- CARDS:
    - Seguridad Social: Tabla de porcentajes de impuestos a la seguridad social por parte de empleado y empresa
    - IRPF ESTATAL: Tablas de porcentajes de los tramos de irpf para el gobierno central
    - IRPF AUTONOMICO: Tablas de porcentajes de los tramos de IRPF para el gobierno autonómico

#### 2.1.1 CARD: `Seguridad Social`
#### 2.1.1.1 TABLA: `Seguridad Social`

Esta tabla indicara los porcentajes del empleado y la empresa de cotizaciones a la seguridad social:

Tabla con 3 columnas:

COLUMNA 1 (no editable) -> `CONCEPTO`
FILAS FIJAS
1 - Label: `Desempleo`
2 - Label: `Formacion Profesional` 
3 - Label: `Contingencias Comunes`
4 - Label: `MEI`
5 - Label: `FOGASA`
6 - Label: `AT/EP`
7 - Label: `TOTAL`

COLUMNA 2 -> `EMPLEADO`
FILAS FIJAS - Se calculan automaticamente porque no son editables
1 - Desempleo -> Valor editable con valor por defecto 1,55%
2 - Formacion Profesional -> Valor editable por defecto 0,10%
3 - Contingencias Comunes -> Valor editable por defecto 4,7%
4 - MEI -> Valor editable por defecto 0,15%
5 - FOGASA -> Valor editable por defecto 0%
6 - AT/EP -> Valor editable por defecto 0%
7 - TOTAL -> Calculo automatico: Sumatorio de todos los valores de la misma columna

COLUMNA 3 -> `EMPRESA`
FILAS FIJAS - Se calculan automaticamente porque no son editables
1 - Desempleo -> Valor editable con valor por defecto 5,50%
2 - Formacion Profesional -> Valor editable por defecto 0,60%
3 - Contingencias Comunes -> Valor editable por defecto 23,60%
4 - MEI -> Valor editable por defecto 0,75%
5 - FOGASA -> Valor editable por defecto 0,20%
6 - AT/EP -> Valor editable por defecto 1,50%
7 - TOTAL -> Calculo automatico: Sumatorio de todos los valores de la misma columna

COMPORTAMIENTO IMPORTANTES DE ESTOS VALORES: Estos porcentajes coinciden con la tabla de IMPUESTOS de cada nomina del mes (pestaña de los meses) concretamente con:
 - tabla IMPUESTOS COLUMNA 2 %EMPELADO es igual a COLUMNA 2 `EMPLEADO`
 - tabla IMPUESTOS COLUMNA 4 %EMPRESA es igual a COLUMNA 3 `EMPRESA`

#### 2.1.2 CARD: `IRPF ESTATAL`
#### 2.1.2.1 TABLA: `IRPF ESTATAL`

Esta tabla indicara los tramos de IRPF para el gobierno central:

Tabla con 3 columnas:

COLUMNA 1 -> `INICIO`
FILAS FIJAS
1 - Valor editable por defecto 0
2 - Valor editable por defecto 12450 
3 - Valor editable por defecto 20200
4 - Valor editable por defecto 35200
5 - Valor editable por defecto 60000
6 - Valor editable por defecto 300000
7 - Label `TOTAL`

COLUMNA 2 -> `FIN`
FILAS FIJAS
1 - Valor editable por defecto 12449,99
2 - Valor editable por defecto 20199,99
3 - Valor editable por defecto 35199,99
4 - Valor editable por defecto 59999,99
5 - Valor editable por defecto 29999,99
6 - Valor NO editable por defecto null
7 - Valor NO editable por defecto null

COLUMNA 3 -> `%`
FILAS FIJAS
1 - Valor editable por defecto 9,5%
2 - Valor editable por defecto 12,00%
3 - Valor editable por defecto 15,00%
4 - Valor editable por defecto 18,50%
5 - Valor editable por defecto 22,50
6 - Valor editable por defecto 24,50%
7 - Valor NO editable por defecto null

COLUMNA 4 -> `IMPUESTOS`
FILAS FIJAS - Se calculan automaticamente porque no son editables
1 - 0
2 - 0
3 - 0
4 - 0
5 - 0
6 - 0
7 - Calculo automático: Sumatorio de los valores de la misma columna

#### 2.1.2 CARD: `IRPF AUTONOMICO`
#### 2.1.2.1 TABLA: `IRPF AUTONOMICO`

Esta tabla indicara los tramos de IRPF para el gobierno autonomico:

Tabla con 3 columnas:

COLUMNA 1 -> `INICIO`
FILAS FIJAS
1 - Valor editable por defecto 0
2 - Valor editable por defecto 12450 
3 - Valor editable por defecto 20200
4 - Valor editable por defecto 35200
5 - Valor editable por defecto 60000
6 - Valor editable por defecto 300000
7 - Label `TOTAL`

COLUMNA 2 -> `FIN`
FILAS FIJAS
1 - Valor editable por defecto 12449,99
2 - Valor editable por defecto 20199,99
3 - Valor editable por defecto 35199,99
4 - Valor editable por defecto 59999,99
5 - Valor editable por defecto 29999,99
6 - Valor NO editable por defecto null
7 - Valor NO editable por defecto null

COLUMNA 3 -> `%`
FILAS FIJAS
1 - Valor editable por defecto 9,5%
2 - Valor editable por defecto 12,00%
3 - Valor editable por defecto 15,00%
4 - Valor editable por defecto 18,50%
5 - Valor editable por defecto 22,50
6 - Valor editable por defecto 24,50%
7 - Valor NO editable por defecto null

COLUMNA 4 -> `IMPUESTOS`
FILAS FIJAS - Se calculan automaticamente porque no son editables
1 - 0
2 - 0
3 - 0
4 - 0
5 - 0
6 - 0
7 - Calculo automático: Sumatorio de los valores de la misma columna

### 2.2 COLAPSABLE `RENTA`

En esta sección se utilizará para introducir los datos del año de los tramos de IRPF y la seguridad social para poder calcular los resultados de la declaración de la renta en base a las nominas mensuales anteriores:

- CARDS:
    - Resumen de nominas: Tabla que da el resumen bruto recibido con las nominas anteriores

#### 2.2.1 CARD: `Resumen de nominas`
#### 2.2.1.1 TABLA: `Resumen de nominas`

Esta tabla indicara el resumen total anual de todas las nominas:

Tabla con 3 columnas:

COLUMNA 1 (no editable) -> `CONCEPTO`
FILAS FIJAS
1 - Label: `Salario Bruto`
2 - Label: `Otros beneficios` 
3 - Label: `TOTAL`

COLUMNA 2 -> `IMPORTE`
FILAS FIJAS - Se calculan automaticamente porque no son editables
1 - Salario Bruto -> Mismo valor que el colapsable "Extra2" en la tabla ACUMULADO la columna 3 el valor de Imponible IRPF
2 - Otros beneficios -> Valor editable por defecto 0
3 - TOTAL -> Calculo automatico: Sumatorio de todos los valores de la misma columna

#### 2.2.2 CARD: `Exencion de impuestos`
#### 2.2.2.1 TABLA: `Exencion de impuestos`

Esta tabla indicara que parte de los tramos de irpf esta exento de impuestos:

Tabla con 3 columnas:

COLUMNA 1 (no editable) -> `CONCEPTO`
FILAS FIJAS
1 - Label: `MINIMO PERSONAL`
2 - Label: `DESCENDIENTES`
3 - Label: `ASCENDIENTES`
4 - Label: `MINUSVALIAS`
5 - Label: `TOTAL`
6 - Label: `IMPUESTOS`

COLUMNA 2 -> `IMPORTE ESTATAL`
FILAS FIJAS - Son campos editables y calculados
1 - MINIMO PERSONAL -> Valor editable por defecto 5550
2 - DESCENDIENTES -> Valor editable por defecto 0
3 - ASCENDIENTES -> Valor editable por defecto 0
4 - MINUSVALIAS -> Valor editable por defecto 0
5 - TOTAL -> Calculo automatico: Sumatorio de las filas anteriores
6 - IMPUESTOS -> Calculo automático: TOTAL de esta misma columna * COLUMNA 3 TABLA IRPF ESTATAL FILA 1

COLUMNA 3 -> `IMPORTE AUTONOMICO`
FILAS FIJAS - Son campos editables y calculados
1 - MINIMO PERSONAL -> Valor editable por defecto 5956,65
2 - DESCENDIENTES -> Valor editable por defecto 0
3 - ASCENDIENTES -> Valor editable por defecto 0
4 - MINUSVALIAS -> Valor editable por defecto 0
5 - TOTAL -> Calculo automatico: Sumatorio de las filas anteriores
6 - IMPUESTOS -> Calculo automático: TOTAL de esta misma columna * COLUMNA 3 TABLA IRPF AUTONOMICO FILA 1

#### 2.2.3 CARD: `Base de Cotizacion`
#### 2.2.3.1 TABLA: `Base de Cotizacion`

Esta tabla indicara que base de cotización se utilizará para calcular los impuestos definitivos:

Tabla con 3 columnas:

COLUMNA 1 (no editable) -> `CONCEPTO`
FILAS FIJAS
1 - Label: `RENDIMIENTO TRABAJO`
2 - Label: `SS EMPLEADO`
3 - Label: `SS EMPRESA`
4 - Label: `TOTAL`
5 - Label: `BASE IRPF`

COLUMNA 2 -> `IMPORTE TOTAL`
FILAS FIJAS - Son campos editables y calculados
1 - RENDIMIENTO TRABAJO -> Valor editable por defecto 2000
2 - SS EMPLEADO -> Calculo automático: (Columna 2 fila 3 TOTAL de la tabla RESUMEN NOMINAS * Columna 2 fila total de la tabla Seguridad Social)
3 - SS EMPRESA -> Calculo automático: (Columna 2 fila 3 TOTAL de la tabla RESUMEN NOMINAS * Columna 3 fila total de la tabla Seguridad Social)
4 - TOTAL -> Caclulo automático: sumatorio de esta misma columna pero solo las filas 1 y 2 (RENDIMIENTO TRABAJO + SS EMPLEADO)
5 - BASE IRPF -> Calculo automatico: (Columna 2 fila 3 TOTAL de la tabla RESUMEN NOMINAS - TOTAL de la fila anterior)

COLUMNA 3 -> `IMPORTE PAGADO`
FILAS FIJAS - Son campos editables y calculados
1 - RENDIMIENTO TRABAJO -> Valor no editable que es igual al valor RENDIMIENTO TRABAJO de la columna 2
2 - SS EMPLEADO -> Mismo valor que en el colapsable de Extra 2 la tabla acumulado la columna 3 TOTAL la fila 3 Cotizaccion SS Empleado
3 - SS EMPRESA -> Mismo valor que en el colapsable de Extra 2 la tabla acumulado la columna 3 TOTAL la fila 4 Cotizaccion SS Empresa
4 - TOTAL -> Caclulo automático: sumatorio de esta misma columna pero solo las filas 1 y 2 (RENDIMIENTO TRABAJO + SS EMPLEADO)
5 - BASE IRPF -> Calculo automatico: (Columna 2 fila 3 TOTAL de la tabla RESUMEN NOMINAS - TOTAL de la fila anterior)

**Fin del documento.**





