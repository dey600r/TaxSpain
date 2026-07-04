# Feature: Header - Exportación e importación de datos

## Ubicación
Header principal de la aplicación.

## Propósito
Permitir al usuario exportar e importar el estado completo de la aplicación para respaldo, migración y restauración de datos.

## Requisito de layout
En el header deben existir **2 botones anclados a la derecha**:
1. Botón de exportación.
2. Botón de importación.

## Botón 1: Exportar JSON
### Comportamiento
- Al pulsar el botón de exportar, la aplicación debe generar un fichero `.json` descargable.
- El fichero debe incluir **todos los datos guardados hasta el momento en el storage del navegador**, incluyendo:
  - todos los años,
  - todos los meses,
  - configuraciones anuales,
  - estructura de pestañas y estado relacionado.
- La exportación debe representar el estado completo para poder restaurarlo más adelante.
- Tras exportar, la UI debe mostrar una notificación tipo popup de Angular Material en la esquina inferior derecha durante 3 segundos.

### Resultado esperado
- Se descarga un fichero JSON válido con la estructura canónica de persistencia usada por la aplicación.

## Botón 2: Importar JSON
### Comportamiento
- Al pulsar el botón de importación, el usuario podrá seleccionar un fichero `.json`.
- El fichero debe tener la **misma estructura** que la exportada por la aplicación.
- Una vez validado, su contenido debe **sobrescribir la cache/storage del navegador** con los datos del fichero importado.
- La sobrescritura aplica al estado persistido: años, meses y configuraciones.
- Tras importar correctamente, la UI debe mostrar una notificación tipo popup de Angular Material en la esquina inferior derecha durante 3 segundos.
- Si la importación falla (lectura o validación), la UI debe mostrar también una notificación de error en la esquina inferior derecha durante 3 segundos.

### Resultado esperado
- Tras importar correctamente, la aplicación refleja los datos del JSON importado como fuente de verdad en storage.

## Validaciones mínimas
1. El fichero de importación debe ser JSON válido.
2. El fichero debe respetar la estructura esperada de exportación.
3. Si el fichero no es válido o tiene estructura incorrecta, se debe mostrar error y no modificar el storage actual.

## Criterios de aceptación
1. Existen dos botones en el header, ambos anclados a la derecha.
2. Exportar genera y descarga un JSON con todos los datos persistidos de la aplicación.
3. Importar permite seleccionar un JSON previamente exportado.
4. Importar sobrescribe completamente el storage del navegador con el contenido del fichero.
5. Si falla la validación de importación, el storage previo se mantiene sin cambios.
6. Exportación e importación muestran feedback mediante popup de Angular Material en esquina inferior derecha y se ocultan automáticamente a los 3 segundos.
