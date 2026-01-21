# Ruta y Campo — Documento MVP

## Objetivo del sistema
Sistema de **orquestación asistida de viajes** para logística rural, que centraliza pedidos, estados y documentación en un solo flujo, sin reemplazar la negociación humana.

Principios:
- Centralizar pedidos, estados y documentación.
- Mostrar precio base estimado y luego confirmar un precio final (evitar pedidos “a ciegas”).
- Reemplazar promesas informales por confirmaciones estructuradas y check-ins vía WhatsApp.
- Registrar adelantos, combustible y estado de pagos por viaje.
- Absorber la complejidad entre productores y transportistas sin imponer un marketplace artificial.

> **La tecnología no reemplaza la negociación, la hace visible, trazable y controlable.**

---

## Actores
- **Productores (Web Responsive)**: crean pedidos, ven precios y hacen seguimiento.
- **Ruta y Campo (Dashboard Web)**: valida pedidos, define precio final, coordina y monitorea viajes.
- **Transportistas (WhatsApp Bot)**: reciben ofertas, confirman disponibilidad y realizan check-ins.

---

## Features del MVP (todo incluido)
### Productores (Web)
- Registro / Login
- Crear pedido con formulario:
  - Origen / Destino
  - Puerto / Acopio
  - Fecha / ventana
  - Tipo de carga (ej. grano)
  - Peso (toneladas)
  - Cantidad de camiones
  - Carta de porte (cuando aplique)
  - Notas adicionales
- Ver **precio base** del servicio
- Proponer nueva tarifa
- Ver estado del pedido
- Seguimiento del viaje (check-ins)
- Ver historial de pedidos

### Ruta y Campo (Dashboard)
- Bandeja de pedidos
- Validar condiciones del pedido
- Ajustar y confirmar tarifa final
- Cambiar estados del pedido
- Disparar ofertas a transportistas por WhatsApp
- Monitoreo del viaje y check-ins
- Registrar adelantos / combustible / pagos
- Cierre de viaje

### Transportistas (WhatsApp Bot)
- Recibir ofertas con información completa del pedido
- Responder disponibilidad y cantidad de camiones
- Aceptar viaje
- Enviar check-ins durante el viaje:
  - Llegué a cargar
  - Cargado
  - Salí
  - Descargué
- Cerrar viaje

---

## Estados del pedido / viaje
- **Solicitado**
- **Cotizando**
- **Confirmado**
- **En asignación**
- **En curso**
- **Finalizado**

---

## Flujo end-to-end
1. **Productor (web)**
   - Crea pedido
   - Ve precio base estimado
   - Estado: **Solicitado**

2. **Ruta y Campo (dashboard)**
   - Aprueba pedido
   - Estado pasa a **Cotizando**
   - Operador valida condiciones y ajusta precio
   - Estado pasa a **Confirmado**
   - Precio confirmado visible para productor

3. **Ruta y Campo (dashboard)**
   - Estado: **En asignación**
   - Sistema dispara ofertas por WhatsApp

4. **Transportistas (bot)**
   - Reciben oferta
   - Estado: **En curso**
   - Aceptan viaje
   - Envían check-ins durante el viaje

5. **Ruta y Campo (dashboard)**
   - Registra adelantos / combustible
   - Monitorea estados

6. **Transportistas (bot)**
   - Cierra viaje
   - Estado: **Finalizado**

7. **Productor (web)**
   - Recibe alerta de finalización

---

## Ecosistema de productos
- **Productores:** Web Responsive
- **Ruta y Campo:** Dashboard Web
- **Transportistas:** Chatbot WhatsApp

---


