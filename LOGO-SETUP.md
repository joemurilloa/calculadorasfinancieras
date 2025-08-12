# 🎨 Guía de Implementación del Logo

## 📁 Ubicación de archivos de logo

Coloca tu logo en la carpeta `public` con los siguientes nombres:

### Logo principal
```
public/logo.png
```
- **Tamaño recomendado**: 400x120px (ratio 3:1 aproximadamente)
- **Formato**: PNG con fondo transparente preferiblemente
- **Uso**: Logo principal en headers y página

### Favicons (íconos de pestaña del navegador)
```
public/favicon.ico          # 16x16, 32x32 píxeles
public/favicon-16x16.png    # 16x16 píxeles  
public/favicon-32x32.png    # 32x32 píxeles
public/apple-touch-icon.png # 180x180 píxeles para iOS
```

## 🚀 Funcionalidades implementadas

### ✅ Logo en pestaña del navegador (favicon)
- Configurado en `src/app/layout.tsx`
- Soporta múltiples tamaños y formatos
- Incluye soporte para dispositivos Apple

### ✅ Logo en header de todas las páginas
- **Página principal**: Logo grande con texto
- **Calculadoras**: Logo compacto en header fijo
- **Funcionalidad**: Click en logo regresa al home
- **Efectos**: Hover con scale y transiciones suaves

### ✅ Header responsive y elegante
- Fondo con blur y transparencia
- Dark mode toggle integrado
- Navegación fluida entre secciones
- Diseño minimalista estilo Apple

## 🎯 Ubicaciones donde aparece el logo

1. **Favicon** - Pestaña del navegador
2. **Header principal** - Página de inicio (tamaño medio)
3. **Headers de calculadoras** - Calculadoras individuales (tamaño pequeño)
4. **Open Graph** - Cuando se comparte en redes sociales

## 📱 Responsividad

- **Desktop**: Logo completo con texto
- **Mobile**: Solo logo en pantallas pequeñas (el texto se oculta)
- **Tamaños adaptativos**: sm, md, lg disponibles

## 🎨 Recomendaciones de diseño para tu logo

1. **Colores**: Que funcione bien en modo claro y oscuro
2. **Simplicidad**: Diseño limpio que se vea bien en tamaños pequeños
3. **Legibilidad**: Texto claro si incluye texto en el logo
4. **Contraste**: Buena visibilidad sobre fondos claros y oscuros

## 🔧 Personalización adicional

Si necesitas cambiar tamaños o estilos del logo, modifica el componente en:
```
src/components/ui/Logo.tsx
```

El componente acepta las siguientes props:
- `size`: 'sm' | 'md' | 'lg'
- `showText`: boolean (mostrar/ocultar texto)
- `onClick`: función de click
- `className`: estilos adicionales
