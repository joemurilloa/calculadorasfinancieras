from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import pricing, cashflow, roi_clean, roi, tax, debt

app = FastAPI(
    title="Calculadoras Financieras API",
    description="API para cálculos financieros avanzados",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(pricing.router)
app.include_router(cashflow.router)
app.include_router(roi_clean.router)
app.include_router(roi.router)
app.include_router(tax.router)
app.include_router(debt.router)

@app.get("/")
async def root():
    return {"message": "Calculadoras Financieras API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}
