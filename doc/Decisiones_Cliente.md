# Decisiones del cliente (respuestas a dudas)

## Productores (Web)
- **Acceso:** Un solo usuario por empresa (sin roles internos por ahora).
- **Campos obligatorios:** Todos excepto `cupo` (solo si va a acopio) y `notas`.
- **Precio base:** Lo carga R&C manualmente en el dashboard. Aún no definido si es por km, tonelada u otro criterio.
- **Negociación:** 
  - Sistema calcula precio base y lo muestra.
  - Productor puede proponer nuevo precio.
  - R&C recibe propuesta junto al pedido.
  - Negocian por fuera.
  - R&C actualiza con precio confirmado (visible para productor).
- **Notificaciones:** Mail + WhatsApp.
- **Tracking:** Tendencia a minuto a minuto (live tracking).
- **Documentos:** PDF únicamente (cupo y carta de porte).

## Transportistas (WhatsApp Bot)
- **Ofertas:** Se envían a todos los transportistas disponibles. Desafío: saber disponibilidad real.
  - Opción 1: camiones se anotan como disponibles cada día.
  - Opción 2: se envía a todos menos los que tienen viaje en curso.
  - R&C puede "apagar" camioneros (ej: vacaciones) desde dashboard.
- **Confirmaciones:** No se acepta confirmación parcial en esta versión.
- **Inicio de viaje:** Mostrar toda la info del pedido excepto precios.
- **Check-ins:** Todos son obligatorios (educar al usuario). Flujo unificado puerto/acopio por ahora.
- **Ubicación:** Tiempo real.
- **Adelantos:** Fuera de plataforma. R&C puede asentarlo después en el dashboard (fuera del MVP).

## Ruta y Campo (Dashboard)
- **ABM actores:** Cualquier usuario puede dar de alta productores/transportistas.
- **Tarifas base:** Valor manual ingresado por R&C. Pendiente definir fórmula para precio final.
- **Confirmación de precio:** Todos los perfiles pueden editar/aprobar.
- **Dashboard operativo:** Alertas críticas a definir (ej: pedido cercano a fecha sin camiones confirmados).
- **Adelantos:** No entra en esta versión.
- **Viajes sin cubrir:** Tiempo de alerta a definir.
- **Roles internos:** Superadmin + Operador (permisos casi iguales).

## Flujo general y estados
- **Transiciones:** Ninguna se puede saltear ni revertir. Si productor no propone precio, no hay estado "en negociación".
- **Asignación:** 
  - Sistema dispara oferta a todos los transportistas.
  - Primero que confirma queda asignado automáticamente.
  - Considerando cola de espera (a charlar).
- **Auditoría:** Todo debe tener trazabilidad.

---

## Decisiones técnicas derivadas
- **Tracking:** Opción 3 (link web ligero) para tracking continuo sin app.
- **WhatsApp API:** Paga (por conversación). Proveedores: Twilio, 360dialog, etc.
- **Asignación:** FCFS (first-come-first-served) automática.
- **Roles simplificados:** `productor | rc_superadmin | rc_operador | transportista`.
- **Adelantos fuera del MVP:** Se elimina del modelo inicial.
