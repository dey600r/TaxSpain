---
name: payroll-formula-audit
description: "Usar cuando necesites revisar formulas de nomina, comparar reglas funcionales con servicios Angular, detectar desalineaciones entre documentacion y codigo, o sincronizar cambios funcionales en calculos mensuales y anuales."
---

# Payroll Formula Audit

## Objetivo

Revisar una formula o feature funcional de nomina y comprobar que:
1. la documentacion funcional esta clara,
2. la implementacion Angular sigue esa regla,
3. los acumulados y el resumen anual siguen siendo coherentes,
4. la documentacion queda sincronizada si se modifica el comportamiento.

## Cuándo usar este skill

Usar cuando la tarea incluya alguno de estos casos:
- revisar calculos de nomina,
- comparar una formula de documentacion con codigo,
- depurar diferencias entre mensual y anual,
- validar acumulados,
- actualizar documentacion funcional despues de cambiar calculos,
- revisar impactos de una regla de IRPF o Seguridad Social.

## Entradas esperadas

La petición del usuario debería incluir, si es posible:
- feature afectada,
- comportamiento esperado,
- fichero funcional de referencia,
- datos de ejemplo,
- si el problema es mensual, anual o ambos.

## Flujo de trabajo

1. Leer el contexto del repositorio en este orden:
   - AGENTS.md
   - docs/dev-rules.md
   - docs/0-req-global-rules.md
   - docs/1-req-nominas-rules/00-index.md
   - feature mensual o anual afectada

2. Identificar el punto de cálculo real en el código:
   - servicio Angular responsable,
   - modelos implicados,
   - constantes usadas,
   - componentes que consumen el resultado.

3. Comparar documentación y código:
   - fórmula,
   - inputs,
   - outputs,
   - dependencias cruzadas,
   - casos borde,
   - comportamiento de redondeo y ceros.

4. Detectar desalineaciones:
   - fórmula distinta,
   - dependencia ausente,
   - caso borde no cubierto,
   - nombre de campo inconsistente,
   - documentación obsoleta.

5. Si se implementan cambios:
   - actualizar código,
   - actualizar documentación funcional afectada,
   - validar con prueba o comprobación focalizada.

## Salida esperada

La respuesta final debe incluir:
- feature revisada,
- archivos inspeccionados,
- inconsistencias encontradas,
- decisión tomada,
- cambios aplicados si los hubo,
- validación ejecutada,
- riesgos pendientes.

## Reglas específicas del skill

1. No simplificar fórmulas sin validación funcional explícita.
2. No tocar features no relacionadas.
3. Si cambia una fórmula mensual, revisar impacto en acumulados y resumen anual.
4. Si cambia una regla anual, revisar si modifica parámetros consumidos por meses.
5. Si la documentación contradice al código, indicar cuál debe tratarse como fuente de verdad según AGENTS.md.

## Checklist mínimo

- ¿La fórmula está documentada?
- ¿El servicio correcto la implementa?
- ¿Los inputs tienen el mismo significado?
- ¿Los acumulados usan el mismo resultado?
- ¿La UI muestra un estado seguro cuando hay división por cero?
- ¿La documentación quedó sincronizada?

## No usar este skill para

- cambios puramente visuales,
- refactors sin lógica de negocio,
- tareas de scaffolding,
- cambios de dependencias,
- diseño de componentes sin cálculo funcional.