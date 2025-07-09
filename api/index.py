from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List

app = FastAPI(
    title="Calculadoras Financieras API",
    description="API para cálculos financieros - Vercel Serverless",
    version="1.0.0"
)

# CORS para Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar dominio exacto
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Modelos de datos
class PricingInput(BaseModel):
    product_name: str = Field(
        ..., description="Nombre del producto o servicio"
    )
    cost_materials: float = Field(..., ge=0, description="Costo de materiales")
    cost_labor: float = Field(..., ge=0, description="Costo de mano de obra")
    cost_overhead: float = Field(..., ge=0, description="Gastos generales")
    desired_profit_margin: float = Field(
        ..., ge=0, le=100, description="Margen de ganancia deseado (%)"
    )
    competitor_prices: Optional[List[float]] = Field(
        None, description="Precios de competidores"
    )


class PricingResult(BaseModel):
    recommended_price: float
    total_costs: float
    profit_amount: float
    profit_margin: float
    competitive_analysis: dict
    pricing_strategy: str


class BreakevenInput(BaseModel):
    fixed_costs: float = Field(..., ge=0, description="Costos fijos")
    variable_cost_per_unit: float = Field(
        ..., ge=0, description="Costo variable por unidad"
    )
    selling_price_per_unit: float = Field(
        ..., gt=0, description="Precio de venta por unidad"
    )


class BreakevenResult(BaseModel):
    breakeven_units: int
    breakeven_revenue: float
    contribution_margin: float
    contribution_margin_ratio: float


@app.get("/api")
async def root():
    return {"message": "Calculadoras Financieras API - Funcionando en Vercel"}


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "API operativa"}


@app.post("/api/v1/pricing/calculate", response_model=PricingResult)
async def calculate_pricing(input_data: PricingInput):
    try:
        # Cálculos básicos
        total_costs = (
            input_data.cost_materials +
            input_data.cost_labor +
            input_data.cost_overhead
        )
        profit_margin_decimal = input_data.desired_profit_margin / 100
        recommended_price = total_costs / (1 - profit_margin_decimal)
        profit_amount = recommended_price - total_costs

        # Análisis competitivo
        competitive_analysis = {}
        pricing_strategy = "cost_plus"

        if input_data.competitor_prices:
            prices = input_data.competitor_prices
            avg_competitor_price = sum(prices) / len(prices)
            min_competitor_price = min(prices)
            max_competitor_price = max(prices)

            competitive_analysis = {
                "average_competitor_price": round(avg_competitor_price, 2),
                "min_competitor_price": round(min_competitor_price, 2),
                "max_competitor_price": round(max_competitor_price, 2),
                "price_position": (
                    "competitive"
                    if (min_competitor_price <= recommended_price <=
                        max_competitor_price)
                    else "outside_range"
                )
            }

            # Estrategia basada en competencia
            if recommended_price > avg_competitor_price * 1.1:
                pricing_strategy = "premium"
            elif recommended_price < avg_competitor_price * 0.9:
                pricing_strategy = "penetration"
            else:
                pricing_strategy = "competitive"

        return PricingResult(
            recommended_price=round(recommended_price, 2),
            total_costs=round(total_costs, 2),
            profit_amount=round(profit_amount, 2),
            profit_margin=round(input_data.desired_profit_margin, 2),
            competitive_analysis=competitive_analysis,
            pricing_strategy=pricing_strategy
        )

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error en el cálculo: {str(e)}"
        )


@app.post("/api/v1/breakeven/calculate", response_model=BreakevenResult)
async def calculate_breakeven(input_data: BreakevenInput):
    try:
        # Validar que el precio sea mayor que el costo variable
        if (input_data.selling_price_per_unit <=
                input_data.variable_cost_per_unit):
            raise HTTPException(
                status_code=400,
                detail="El precio debe ser mayor que el costo variable"
            )

        # Cálculos del punto de equilibrio
        contribution_margin = (
            input_data.selling_price_per_unit -
            input_data.variable_cost_per_unit
        )
        contribution_margin_ratio = (
            contribution_margin / input_data.selling_price_per_unit
        )
        breakeven_units = input_data.fixed_costs / contribution_margin
        breakeven_revenue = breakeven_units * input_data.selling_price_per_unit

        return BreakevenResult(
            breakeven_units=int(round(breakeven_units)),
            breakeven_revenue=round(breakeven_revenue, 2),
            contribution_margin=round(contribution_margin, 2),
            contribution_margin_ratio=round(contribution_margin_ratio * 100, 2)
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error en el cálculo: {str(e)}"
        )


# Handler para Vercel
def handler(request):
    return app(request)
