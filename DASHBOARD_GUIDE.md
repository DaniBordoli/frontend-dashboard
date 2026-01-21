# Dashboard Ruta y Campo - Guía de Uso

## 🎯 Funcionalidades Implementadas

### ✅ Sistema de Autenticación
- Login con email y contraseña
- Protección de rutas por roles (`rc_superadmin`, `rc_operador`)
- Gestión de sesión con JWT
- Logout seguro

### ✅ Layout del Dashboard
- Sidebar con navegación
- Header con información del usuario
- Menú responsive (mobile-friendly)
- Indicador de página activa

### ✅ ABM de Productores (Completo)
- **Listar**: Ver todos los productores con búsqueda en tiempo real
- **Crear**: Formulario completo para nuevo productor
- **Editar**: Modificar datos de productor existente
- **Eliminar**: Borrar productor con confirmación

### 🔄 Próximamente
- ABM de Transportistas
- Gestión de Tarifas
- Gestión de Viajes
- Dashboard con métricas en tiempo real

## 🚀 Cómo Iniciar

### 1. Asegúrate de que el backend esté corriendo

```bash
cd backend
npm run dev
```

El backend debe estar en: http://localhost:5000

### 2. Inicia el dashboard

```bash
cd frontend-dashboard
npm run dev
```

El dashboard estará disponible en: http://localhost:5174

## 🔐 Credenciales de Prueba

Para probar el sistema, primero necesitas crear un usuario administrador en el backend.

### Crear usuario admin (desde el backend)

Puedes usar Postman, Thunder Client o curl:

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "admin@rutaycampo.com",
  "password": "admin123",
  "name": "Administrador",
  "role": "rc_superadmin"
}
```

Luego inicia sesión en el dashboard con:
- **Email**: admin@rutaycampo.com
- **Password**: admin123

## 📋 Estructura de Archivos

```
src/
├── components/
│   ├── Layout.jsx              # Layout principal con sidebar
│   ├── ProtectedRoute.jsx      # Protección de rutas
│   └── ProductorModal.jsx      # Modal para crear/editar productores
├── context/
│   └── AuthContext.jsx         # Context de autenticación
├── pages/
│   ├── Login.jsx               # Página de login
│   ├── Dashboard.jsx           # Dashboard principal
│   └── Productores.jsx         # ABM de productores
├── services/
│   ├── api.js                  # Cliente Axios configurado
│   ├── auth.service.js         # Servicios de autenticación
│   └── producer.service.js     # Servicios de productores
└── App.jsx                     # Configuración de rutas
```

## 🎨 Características del UI

- **TailwindCSS**: Estilos modernos y responsive
- **Lucide Icons**: Iconos consistentes
- **Diseño limpio**: Interfaz profesional y fácil de usar
- **Feedback visual**: Loading states, confirmaciones, errores
- **Mobile-first**: Funciona perfectamente en dispositivos móviles

## 🔧 Flujo de Trabajo

### Gestión de Productores

1. **Ver lista**: Accede a "Productores" desde el sidebar
2. **Buscar**: Usa la barra de búsqueda para filtrar por empresa, contacto o email
3. **Crear nuevo**:
   - Click en "Nuevo Productor"
   - Completa el formulario
   - Click en "Crear"
4. **Editar**:
   - Click en el ícono de edición (lápiz)
   - Modifica los campos necesarios
   - Click en "Actualizar"
5. **Eliminar**:
   - Click en el ícono de eliminar (papelera)
   - Confirma la acción

## 🌐 Endpoints Utilizados

El dashboard consume los siguientes endpoints del backend:

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil del usuario

### Productores
- `GET /api/producers` - Listar todos
- `GET /api/producers/:id` - Obtener uno
- `POST /api/producers` - Crear nuevo
- `PUT /api/producers/:id` - Actualizar
- `DELETE /api/producers/:id` - Eliminar

## 🐛 Solución de Problemas

### Error de conexión con el backend

**Problema**: "Network Error" o "Cannot connect to API"

**Solución**:
1. Verifica que el backend esté corriendo en el puerto 5000
2. Revisa el archivo `.env` del dashboard:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
3. Reinicia el servidor del dashboard

### Error 401 Unauthorized

**Problema**: Redirige al login constantemente

**Solución**:
1. El token JWT puede haber expirado
2. Cierra sesión y vuelve a iniciar sesión
3. Verifica que el usuario tenga el rol correcto (`rc_superadmin` o `rc_operador`)

### No aparecen los productores

**Problema**: La lista está vacía

**Solución**:
1. Verifica que el backend esté conectado a MongoDB
2. Crea productores desde el dashboard usando "Nuevo Productor"
3. Revisa la consola del navegador para errores

## 📱 Responsive Design

El dashboard está optimizado para:
- 📱 **Mobile**: 320px - 768px
- 💻 **Tablet**: 768px - 1024px
- 🖥️ **Desktop**: 1024px+

El sidebar se colapsa automáticamente en pantallas pequeñas.

## 🎯 Próximos Pasos

1. ✅ Sistema de autenticación
2. ✅ Layout base
3. ✅ ABM de Productores
4. 🔄 ABM de Transportistas (siguiente)
5. 🔄 Gestión de Tarifas
6. 🔄 Gestión de Viajes
7. 🔄 Dashboard con métricas en tiempo real
8. 🔄 Notificaciones
9. 🔄 Tracking de viajes en mapa
