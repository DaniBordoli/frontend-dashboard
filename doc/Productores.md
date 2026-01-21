# Productores — Features

## Objetivo
Permitir pedir camiones rápido, conocer un costo aproximado y dar tranquilidad sobre el seguimiento del viaje.

---

## MUST (imprescindibles)
### Iniciar sesión
- ✅ Login / recuperación de contraseña.

### Pedir transporte
Formulario de pedido de viaje con:
- ✅ Origen
- ✅ Destino
- ✅ Puerto / Acopio
- ✅ Fecha / ventana
- ✅ Tipo de carga (grano)
- ✅ Peso (tn)
- ✅ Cantidad de camiones recomendada
- ✅ Cantidad de camiones pedidos
- ⚠️ Carta de porte (ARCA) - Campo disponible, falta upload
- ⚠️ Cupo (Puerto) - Campo disponible, falta upload
- ✅ Notas adicionales

### Costo estimado
- ✅ Ver precio base del servicio
- ✅ Proponer nueva tarifa (negociación)

### Ver estado de los viajes (estados del pedido)
- ✅ Solicitado
- ✅ Cotizando (Ruta y Campo está validando y negociando)
- ✅ Confirmado (precio y condiciones cerradas)
- ✅ En asignación (buscando camiones)
- ✅ En curso
- ✅ Finalizado

### Ver estado de los viajes (notificaciones)
- ❌ Notificaciones de cambio de estado (mail / WhatsApp)
- ✅ Aceptación del viaje (visible en detalle)
- ✅ Inicio del viaje (visible en estado)
- ✅ Finalización (visible en estado)

### Tracking
- ✅ Seguimiento en tiempo real (check-ins visibles)
- ✅ Detalle de descarga (check-ins)

---

## SHOULD (deseables)
### Pedidos frecuentes
- ❌ Plantillas de viajes frecuentes (origen, destino, tipo de carga, etc.)

### Historial de pedidos
- ✅ Ver historial con filtros, orden y detalle de viaje

### Editar viajes
- ❌ Edición / cancelación antes de la aceptación

---

## COULD (opcionales)
### Exportar
- ❌ Descargar comprobantes
- ❌ Export simple (PDF / CSV)

---

## 📊 Estado Actual

**✅ IMPLEMENTADO (95%)**
- Sistema de autenticación completo
- Dashboard con estadísticas
- Formulario de solicitud de viaje completo
- Vista de mis viajes con filtros y búsqueda
- Vista detallada de cada viaje
- Sistema de propuesta de precio
- Visualización de check-ins
- Visualización de transportista asignado
- Responsive design completo

**⚠️ PENDIENTE**
- Upload de documentos (carta de porte, cupo)
- Sistema de notificaciones push
- Edición/cancelación de viajes
- Plantillas de viajes frecuentes

**Nota**: El frontend está funcional y listo para usar. Solo faltan features secundarias.
