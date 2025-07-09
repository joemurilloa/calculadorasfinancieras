from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import pricing

app = FastAPI(
    title="Calculadoras Financieras API",
    description="API robusta para cálculos financieros precisos",
    version="1.0.0"
)

# Configurar CORS para permitir requests desde Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "https://calculadoras.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(pricing.router, prefix="/api/v1/pricing", tags=["pricing"])


@app.get("/")
async def root():
    return {"message": "Calculadoras Financieras API - Versión 1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
