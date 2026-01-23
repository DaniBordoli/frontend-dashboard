# 📍 Sistema de Live Tracking GPS - Documentación Completa

## 📋 Índice
1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Flujo Completo End-to-End](#flujo-completo-end-to-end)
4. [Componentes Implementados](#componentes-implementados)
5. [API Endpoints](#api-endpoints)
6. [Modelo de Datos](#modelo-de-datos)
7. [Configuración y Deploy](#configuración-y-deploy)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Resumen Ejecutivo

### ¿Qué es?
Sistema de tracking GPS en tiempo real para monitorear la ubicación de transportistas durante viajes de carga, con el objetivo de prevenir robos y desvíos no autorizados.

### Tecnologías Utilizadas
- **Frontend PWA**: React + Vite + Leaflet (mapas)
- **Backend**: Node.js + Express + MongoDB
- **Tiempo Real**: Socket.io (WebSocket)
- **Geolocalización**: HTML5 Geolocation API
- **Navegación**: Integración con Google Maps

### Características Principales
✅ Tracking automático cada 10 minutos  
✅ Mapa interactivo con ruta A→B  
✅ Integración con Google Maps para navegación  
✅ Visualización en tiempo real en dashboard  
✅ Historial completo de rutas  
✅ Wake Lock para mantener pantalla activa  
✅ Un solo botón para iniciar (fricción mínima)  

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    TRANSPORTISTA (Celular)                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         PWA de Tracking (frontend-tracking)            │ │
│  │  - Mapa Leaflet con ruta A→B                          │ │
│  │  - Botón "Iniciar Viaje"                              │ │
│  │  - Geolocalización cada 10 min                        │ │
│  │  - Integración Google Maps                            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP POST
                    (cada 10 minutos)
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js)                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Tracking Controller                       │ │
│  │  - Recibe ubicación GPS                               │ │
│  │  - Actualiza ubicacionActual                          │ │
│  │  - Guarda en rutaCompleta[]                           │ │
│  │  - Emite evento WebSocket                             │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              MongoDB (Viaje Model)                     │ │
│  │  - trackingToken                                       │ │
│  │  - trackingActivo                                      │ │
│  │  - ubicacionActual { lat, lng, timestamp }            │ │
│  │  - rutaCompleta [{ lat, lng, timestamp, speed }]      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓ WebSocket
                    (tiempo real)
┌─────────────────────────────────────────────────────────────┐
│                 ADMIN/PRODUCTOR (Dashboard)                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Dashboard (frontend-dashboard)                 │ │
│  │  - Lista de viajes en curso                           │ │
│  │  - Botón "Ver Tracking" (ícono navegación)            │ │
│  │  - Modal con mapa en tiempo real                      │ │
│  │  - Ruta completa recorrida (línea verde)              │ │
│  │  - Ubicación actual del camión                        │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo Completo End-to-End

### **Fase 1: Creación del Viaje**

```
1. ADMIN crea viaje en Dashboard
   └─> Completa formulario con:
       - Origen (ciudad, provincia, coordenadas)
       - Destino (ciudad, provincia, coordenadas)
       - Fecha, peso, camiones, etc.

2. ADMIN asigna transportista
   └─> Selecciona transportista de la lista
   └─> Estado cambia a "en_asignacion"

3. ADMIN envía oferta por WhatsApp
   └─> Toca botón "Enviar Oferta"
   └─> Transportista recibe mensaje con detalles del viaje
```

### **Fase 2: Confirmación del Viaje**

```
4. TRANSPORTISTA recibe WhatsApp
   ┌─────────────────────────────────────────┐
   │ 🚛 OFERTA DE VIAJE                      │
   │                                         │
   │ Viaje #VJ-000002                        │
   │ Pergamino, BA → Rosario, SF             │
   │ Fecha: 25/01/2026                       │
   │ Carga: 30 tn de soja                    │
   │ Precio: $150,000                        │
   │                                         │
   │ Responde:                               │
   │ 1 - Confirmar viaje                     │
   │ 2 - Rechazar viaje                      │
   └─────────────────────────────────────────┘

5. TRANSPORTISTA responde "1"
   └─> Backend genera trackingToken único
   └─> Estado cambia a "en_curso"
   └─> Envía link de tracking por WhatsApp
```

### **Fase 3: Inicio del Tracking**

```
6. TRANSPORTISTA recibe link de tracking
   ┌─────────────────────────────────────────┐
   │ ✅ Viaje Confirmado                     │
   │                                         │
   │ Link de tracking:                       │
   │ https://tracking.app/ABC123             │
   │                                         │
   │ Abrí el link para comenzar el viaje    │
   └─────────────────────────────────────────┘

7. TRANSPORTISTA toca link
   └─> Abre PWA en navegador del celular
   └─> Ve pantalla de tracking:
   
   ┌─────────────────────────────────────────┐
   │ 🚛 Tracking GPS                         │
   │ Viaje #VJ-000002                        │
   ├─────────────────────────────────────────┤
   │ 🗺️ [MAPA INTERACTIVO]                  │
   │                                         │
   │ 📍 Pergamino, BA (origen)               │
   │ ─────────────────── (ruta)              │
   │ 📍 Rosario, SF (destino)                │
   ├─────────────────────────────────────────┤
   │ Origen: Pergamino, BA                   │
   │ Destino: Rosario, SF                    │
   │ Fecha: 25/01/2026                       │
   │ Estado: en_curso                        │
   ├─────────────────────────────────────────┤
   │                                         │
   │   [INICIAR VIAJE] 🚀                    │
   │   Activa tracking y abre Maps           │
   │                                         │
   ├─────────────────────────────────────────┤
   │ ℹ️ Cómo usar                            │
   │ 1. Toca "Iniciar Viaje"                 │
   │ 2. Navega con Google Maps               │
   │ 3. Mantén esta pantalla abierta         │
   └─────────────────────────────────────────┘

8. TRANSPORTISTA toca "Iniciar Viaje"
   └─> Solicita permisos de GPS (primera vez)
   └─> Acepta permisos
   └─> Backend: trackingActivo = true
   └─> Google Maps se abre automáticamente
   └─> Navegación turn-by-turn activada
```

### **Fase 4: Durante el Viaje**

```
9. TRANSPORTISTA navega con Google Maps
   └─> Usa Google Maps normalmente
   └─> Puede minimizar navegador (pero no cerrar)
   └─> PWA sigue funcionando en background

10. PWA envía ubicación automáticamente
    └─> Cada 10 minutos:
        ├─> Obtiene ubicación GPS actual
        ├─> POST /api/tracking/viaje/:token/location
        ├─> Backend guarda en DB
        └─> Backend emite evento WebSocket
    
    └─> Pantalla muestra:
        ┌─────────────────────────────────────┐
        │ ✅ Tracking Activo                  │
        │                                     │
        │ Lat: -33.456789                     │
        │ Lon: -60.123456                     │
        │ Velocidad: 85.3 km/h                │
        │ Precisión: 12 m                     │
        ├─────────────────────────────────────┤
        │ Actualizaciones enviadas: 15        │
        │ Última: 14:35:22                    │
        ├─────────────────────────────────────┤
        │ ⏰ Próxima actualización en:        │
        │        9:45                         │
        └─────────────────────────────────────┘

11. ADMIN/PRODUCTOR monitorea en Dashboard
    └─> Dashboard → Página Viajes
    └─> Ve viaje "en_curso" con ícono 🧭
    └─> Toca ícono → Abre modal
    
    └─> Modal muestra:
        ┌─────────────────────────────────────┐
        │ 🚛 Tracking en Vivo                 │
        │ Viaje #VJ-000002                    │
        ├─────────────────────────────────────┤
        │ 🗺️ [MAPA TIEMPO REAL]              │
        │                                     │
        │ 📍 Origen                           │
        │ ━━━━━━━━━━━━━ (ruta recorrida)     │
        │ 🚛 Ubicación actual                 │
        │ ─ ─ ─ ─ ─ ─ (ruta pendiente)       │
        │ 📍 Destino                          │
        ├─────────────────────────────────────┤
        │ Tracking: ✅ Activo                 │
        │ Última actualización: 14:35:22      │
        │ Puntos registrados: 15              │
        └─────────────────────────────────────┘
    
    └─> Mapa se actualiza automáticamente cada 10 min
        (vía WebSocket)
```

### **Fase 5: Check-ins del Transportista**

```
12. TRANSPORTISTA hace check-ins por WhatsApp
    └─> Llega a cargar: Responde "1"
    └─> Cargado saliendo: Responde "2"
    └─> En camino: Responde "3"
    └─> Llegó a destino: Responde "4"
    └─> Descargado: Responde "5"
    
    └─> Cada check-in actualiza subEstado en DB
    └─> Dashboard muestra sub-estado actualizado
```

### **Fase 6: Finalización del Viaje**

```
13. TRANSPORTISTA llega a destino
    └─> Hace check-in "Descargado" (5)
    └─> Toca "Detener Tracking" en PWA
    └─> Backend: trackingActivo = false
    └─> Estado cambia a "finalizado"

14. ADMIN/PRODUCTOR revisa historial
    └─> Dashboard → Viaje finalizado
    └─> Puede ver ruta completa recorrida
    └─> Puede exportar datos (futuro)
```

---

## 🗂️ Componentes Implementados

### **Backend (rutaycampo-backend)**

#### **1. Modelo de Datos**
**Archivo:** `src/models/Viaje.model.js`

```javascript
// Campos agregados para tracking:
{
  trackingToken: {
    type: String,
    unique: true,
    sparse: true
  },
  trackingActivo: {
    type: Boolean,
    default: false
  },
  ubicacionActual: {
    latitud: Number,
    longitud: Number,
    ultimaActualizacion: Date
  },
  rutaCompleta: [{
    latitud: Number,
    longitud: Number,
    timestamp: {
      type: Date,
      default: Date.now
    },
    velocidad: Number,
    precision: Number
  }]
}
```

#### **2. Controlador de Tracking**
**Archivo:** `src/controllers/tracking.controller.js`

**Funciones principales:**
- `generateTrackingToken(viajeId)` - Genera token único para tracking
- `getViajeByToken(token)` - Obtiene info del viaje por token
- `startTracking(token)` - Inicia tracking (trackingActivo = true)
- `stopTracking(token)` - Detiene tracking (trackingActivo = false)
- `updateLocation(token, location)` - Recibe y guarda ubicación GPS
- `getRuta(viajeId)` - Obtiene ruta completa del viaje

#### **3. Rutas de Tracking**
**Archivo:** `src/routes/tracking.routes.js`

```javascript
// Rutas públicas (usan token, no requieren auth)
GET    /api/tracking/viaje/:token              // Info del viaje
POST   /api/tracking/viaje/:token/start        // Iniciar tracking
POST   /api/tracking/viaje/:token/stop         // Detener tracking
POST   /api/tracking/viaje/:token/location     // Enviar ubicación

// Rutas protegidas (requieren auth)
POST   /api/tracking/:id/generate-token        // Generar token
GET    /api/tracking/:id/ruta                  // Obtener ruta completa
```

#### **4. WebSocket (Tiempo Real)**
**Archivo:** `src/server.js`

```javascript
// Eventos WebSocket:
socket.emit('join-trip', tripId)           // Cliente se une a sala
socket.on('tracking-started', data)        // Tracking iniciado
socket.on('tracking-stopped', data)        // Tracking detenido
socket.on('location-updated', data)        // Nueva ubicación
```

---

### **Frontend PWA (frontend-tracking)**

#### **1. Página de Tracking**
**Archivo:** `src/pages/TrackingPage.jsx`

**Componentes:**
- Mapa Leaflet con ruta A→B
- Marcadores de origen, destino y ubicación actual
- Botón "Iniciar Viaje" (activa tracking + abre Google Maps)
- Información en tiempo real (lat/lng, velocidad, precisión)
- Countdown hasta próxima actualización
- Contador de actualizaciones enviadas
- Instrucciones de uso

#### **2. Hook de Geolocalización**
**Archivo:** `src/hooks/useGeolocation.js`

**Funcionalidad:**
- Solicita permisos de GPS
- Obtiene ubicación cada 10 minutos
- Maneja errores de GPS
- Retorna: `{ location, error, permission, nextUpdate }`

**Configuración:**
```javascript
const UPDATE_INTERVAL = 10 * 60 * 1000; // 10 minutos
```

#### **3. Servicio de Tracking**
**Archivo:** `src/services/tracking.service.js`

**Métodos:**
```javascript
getViajeByToken(token)          // Obtener info del viaje
startTracking(token)            // Iniciar tracking
stopTracking(token)             // Detener tracking
updateLocation(token, location) // Enviar ubicación
```

---

### **Frontend Dashboard (frontend-dashboard)**

#### **1. Modal de Tracking**
**Archivo:** `src/components/TrackingModal.jsx`

**Componentes:**
- Mapa Leaflet con ruta completa recorrida
- Marcadores de origen, destino y ubicación actual
- Información del viaje (origen, destino, estado)
- Estado del tracking (activo/inactivo)
- Última actualización y puntos registrados
- Actualización en tiempo real vía WebSocket

#### **2. Página de Viajes**
**Archivo:** `src/pages/Viajes.jsx`

**Modificaciones:**
- Botón de tracking (ícono 🧭) en viajes "en_curso"
- Integración con TrackingModal
- Filtro por estado de tracking

---

## 🔌 API Endpoints

### **Endpoints Públicos (Token-based)**

#### **GET /api/tracking/viaje/:token**
Obtiene información del viaje por token de tracking.

**Request:**
```
GET /api/tracking/viaje/abc123xyz
```

**Response:**
```json
{
  "viaje": {
    "_id": "507f1f77bcf86cd799439011",
    "numeroViaje": "VJ-000002",
    "origen": {
      "ciudad": "Pergamino",
      "provincia": "Buenos Aires",
      "coordenadas": {
        "latitud": -33.8897,
        "longitud": -60.5734
      }
    },
    "destino": {
      "ciudad": "Rosario",
      "provincia": "Santa Fe",
      "coordenadas": {
        "latitud": -32.9442,
        "longitud": -60.6505
      }
    },
    "trackingActivo": false,
    "ubicacionActual": null,
    "rutaCompleta": []
  }
}
```

---

#### **POST /api/tracking/viaje/:token/start**
Inicia el tracking del viaje.

**Request:**
```
POST /api/tracking/viaje/abc123xyz/start
```

**Response:**
```json
{
  "message": "Tracking iniciado exitosamente",
  "viaje": {
    "_id": "507f1f77bcf86cd799439011",
    "trackingActivo": true
  }
}
```

**WebSocket Event:**
```javascript
socket.emit('tracking-started', {
  viajeId: '507f1f77bcf86cd799439011',
  timestamp: '2026-01-23T14:30:00.000Z'
});
```

---

#### **POST /api/tracking/viaje/:token/stop**
Detiene el tracking del viaje.

**Request:**
```
POST /api/tracking/viaje/abc123xyz/stop
```

**Response:**
```json
{
  "message": "Tracking detenido exitosamente",
  "viaje": {
    "_id": "507f1f77bcf86cd799439011",
    "trackingActivo": false
  }
}
```

**WebSocket Event:**
```javascript
socket.emit('tracking-stopped', {
  viajeId: '507f1f77bcf86cd799439011',
  timestamp: '2026-01-23T18:45:00.000Z'
});
```

---

#### **POST /api/tracking/viaje/:token/location**
Envía ubicación GPS actual del transportista.

**Request:**
```json
POST /api/tracking/viaje/abc123xyz/location

{
  "latitude": -33.4567,
  "longitude": -60.1234,
  "speed": 23.6,
  "accuracy": 12.5
}
```

**Response:**
```json
{
  "message": "Ubicación actualizada exitosamente",
  "ubicacion": {
    "latitud": -33.4567,
    "longitud": -60.1234,
    "ultimaActualizacion": "2026-01-23T14:35:00.000Z"
  }
}
```

**WebSocket Event:**
```javascript
socket.emit('location-updated', {
  viajeId: '507f1f77bcf86cd799439011',
  ubicacion: {
    latitud: -33.4567,
    longitud: -60.1234,
    ultimaActualizacion: '2026-01-23T14:35:00.000Z'
  }
});
```

---

### **Endpoints Protegidos (Requieren Auth)**

#### **POST /api/tracking/:id/generate-token**
Genera token de tracking para un viaje.

**Request:**
```
POST /api/tracking/507f1f77bcf86cd799439011/generate-token
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "trackingToken": "abc123xyz",
  "trackingUrl": "https://tracking.app/abc123xyz"
}
```

---

#### **GET /api/tracking/:id/ruta**
Obtiene ruta completa del viaje.

**Request:**
```
GET /api/tracking/507f1f77bcf86cd799439011/ruta
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "viaje": {
    "_id": "507f1f77bcf86cd799439011",
    "numeroViaje": "VJ-000002",
    "rutaCompleta": [
      {
        "latitud": -33.8897,
        "longitud": -60.5734,
        "timestamp": "2026-01-23T14:00:00.000Z",
        "velocidad": 0,
        "precision": 10
      },
      {
        "latitud": -33.4567,
        "longitud": -60.1234,
        "timestamp": "2026-01-23T14:10:00.000Z",
        "velocidad": 85.3,
        "precision": 12
      }
    ]
  }
}
```

---

## 💾 Modelo de Datos

### **Viaje (Actualizado)**

```javascript
{
  // Campos existentes...
  numeroViaje: "VJ-000002",
  productor: ObjectId("..."),
  origen: {
    direccion: "Ruta 32 Km 45",
    ciudad: "Pergamino",
    provincia: "Buenos Aires",
    coordenadas: {
      latitud: -33.8897,
      longitud: -60.5734
    }
  },
  destino: {
    direccion: "Puerto San Martín",
    ciudad: "Rosario",
    provincia: "Santa Fe",
    coordenadas: {
      latitud: -32.9442,
      longitud: -60.6505
    }
  },
  estado: "en_curso",
  subEstado: "en_camino",
  transportista: ObjectId("..."),
  
  // ===== CAMPOS DE TRACKING =====
  trackingToken: "abc123xyz",           // Token único para acceso público
  trackingActivo: true,                 // Estado del tracking
  ubicacionActual: {                    // Última ubicación conocida
    latitud: -33.4567,
    longitud: -60.1234,
    ultimaActualizacion: ISODate("2026-01-23T14:35:00.000Z")
  },
  rutaCompleta: [                       // Historial completo de ubicaciones
    {
      latitud: -33.8897,
      longitud: -60.5734,
      timestamp: ISODate("2026-01-23T14:00:00.000Z"),
      velocidad: 0,
      precision: 10
    },
    {
      latitud: -33.4567,
      longitud: -60.1234,
      timestamp: ISODate("2026-01-23T14:10:00.000Z"),
      velocidad: 85.3,
      precision: 12
    }
    // ... más puntos cada 10 minutos
  ]
}
```

---

## ⚙️ Configuración y Deploy

### **Variables de Entorno**

#### **Backend (.env)**
```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017/rutaycampo

# JWT
JWT_SECRET=your_jwt_secret_key

# Server
PORT=5000
NODE_ENV=production

# CORS (agregar dominio de tracking PWA)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,https://tracking.tudominio.com
```

#### **Frontend Tracking (.env)**
```bash
VITE_API_URL=http://localhost:5000
# o en producción:
VITE_API_URL=https://api.tudominio.com
```

#### **Frontend Dashboard (.env)**
```bash
VITE_API_URL=http://localhost:5000
# o en producción:
VITE_API_URL=https://api.tudominio.com
```

---

### **Instalación de Dependencias**

#### **Backend**
```bash
cd rutaycampo-backend
npm install
# Dependencias ya instaladas: express, mongoose, socket.io, etc.
```

#### **Frontend Tracking**
```bash
cd frontend-tracking
npm install
# Nuevas dependencias instaladas:
# - react-leaflet
# - leaflet
# - axios
# - lucide-react
# - react-router-dom
```

#### **Frontend Dashboard**
```bash
cd frontend-dashboard
npm install
# Nuevas dependencias instaladas:
# - react-leaflet
# - leaflet
# - socket.io-client
```

---

### **Iniciar Servidores (Desarrollo)**

```bash
# Terminal 1: Backend
cd rutaycampo-backend
npm run dev
# Corre en: http://localhost:5000

# Terminal 2: Frontend Tracking
cd frontend-tracking
npm run dev
# Corre en: http://localhost:5173

# Terminal 3: Frontend Dashboard
cd frontend-dashboard
npm run dev
# Corre en: http://localhost:5174
```

---

### **Build para Producción**

#### **Backend**
```bash
cd rutaycampo-backend
npm start
# o con PM2:
pm2 start src/server.js --name rutaycampo-api
```

#### **Frontend Tracking**
```bash
cd frontend-tracking
npm run build
# Output: dist/
# Deploy a: Netlify, Vercel, o servidor estático
```

#### **Frontend Dashboard**
```bash
cd frontend-dashboard
npm run build
# Output: dist/
# Deploy a: Netlify, Vercel, o servidor estático
```

---

## 🧪 Testing

### **Test Manual del Flujo Completo**

#### **1. Preparación**
```bash
# Iniciar todos los servicios
npm run dev (en cada carpeta)

# Crear viaje de prueba en Dashboard
- Origen: Pergamino, BA (-33.8897, -60.5734)
- Destino: Rosario, SF (-32.9442, -60.6505)
- Estado: en_curso
```

#### **2. Generar Token de Tracking**
```bash
# Opción A: Desde Dashboard (futuro)
# Opción B: Manualmente en MongoDB
db.viajes.updateOne(
  { numeroViaje: "VJ-000002" },
  { $set: { trackingToken: "test123" } }
)
```

#### **3. Probar PWA de Tracking**
```
1. Abrir: http://localhost:5173/tracking/test123
2. Verificar que muestra:
   ✅ Mapa con origen y destino
   ✅ Información del viaje
   ✅ Botón "Iniciar Viaje"
3. Tocar "Iniciar Viaje"
4. Aceptar permisos de GPS
5. Verificar que:
   ✅ Google Maps se abre automáticamente
   ✅ Tracking se activa
   ✅ Muestra "Tracking Activo"
   ✅ Muestra countdown (9:59... 9:58...)
6. Esperar 10 minutos
7. Verificar que:
   ✅ Contador de actualizaciones incrementa
   ✅ Última actualización se actualiza
   ✅ Ubicación se envía al backend
```

#### **4. Probar Dashboard**
```
1. Abrir: http://localhost:5174/viajes
2. Buscar viaje "en_curso"
3. Verificar que muestra:
   ✅ Ícono de navegación morado
4. Tocar ícono
5. Verificar que modal muestra:
   ✅ Mapa con ruta
   ✅ Ubicación actual del transportista
   ✅ Estado "Tracking: ✅ Activo"
   ✅ Última actualización
6. Esperar 10 minutos
7. Verificar que:
   ✅ Mapa se actualiza automáticamente
   ✅ Línea verde se extiende
   ✅ Marcador de camión se mueve
```

---

### **Test de WebSocket**

```javascript
// En consola del navegador (Dashboard):
const socket = io('http://localhost:5000');
socket.emit('join-trip', 'VIAJE_ID');

socket.on('location-updated', (data) => {
  console.log('Nueva ubicación:', data);
});

// Verificar que recibe eventos cada 10 min
```

---

### **Test de API con cURL**

```bash
# 1. Obtener info del viaje
curl http://localhost:5000/api/tracking/viaje/test123

# 2. Iniciar tracking
curl -X POST http://localhost:5000/api/tracking/viaje/test123/start

# 3. Enviar ubicación
curl -X POST http://localhost:5000/api/tracking/viaje/test123/location \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": -33.4567,
    "longitude": -60.1234,
    "speed": 85.3,
    "accuracy": 12
  }'

# 4. Detener tracking
curl -X POST http://localhost:5000/api/tracking/viaje/test123/stop
```

---

## 🔧 Troubleshooting

### **Problema: GPS no funciona en PWA**

**Síntomas:**
- Error: "Permiso de ubicación denegado"
- No obtiene coordenadas

**Soluciones:**
1. Verificar que el navegador tenga permisos de ubicación
2. En Chrome: Configuración → Privacidad → Ubicación → Permitir
3. Verificar que el dispositivo tenga GPS activado
4. Probar en HTTPS (GPS requiere conexión segura en producción)

---

### **Problema: Google Maps no se abre automáticamente**

**Síntomas:**
- Toca "Iniciar Viaje" pero Google Maps no abre

**Soluciones:**
1. Verificar que el navegador permite popups
2. Verificar que las coordenadas son válidas
3. Revisar consola del navegador para errores
4. Probar abrir manualmente con botón "Abrir Google Maps"

---

### **Problema: Dashboard no recibe updates en tiempo real**

**Síntomas:**
- Mapa no se actualiza automáticamente
- No recibe eventos WebSocket

**Soluciones:**
1. Verificar que Socket.io está conectado:
   ```javascript
   console.log(socket.connected); // debe ser true
   ```
2. Verificar que se unió a la sala correcta:
   ```javascript
   socket.emit('join-trip', viajeId);
   ```
3. Verificar CORS en backend (permitir origen del dashboard)
4. Revisar logs del servidor para eventos emitidos

---

### **Problema: Tracking se detiene al minimizar navegador**

**Síntomas:**
- Después de minimizar, deja de enviar ubicaciones

**Soluciones:**
1. Verificar que Wake Lock está activo (solo funciona en HTTPS)
2. En Android: Desactivar "Optimización de batería" para el navegador
3. Mantener pantalla encendida (Wake Lock)
4. Considerar migrar a app nativa para tracking en background real

---

### **Problema: Intervalo de actualización incorrecto**

**Síntomas:**
- Envía ubicaciones muy rápido o muy lento

**Soluciones:**
1. Verificar `UPDATE_INTERVAL` en `useGeolocation.js`:
   ```javascript
   const UPDATE_INTERVAL = 10 * 60 * 1000; // 10 minutos
   ```
2. Para testing, cambiar a 10 segundos:
   ```javascript
   const UPDATE_INTERVAL = 10 * 1000; // 10 segundos
   ```

---

## 📝 Notas Importantes

### **Limitaciones Actuales**

1. **Tracking en Background Limitado**
   - PWA requiere pestaña abierta (minimizada OK, cerrada NO)
   - Solución: Migrar a app nativa React Native

2. **Dependencia de Google Maps**
   - Navegación depende de Google Maps externo
   - No hay control sobre la app de Google Maps

3. **Consumo de Batería**
   - GPS activo consume batería
   - Intervalo de 10 min es un balance entre precisión y batería

4. **Privacidad**
   - Requiere autorización explícita del transportista
   - Cumple con regulaciones de privacidad

---

### **Próximas Mejoras Sugeridas**

1. **Sistema de Heartbeat**
   - Detectar cuando transportista cierra navegador
   - Enviar alerta por WhatsApp

2. **Service Worker**
   - Intentar tracking en background con Service Worker
   - Queue de ubicaciones offline

3. **Alertas Automáticas**
   - Alerta si se desvía de la ruta
   - Alerta si se detiene por mucho tiempo
   - Alerta si no envía ubicación en X tiempo

4. **Analytics y Reportes**
   - Velocidad promedio
   - Tiempo total de viaje
   - Desvíos de ruta
   - Exportar a PDF/Excel

5. **App Nativa**
   - Migrar a React Native
   - Tracking en background real
   - Notificaciones push

---

## 📚 Referencias

- [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [Leaflet.js](https://leafletjs.com/)
- [Socket.io](https://socket.io/)
- [Google Maps URLs](https://developers.google.com/maps/documentation/urls/get-started)
- [Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API)

---

## 👥 Contacto y Soporte

Para preguntas o issues, contactar al equipo de desarrollo.

---

**Última actualización:** 23 de Enero, 2026  
**Versión:** 1.0.0  
**Estado:** ✅ Implementado y funcional
