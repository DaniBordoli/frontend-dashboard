# Transportistas — Features

## Objetivo
Conseguir viajes rápido, confirmar disponibilidad sin vueltas y reportar hitos del viaje vía WhatsApp.

---

## MUST (imprescindibles)
### Recibir ofertas de viaje
Recepción estructurada de viaje con:
- ❌ Origen
- ❌ Destino
- ❌ Fecha / ventana
- ❌ Pago
- ❌ Notas adicionales
- ❌ Datos del viaje:
  - ❌ Tiempo
  - ❌ Distancia

### Respuestas cerradas
- ❌ "Confirmo X camiones"
- ❌ "No tengo disponibilidad"

### Inicio de viaje
Recibir información completa del viaje:
- ❌ ID de pedido
- ❌ ID de viaje
- ❌ Origen
- ❌ Destino
- ❌ Fecha / ventana
- ❌ Valor
- ❌ Notas adicionales
- ❌ Datos del viaje:
  - ❌ Tiempo
  - ❌ Distancia
- ❌ Carta de porte

### Manejo de estados (check-ins)
- ❌ Llegué a cargar
- ❌ Cargado
- ❌ Salí
- ❌ Descargué

### Estado en tiempo real
- ❌ Reporte de ubicación para tracking del viaje

---

## SHOULD (deseables)
### Notificaciones de cambios
- ❌ Recibir cambios de los pedidos de viaje

### Historial de viajes
- ❌ Descargar XLS con viajes de la semana / mes / período

### Gestión de adelantos
- ❌ Mensaje informativo de adelanto/combustible autorizado
- ❌ Flujo de pedido de adelanto

---

**NOTA**: Todo el módulo de Transportistas requiere implementación del WhatsApp Bot (Twilio). Backend tiene endpoints preparados pero falta integración completa.
