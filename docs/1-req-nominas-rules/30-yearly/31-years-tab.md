# Feature: Pestañas por año

## Ubicación
Zona superior del dashboard, por encima de la vista de nóminas mensuales y del resumen anual.

## Propósito
Permitir introducir y gestionar nóminas de distintos años dentro de la misma aplicación, separando la información por pestañas de año.

## Alcance funcional
Cada pestaña de año contiene la funcionalidad completa ya definida en:
- `10-monthly/` (features 11-17)
- `20-annual-summary/` (features 21-28)

Esto implica que cada año mantiene su propio estado de datos mensuales y su propio cálculo anual.

## Estructura de pestañas
- En el estado inicial solo existe una pestaña.
- La pestaña inicial se crea con el año actual del sistema (por ejemplo, 2026).
- Debe existir una pestaña adicional con icono `+` para crear nuevos años.
- Cada pestaña de año debe incluir una acción de eliminar con icono `X`.

## Comportamiento UI
- El texto de cada pestaña de año es editable por el usuario.
- El texto editable de año admite solo números.
- El valor esperado es un año en formato de 4 dígitos.
- Las pestañas son editables (cambio del valor de año directamente sobre la pestaña).
- La pestaña debe mantener un ancho suficiente para mostrar el año y los iconos de acción (editar y eliminar) sin que queden pegados al borde.
- Las pestañas se ordenan automáticamente de forma ascendente por año.

## Alta de nueva pestaña/año
Al crear una nueva pestaña desde `+`:
1. Se crea un nuevo año/pestaña.
2. Se clonan en la nueva pestaña todos los datos de los meses de la pestaña actualmente activa.
3. La nueva pestaña queda disponible con la misma estructura funcional mensual y anual.

## Reglas de datos
- La copia al crear una pestaña nueva toma como origen la pestaña activa en ese momento.
- La copia inicial incluye todos los datos de meses (bloque `10-monthly`).
- Tras la creación, los datos de cada pestaña/año evolucionan de forma independiente.
- No se permite eliminar la última pestaña disponible.
- Al modificar el valor de año de una pestaña, el conjunto se reordena automáticamente en orden ascendente.

## Dependencias
- Reutiliza la lógica y cálculos definidos en `10-monthly/` y `20-annual-summary/` para cada año.
- Requiere soporte de estado por año para no mezclar datos entre pestañas.

## Criterios de aceptación
1. Al abrir por primera vez, se muestra una única pestaña con el año actual.
2. Existe una pestaña con icono `+` para crear años adicionales.
3. Al crear un nuevo año, se copian los datos mensuales de la pestaña activa.
4. El nombre de la pestaña admite edición numérica y rechaza caracteres no numéricos.
5. Al editar un año, las pestañas quedan ordenadas automáticamente de menor a mayor año.
6. Cada pestaña conserva sus datos y cálculos de forma aislada del resto.
7. Cada pestaña muestra acción `X` para eliminarla y, al pulsarla, se elimina esa pestaña.
8. Si solo existe una pestaña, la acción de eliminar está deshabilitada o no permite el borrado.
