# Backend - Calculadoras Financieras

## Estructura del Backend

### Tecnologías
- **Framework**: FastAPI
- **Base de datos**: SQLite (desarrollo) / PostgreSQL (producción)
- **Validación**: Pydantic
- **Cálculos**: NumPy, Pandas, Decimal para precisión
- **Testing**: pytest

### Estructura de Carpetas
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── models/
│   ├── routers/
│   ├── services/
│   └── utils/
├── tests/
├── requirements.txt
└── README.md
```

### Instalación
```bash
cd backend
pip install -r requirements.txt
```

### Ejecución
```bash
uvicorn app.main:app --reload
```
