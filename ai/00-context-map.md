# Context map del proyecto

## Objetivo de producto
Aplicación para modelar nómina mensual y cálculo anual de IRPF en España.

## Estructura funcional
- 12 meses + Extra1 + Extra2 + Resumen
- Cálculo de nómina mensual
- Cálculo de acumulados
- Resumen anual de IRPF y Seguridad Social

## Estructura técnica actual
- Framework: Angular
- Lógica de cálculo centralizada en servicios de core/services
- Modelos en core/models
- Constantes en core/utils/constants.ts
- Componentes compartidos en shared
- Páginas en pages