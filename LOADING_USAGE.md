# Uso del Loading Overlay

El componente `LoadingOverlay` está disponible globalmente en toda la aplicación.

## Cómo usar

### 1. Importar el hook

```javascript
import { useLoading } from '../context/LoadingContext';
// o
import { useLoading } from '../hooks/useLoading';
```

### 2. Usar en tu componente

```javascript
function MiComponente() {
  const { showLoading, hideLoading } = useLoading();

  const handleSubmit = async () => {
    try {
      showLoading('Guardando datos...');
      await api.post('/endpoint', data);
      hideLoading();
    } catch (error) {
      hideLoading();
      // manejar error
    }
  };

  return (
    // tu JSX
  );
}
```

## Ejemplos de uso

### Ejemplo 1: Guardar datos
```javascript
showLoading('Guardando transportista...');
await transportistaService.create(formData);
hideLoading();
```

### Ejemplo 2: Cargar datos
```javascript
showLoading('Cargando productores...');
const data = await producerService.getAll();
hideLoading();
```

### Ejemplo 3: Eliminar
```javascript
showLoading('Eliminando registro...');
await service.delete(id);
hideLoading();
```

### Ejemplo 4: Con mensaje por defecto
```javascript
showLoading(); // Muestra "Cargando..."
await someAsyncOperation();
hideLoading();
```

## Características

- ✅ **Global**: Disponible en toda la aplicación
- ✅ **Personalizable**: Puedes cambiar el mensaje
- ✅ **Animado**: Logo con animación bounce y spinner
- ✅ **Backdrop**: Fondo oscuro con blur
- ✅ **Responsive**: Se adapta a todos los tamaños de pantalla
- ✅ **Accesible**: Z-index alto para estar siempre visible

## Notas

- Siempre llama `hideLoading()` en el bloque `finally` o después de la operación
- No olvides llamar `hideLoading()` en caso de error
- El overlay bloquea toda interacción con la UI mientras está visible
