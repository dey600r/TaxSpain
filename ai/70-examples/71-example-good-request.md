# Ejemplo de petición buena

Objetivo:
Implementar cálculo automático de prorrata extras en resumen mensual.

Alcance:
Incluye servicio de cálculo mensual y renderizado de valor en tabla resumen.
Excluye cambios en resumen anual.

Criterios de aceptación:
1. Prorrata = (total salario base * pagas extra) / 12.
2. Si pagas extra es 0, resultado 0.
3. No rompe cálculos existentes de bruto, deducciones y neto.

Restricciones:
1. Sin lógica en template.
2. Reutilizar constantes existentes.
3. Mantener validación numérica.

Verificación:
1. Prueba con datos nominales.
2. Prueba con pagas extra = 0.
3. Prueba con valores decimales.