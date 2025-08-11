from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import pricing
from .routers import cashflow
from .routers import roi
import os

app = FastAPI(
    title="Calculadoras Financieras API",
    description="API robusta para cálculos financieros precisos",
    version="1.0.0"
)

# Configurar CORS para permitir requests desde Next.js
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://localhost:3002",
]

frontend_origin = os.getenv("FRONTEND_ORIGIN")
if frontend_origin:
    allowed_origins.append(frontend_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(pricing.router, prefix="/api/v1/pricing", tags=["pricing"])
app.include_router(
    cashflow.router, prefix="/api/v1/cashflow", tags=["cashflow"]
)
app.include_router(roi.router, prefix="/api/v1/roi", tags=["roi"])


@app.get("/")
async def root():
    return {"message": "Calculadoras Financieras API - Versión 1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
