
# Reglas funcionales globales

## 1. Propósito de la aplicación

Esta aplicación permite introducir los datos de nómina del usuario mes a mes para calcular el impacto fiscal anual y estimar el resultado final del IRPF en España.

El objetivo no es solo representar una nómina mensual, sino modelar la vida fiscal anual del usuario a partir de:
- ingresos periódicos,
- pagas extra,
- cotizaciones sociales,
- retenciones IRPF,
- acumulados anuales,
- configuración fiscal final.

## 2. Alcance global del dominio

La aplicación modela un único ejercicio fiscal anual.

Ese ejercicio anual está compuesto por:
- meses ordinarios,
- pagas extra,
- un resumen anual final.

La estructura detallada de cada sección mensual y del resumen anual se define en:
- docs/1-req-nominas-rules/00-index.md
- docs/1-req-nominas-rules/10-monthly/
- docs/1-req-nominas-rules/20-annual-summary/

## 3. Modelo de datos canónico

Modelo conceptual mínimo:

- `year`
    - `months`
        - `employee`
        - `salary`
        - `benefits`
        - `taxes`
    - `annualSummary`
        - `socialSecurityConfig`
        - `irpfStateConfig`
        - `irpfRegionalConfig`
        - `taxExemptions`
        - `contributionBase`
        - `finalTaxResult`

### Reglas del modelo
1. Todos los meses pertenecen a un único año fiscal.
2. Los acumulados anuales dependen del orden temporal de los meses.
3. Las pagas extra forman parte del mismo ejercicio anual.
4. La configuración anual afecta a los cálculos finales y, en algunos casos, alimenta cálculos mensuales.

## 4. Invariantes transversales

Estas reglas aplican a toda la aplicación, independientemente de la feature concreta.

1. El cálculo anual debe ser coherente con la suma de los cálculos mensuales.
2. Cualquier cambio en datos de un mes debe propagarse a sus acumulados y al resumen anual.
3. Ninguna división por cero debe romper la interfaz ni producir errores visibles al usuario.
4. Cuando un cálculo no sea aplicable, la UI debe mostrar `0`, vacío controlado o un estado seguro equivalente.
5. Las fórmulas no deben simplificarse sin validación funcional explícita.
6. Los cálculos deben preservar trazabilidad entre origen mensual y resultado anual.
7. La aplicación debe tolerar cambios de contexto durante el año sin romper el acumulado.

## 5. Casos borde transversales

Estos casos afectan a varias áreas del dominio y no solo a una feature concreta.

1. Cambios de Comunidad Autónoma durante el año.
2. Ingresos anuales por debajo del mínimo personal.
3. Divisiones por cero en cálculos porcentuales.
4. Reglas distintas entre meses ordinarios y pagas extra.
5. Recalculo en cascada cuando cambia un dato con impacto acumulado.

## 6. Fuera de alcance actual o pendiente de modularización

Estos temas no deben mezclarse con la lógica principal de nóminas mientras no tengan estructura propia:

- pérdidas patrimoniales,
- compensación entre ganancias y pérdidas,
- inversiones u otros productos financieros,
- reglas específicas de entidades concretas,
- dominios fiscales no relacionados con nómina.

Si en el futuro se implementan, deben vivir en un módulo funcional separado.

## 7. Relación con otros documentos

### Fuente de detalle funcional
- docs/1-req-nominas-rules/00-index.md
- docs/1-req-nominas-rules/10-monthly/
- docs/1-req-nominas-rules/20-annual-summary/

### Fuente de reglas técnicas
- docs/dev-rules.md

## 8. Principio de mantenimiento documental

Este documento debe mantenerse corto y estable.

Su función es definir:
- contexto transversal,
- invariantes globales,
- límites del dominio,
- relación entre módulos.

No debe contener:
- fórmulas detalladas por tabla,
- layout detallado por pantalla,
- comportamiento específico de una única feature,
- duplicación de reglas ya documentadas en módulos funcionales.