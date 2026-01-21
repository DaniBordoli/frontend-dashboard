# Ruta y Campo (Dashboard) — Features

## Objetivo
Hacer que los viajes salgan: absorber el desorden operativo, cuidar el vínculo con productores y transportistas, y controlar el riesgo económico.

---

## MUST (imprescindibles)
### Gestión de actores
- ABM Productores
  - Datos de empresa
  - Accesos a plataforma
- ABM Transportistas
  - Datos de empresa
  - Datos transportista
  - Datos de camión

### Condiciones generales
- Gestión de tarifas base

### Gestión de viajes
- Vista de viajes por:
  - Estado
  - Fecha
  - Productor
- Estados de viaje:
  - Solicitado (productor)
  - Cotizando (Ruta y Campo está validando y negociando)
  - Confirmado (precio y condiciones cerradas)
  - En asignación (buscando camiones)
  - En curso
  - Finalizado

### Dashboard operativo
Vista rápida de:
- Pedidos sin cotizar
- Pedidos confirmados sin camión
- Viajes con adelantos abiertos
- Viajes en riesgo hoy

### Adelantos y combustible
Registro de adelantos por viaje:
- Tipo (adelanto / combustible)
- Monto
- Fecha
- Transportista
- Estado del adelanto:
  - Autorizado
  - Entregado

### Gestión de viajes no cubiertos
- Alertas:
  - Viaje sin cubrir
  - Adelanto sin cerrar

### Precios
- **Precio base**
  - Tabla interna
  - Visible al productor como referencia
- **Precio confirmado**
  - Lo define Ruta y Campo
  - Se comunica al productor
- **Precio final**
  - Se registra al cerrar el viaje
  - Puede incluir ajustes

---

## SHOULD (deseables)
### Gestión de cuentas
- Estados de cuenta por transportista
- Viajes realizados
- Adelantos otorgados

### Histórico de viajes
- Filtros avanzados
- Notas internas

---

## COULD (opcionales)
### Métricas simples
- Cantidad de viajes
- Volumen

### Export a Excel

### Registro de incidentes
- Registrar incidentes sobre viajes
- Errores de importes de incidentes por transportista / productor

### Etiquetas internas
- Catalogar players

### Trackeo
- Gestión y optimización de rutas
- Trackeo de rutas
