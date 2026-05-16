

## 1. Secciones mensuales colapsables: `Enero` … `Diciembre`

Las 14 secciones comparten **estructura y fórmulas idénticas**. Cambian únicamente los inputs del mes. Cada mes se representa como un panel colapsable en la misma página del dashboard, conservando el mismo contenido que antes estaban en pestañas.

A continuación las 14 secciones:
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
6 - Label: `% Deducible Adeslas` -> Input decimal -> Valor por defecto vacio -> Placeholder 0
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

Conceptos: Adeslas, Tickets, Seguro Vida.

Tabla con 3 columnas:

COLUMNA 1 (no editable) -> `CONCEPTO`
FILAS FIJAS
1 - Label: `Adeslas`
2 - Label: `Tickets` 
3 - Label: `Seguro Vida`
FILAS ADICIONALES
7 - Un boton para añadir mas filas automaticamente y añadira un input text para indicar el concepto
X - Fila fija al final con el cálculo de sumatorio de la columna (no editable). El cuerpo de la tabla tendrá altura fija y scroll cuando haya muchas filas; el footer permanecerá anclado abajo.

COLUMNA 2 (editable) -> `DEVENGOS`
FILAS FIJAS
1 - Adeslas -> Input decimal -> Valor por defecto -41,67
2 - Tickets -> Input decimal -> Valor por defecto 48
3 - Seguro Vida -> Input decimal -> Valor por defecto 7,78
FILAS ADICIONALES
7 - Cuando se añada una fila se podrá introducir valores decimales
X - Fila fija al final con el cálculo automático del sumatorio de todos los valores de esta columna (no editable). El cuerpo de la tabla tendrá altura fija y scroll cuando haya muchas filas; el footer permanecerá anclado abajo.

COLUMNA 3 (no editable) -> `DEDUCCIONES`
FILAS FIJAS - Se calculan automaticamente porque no son editables
1 - Adeslas -> Calculo automático: (Adeslas * `% Deducible Adeslas`) / 100
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
1 - Desempleo -> Calculo automatico: (TOTAL COLUMNA 3 TABLA SALARIO BASE + TOTAL COLUMNA 2 TABLA BENEFICIOS) - COLUMNA 2 (ADESLAS) TABLA BENEFICIOS + PRORATA EXTRAS COLUMNA 2 TABLA RESUMEN RESULTADOS
2 - Formacion Profesional -> Calculo automático: mismo valor que Desempleo
3 - Contingencias Comunes -> Calculo automático: mismo valor que Desempleo
4 - MEI -> Calculo automático: mismo valor que Desempleo
5 - FOGASA -> Calculo automático: mismo valor que Desempleo
6 - AT/PE -> Calculo automático: mismo valor que Desempleo
FILAS ADICIONALES
7 - IRPF -> Calculo automático: (TOTAL COLUMNA 3 TABLA SALARIO BASE + ADESLAS COLUMNA 2 TABLA BENEFICIOS)
8 - IRPF EXTRA -> Mismo valor que el IRPF
9 - TOTAL Fila fija al final: vacio

COLUMNA 3 -> `% EMPLEADOS`
FILAS FIJAS - Datos proporcionados por defecto
1 - Desempleo -> Valor por defecto 1,55%
2 - Formacion Profesional -> Valor por defecto 0,10%
3 - Contingencias Comunes -> Valor por defecto 4,7%
4 - MEI -> Valor por defecto 0,15%
5 - FOGASA -> Valor por defecto 0%
6 - AT/PE -> Valor por defecto 0%
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
1 - Desempleo -> Valor por defecto 5,5%
2 - Formacion Profesional -> Valor por defecto 0,60%
3 - Contingencias Comunes -> Valor por defecto 23,6%
4 - MEI -> Valor por defecto 0,75%
5 - FOGASA -> Valor por defecto 0,2%
6 - AT/PE -> Valor por defecto 1,5%
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

**Fin del documento.**





