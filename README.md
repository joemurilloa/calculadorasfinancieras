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
- **Next.js 15** con App Router y TypeScript
- **Tailwind CSS v4** (config simplificada con @plugin y @theme)
- **Recharts** y **Lucide React**

### Backend
- **FastAPI** (servidor consolidado en `backend/`)
- **Pydantic** y **Uvicorn**
- **Sin dependencias pesadas innecesarias** (se usa `statistics` de stdlib)

### Arquitectura
- **Frontend**: Vercel / local
- **Backend**: FastAPI propio (Railway/VM/contendor) o local en `127.0.0.1:8000`

## 🌐 API Endpoints

- `POST /api/v1/pricing/calculate` – Precio ideal
- `GET /health` – Estado del API

## ⚙️ Configuración

Crea `.env.local` en la raíz:

```ini
# Frontend -> Backend base URL
# Directo al backend local:
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
# o usa proxy interno de Next en dev:
# NEXT_PUBLIC_API_URL=/api
```

Si usas `/api`, `next.config.ts` reescribe a `http://127.0.0.1:8000` en desarrollo.

## 🚀 Desarrollo

### Con VS Code (recomendado)
- Tareas: `Desarrollo: Front + Back` (levanta FastAPI y Next.js)

### Vía scripts
```bash
# Frontend
npm install
npm run dev

# Backend
python -m pip install --upgrade pip
pip install -r backend/requirements.txt
python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000

# Ambos (Windows PowerShell)
npm run dev:all
```

### Pruebas Backend
```bash
npm run test:back
```

## 📁 Estructura del Proyecto

```
calculadoras/
├── src/
│   ├── app/
│   ├── components/
│   │   ├── ui/
│   │   └── calculators/
│   └── lib/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   └── main.py
│   └── tests/
├── public/
└── .github/
```

## 🧪 CI
- GitHub Actions ejecuta tests de backend (Python 3.12) y lint del frontend en cada PR a `main`.

## 🎯 Roadmap breve
- [ ] E2E básicos del frontend
- [ ] Añadir endpoints adicionales (ROI, flujo de caja)
- [ ] Deploy del backend (Railway / Fly.io / VM Docker)

---

Hecho con ❤️ para emprendedores que toman decisiones financieras inteligentes.
