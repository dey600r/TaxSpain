# Reglas de desarrollo

## Arquitectura
- Separar lógica de negocio de la UI
- Usar funciones puras para cálculos
- Centralizar cálculos en servicios de angular en /core/services
    - Calculos de las tab de los meses de cada nomina se guardan dentro de /core/services/month-form.service.ts
    - Calculos de la tab de IRPF se guardan dentro de /core/services/irpf-form.service.ts
    - Calculos de la tab de inversiones se guardan dentro de /core/services/investment-form.service.ts
- Cada dto o model debe estar en un archivo separado en la carpeta /core/models
- No usar cadenas de caracteres fijas, utilizar siempre constantes en la carpeta /core/utils/constants.ts
- Los componentes que se usen como compartidos entre componentes que se creen en la carpeta de /shared
- Las paginas deben ir en la carpeta /pages

## Estilo de código
- Nombres descriptivos (no abreviaturas)
- Evitar duplicación de lógica

## Layout global
- Crear un header fijo de 50 px de alto que permanezca visible durante el scroll
- El dashboard principal debe mantener margenes laterales aproximados del 10%
- La vista anual debe mostrar el año activo y una estructura principal preparada para navegar entre ejercicios
- Las secciones mensuales y el resumen anual deben vivir dentro de la misma vista anual como bloques consistentes

## Validaciones
- Validar todos los inputs numéricos
- Manejar errores explícitamente
- En tablas, todos los campos editables deben mostrarse con valor + icono de lapicero a la derecha, y la edición debe hacerse en un panel flotante (no con input inline).

## Integración con lógica (Excel)
- Las fórmulas deben replicar exactamente los siguientes ficheros:
    - 0-req-global-rules.md: Contexto transversal de la aplicacion
    - 1-req-nominas-rules/00-index.md: Mapa funcional de nóminas
    - 1-req-nominas-rules/10-monthly/: Lógica mensual por feature
    - 1-req-nominas-rules/20-annual-summary/: Lógica anual por feature
    - 1-req-nominas-rules/30-yearly/: Lógica de pestañas por año y aislamiento multiejercicio
- No simplificar cálculos sin validar

## Comportamiento esperado de la IA
- Explicar antes de hacer cambios grandes
- No asumir valores por defecto sin indicarlo
- Debe ir actualizando el funcional en los archivos .md automaticamente a la vez que el código para estar siempre sincronizado