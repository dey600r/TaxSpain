# Precedencia y resolución de conflictos

## Orden de precedencia
1. Seguridad y restricciones del sistema de ejecución
2. Contrato del agente (ai/10-agent-contract.md)
3. Reglas técnicas (docs/dev-rules.md)
4. Reglas funcionales (docs/0-req-global-rules.md y docs/1-req-nominas-rules.md)
5. Playbook de tarea en curso

## Reglas de resolución
1. Si una regla técnica contradice una funcional, se documenta la incidencia y se pide decisión.
2. Si hay inconsistencia de versión o arquitectura, gana la configuración real del proyecto hasta que se actualice la documentación.
3. Ninguna simplificación de fórmula sin validación explícita.