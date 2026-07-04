# Feature: Header izquierdo - Menú lateral de navegación

## Ubicación
Header principal de la aplicación, zona izquierda.

## Propósito
Permitir la navegación principal entre las áreas de la aplicación mediante un menú lateral de Angular Material.

## Requisito de layout
- En el lado izquierdo del header debe existir un botón con icono de hamburguesa.
- Al pulsar ese botón, se abre un menú lateral (sidenav/drawer) de Angular Material.

## Estructura del menú lateral
El menú debe incluir exactamente 2 entradas:

1. `Dashboard`
- Icono: `dashboard`.
- Navega a una página de dashboard, inicialmente vacía (placeholder sin lógica funcional de nóminas).
- Ruta: `/dashboard`.

2. `Cuenta anual`
- Icono: `calculate` (calculadora).
- Navega a la página actual que contiene la lógica funcional descrita en `docs/1-req-nominas-rules/`.
- Ruta: `/cuenta-anual`.

## Reglas de navegación
- La entrada `Cuenta anual` debe apuntar al módulo/página que actualmente implementa la lógica de nóminas mensual/anual/multiejercicio.
- Si para mantener claridad de arquitectura es necesario renombrar o mover archivos/componentes/rutas, se permite hacerlo.
- La entrada `Dashboard` debe existir aunque su contenido inicial sea vacío.
- La ruta raíz `/` debe redirigir a `Cuenta anual` para mantener la vista funcional actual como entrada principal.

## Comportamiento UI
- El menú lateral debe abrir/cerrar sin romper el contenido principal.
- La navegación debe cerrar el menú tras seleccionar una entrada.
- Debe mostrarse estado activo de la opción seleccionada.

## Dependencias
- Angular Material (iconos, lista y sidenav/drawer).
- Router de Angular para navegación entre páginas.

## Criterios de aceptación
1. Existe botón hamburguesa en la parte izquierda del header.
2. Al pulsarlo, se abre menú lateral de Angular Material.
3. El menú tiene 2 entradas: `Dashboard` (icono dashboard) y `Cuenta anual` (icono calculadora).
4. `Dashboard` navega a una página vacía.
5. `Cuenta anual` navega a la página con la lógica de nóminas actual.
6. El menú se cierra al seleccionar una opción y se mantiene resaltada la opción activa.
