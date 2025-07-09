# 🧮 Calculadoras Financieras

Plataforma web full-stack para emprendedores freelances con calculadoras financieras de 0% error y consejos inteligentes basados en datos.

## 🚀 Características

- **Diseño Apple-like**: Interfaz minimalista, elegante y funcional
- **Calculadoras precisas**: Algoritmos avanzados para cálculos financieros exactos
- **Modo oscuro**: Experiencia visual adaptable
- **Exportación profesional**: Reportes en PDF listos para presentar
- **Responsive**: Adaptado para todos los dispositivos

## 🧮 Calculadoras Disponibles

### 1. Calculadora de Precio Ideal
- **Análisis de costos**: Costo de producción, operativos y fijos
- **Competencia**: Análisis de precios del mercado
- **Valor percibido**: Evaluación del valor para el cliente
- **Estrategias de precios**: Penetración, premium, competitivo
- **Proyecciones financieras**: ROI, ganancias mensuales/anuales

### 2. Calculadora de Punto de Equilibrio
- **Análisis CVU**: Costos-Volumen-Utilidad
- **Métricas clave**: Unidades BEP, Ingresos BEP, Margen de Contribución
- **Margen de seguridad**: Análisis de riesgo financiero
- **Gráfica interactiva**: Visualización del punto de equilibrio
- **Exportación**: Reporte profesional en PDF

## 🛠️ Tecnologías

### Frontend
- **Next.js 15**: Framework React con App Router
- **TypeScript**: Tipado estricto para mayor confiabilidad
- **Tailwind CSS**: Styling utilitario y responsive
- **Recharts**: Gráficos interactivos y profesionales
- **Lucide React**: Iconografía moderna y consistente

### Backend
- **FastAPI**: API moderna y rápida con validación automática
- **Vercel Serverless**: Deploy automático como funciones serverless  
- **Pydantic**: Validación robusta de datos de entrada
- **Python 3.9**: Runtime optimizado para Vercel
- **CORS configurado**: Acceso seguro desde el frontend

### Arquitectura
- **Frontend**: Next.js desplegado en Vercel
- **Backend**: FastAPI como funciones serverless en Vercel
- **Base de datos**: PostgreSQL en producción (opcional)
- **Caching**: Vercel Edge Network

## 🌐 API Endpoints

### Calculadora de Precios
- `POST /api/v1/pricing/calculate`: Calcular precio ideal
- `GET /api/health`: Estado de la API

### Calculadora de Punto de Equilibrio  
- `POST /api/v1/breakeven/calculate`: Calcular punto de equilibrio

### Monitoreo
- `GET /api`: Información general de la API

## 📊 Calculadoras Disponibles

### ✅ Calculadora de Precio Ideal
- Análisis de costos (materiales, mano de obra, gastos generales)
- Cálculo de margen de ganancia deseado
- Análisis competitivo automático
- Múltiples estrategias de precios
- Proyecciones financieras

### 🔜 Próximas Calculadoras
- Calculadora de ROI
- Calculadora de Flujo de Caja
- Calculadora de Punto de Equilibrio
- Calculadora de Presupuesto
- Calculadora de Inversiones

## 🎨 Diseño

Inspirado en el ecosistema Apple con principios de:
- **Minimalismo**: Interfaz limpia sin elementos innecesarios
- **Funcionalidad**: Cada elemento tiene un propósito claro
- **Accesibilidad**: Colores contrastados y navegación por teclado
- **Responsive**: Mobile-first, adaptable a todas las pantallas

## 🚀 Instalación y Desarrollo

### Frontend
```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

### Backend
```bash
# Navegar al directorio backend
cd backend

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor
uvicorn app.main:app --reload
```

## 📁 Estructura del Proyecto

```
calculadoras/
├── src/
│   ├── app/                 # App Router de Next.js
│   ├── components/
│   │   ├── ui/             # Componentes UI reutilizables
│   │   └── calculators/    # Calculadoras específicas
│   └── lib/                # Utilidades y helpers
├── backend/
│   ├── app/
│   │   ├── routers/        # Endpoints de API
│   │   ├── models/         # Modelos de datos
│   │   └── services/       # Lógica de negocio
│   └── tests/              # Tests del backend
├── public/                 # Archivos estáticos
└── .github/                # GitHub Actions y configuración
```

## 🎯 Roadmap

- [ ] Integración con APIs de datos financieros en tiempo real
- [ ] Sistema de autenticación y perfiles de usuario
- [ ] Exportación de resultados en PDF/Excel
- [ ] Dashboard personalizado para cada usuario
- [ ] Modo oscuro
- [ ] Aplicación móvil con React Native

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor lee las guías de contribución antes de enviar un PR.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🔗 Enlaces

- **Frontend**: Desplegado en Vercel
- **Backend**: Desplegado en Railway
- **Documentación**: [Próximamente]

---

Hecho con ❤️ para emprendedores que buscan tomar decisiones financieras inteligentes.
