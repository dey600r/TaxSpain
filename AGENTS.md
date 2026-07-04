## Mapa de contenido para agentes

### 1) Orden de lectura obligatorio
1. ai/10-agent-contract.md
2. ai/20-precedence-and-conflicts.md
3. docs/dev-rules.md
4. docs/0-req-global-rules.md
5. docs/0-req-header/10-header-right.md
6. docs/0-req-header/11-header-left.md
7. docs/1-req-nominas-rules/00-index.md
- Luego: docs/1-req-nominas-rules/10-monthly/, /20-annual-summary/ y /30-yearly/ según tarea
8. ai/50-playbooks/*

### 2) Fuentes de verdad
- Reglas técnicas: docs/dev-rules.md
- Reglas funcionales globales: docs/0-req-global-rules.md
- Reglas funcionales de header:
	- docs/0-req-header/10-header-right.md
	- docs/0-req-header/11-header-left.md
- Reglas funcionales nóminas: docs/1-req-nominas-rules/ (estructura modular)
	- Índice: docs/1-req-nominas-rules/00-index.md
	- Features mensuales: docs/1-req-nominas-rules/10-monthly/ (11-employee-data a 17-partitions-chart)
	- Features anuales: docs/1-req-nominas-rules/20-annual-summary/ (21-configuration a 28-results-chart)
	- Features multiejercicio: docs/1-req-nominas-rules/30-yearly/ (31-years-tab)

### 3) En caso de conflicto
- Aplicar ai/20-precedence-and-conflicts.md

### 4) Resultado mínimo esperado de cualquier tarea
- Cambios de código
- Verificación ejecutada o justificación de por qué no se pudo ejecutar
- Actualización documental en ai/ o docs/ si procede
- Resumen final con archivos tocados y riesgos pendientes
