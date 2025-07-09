from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from decimal import Decimal
from typing import Optional, List
import numpy as np

router = APIRouter()


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
    market_research: Optional[dict] = Field(
        None, description="Investigación de mercado"
    )
    competitor_prices: Optional[List[float]] = Field(
        None, description="Precios de competidores"
    )
    target_market: Optional[str] = Field(
        None, description="Mercado objetivo"
    )


class PricingResult(BaseModel):
    recommended_price: float
    cost_breakdown: dict
    profit_margin: float
    competitive_analysis: dict
    pricing_strategies: List[dict]
    financial_projections: dict


class PricingService:
    @staticmethod
    def calculate_base_cost(
        materials: float, labor: float, overhead: float
    ) -> Decimal:
        """Calcula el costo base con precisión decimal"""
        return (
            Decimal(str(materials)) +
            Decimal(str(labor)) +
            Decimal(str(overhead))
        )

    @staticmethod
    def calculate_price_with_margin(
        base_cost: Decimal, margin_percent: float
    ) -> Decimal:
        """Calcula precio con margen deseado"""
        margin_decimal = Decimal(str(margin_percent)) / Decimal('100')
        return base_cost / (Decimal('1') - margin_decimal)

    @staticmethod
    def analyze_competition(competitor_prices: List[float]) -> dict:
        """Analiza precios de competidores"""
        if not competitor_prices:
            return {"message": "No hay datos de competidores"}

        prices = np.array(competitor_prices)
        return {
            "min_price": float(np.min(prices)),
            "max_price": float(np.max(prices)),
            "avg_price": float(np.mean(prices)),
            "median_price": float(np.median(prices)),
            "std_deviation": float(np.std(prices))
        }

    @staticmethod
    def generate_pricing_strategies(
        base_cost: Decimal, competitor_analysis: dict
    ) -> List[dict]:
        """Genera estrategias de precios"""
        strategies = []

        # Estrategia conservadora
        conservative_price = base_cost * Decimal('1.20')  # 20% margen
        strategies.append({
            "name": "Conservadora",
            "price": float(conservative_price),
            "description": "Margen bajo pero seguro, ideal para empezar",
            "pros": ["Fácil venta", "Competitivo"],
            "cons": ["Menor ganancia"]
        })

        # Estrategia competitiva
        if competitor_analysis.get("avg_price"):
            competitive_price = Decimal(str(competitor_analysis["avg_price"]))
            strategies.append({
                "name": "Competitiva",
                "price": float(competitive_price),
                "description": "Precio similar al promedio del mercado",
                "pros": ["Equilibrio", "Aceptación del mercado"],
                "cons": ["Menos diferenciación"]
            })

        # Estrategia premium
        premium_price = base_cost * Decimal('1.50')  # 50% margen
        strategies.append({
            "name": "Premium",
            "price": float(premium_price),
            "description": "Alto margen, enfoque en calidad y valor",
            "pros": ["Mayor ganancia", "Percepción de calidad"],
            "cons": ["Mercado más pequeño"]
        })

        return strategies


@router.post("/calculate", response_model=PricingResult)
async def calculate_pricing(data: PricingInput):
    """Calcula el precio ideal para un producto o servicio"""
    try:
        service = PricingService()

        # Cálculo del costo base
        base_cost = service.calculate_base_cost(
            data.cost_materials,
            data.cost_labor,
            data.cost_overhead
        )

        # Precio con margen deseado
        recommended_price = service.calculate_price_with_margin(
            base_cost,
            data.desired_profit_margin
        )

        # Análisis de competidores
        competitive_analysis = service.analyze_competition(
            data.competitor_prices or []
        )

        # Estrategias de precios
        pricing_strategies = service.generate_pricing_strategies(
            base_cost,
            competitive_analysis
        )

        # Breakdown de costos
        cost_breakdown = {
            "materials": data.cost_materials,
            "labor": data.cost_labor,
            "overhead": data.cost_overhead,
            "total_cost": float(base_cost),
            "profit_amount": float(recommended_price - base_cost)
        }

        # Proyecciones financieras
        financial_projections = {
            "break_even_units": 1,  # Simplificado
            "monthly_revenue_100_units": float(recommended_price * 100),
            "monthly_profit_100_units": float(
                (recommended_price - base_cost) * 100
            ),
            "roi_percentage": float(
                ((recommended_price - base_cost) / base_cost) * 100
            )
        }

        return PricingResult(
            recommended_price=float(recommended_price),
            cost_breakdown=cost_breakdown,
            profit_margin=data.desired_profit_margin,
            competitive_analysis=competitive_analysis,
            pricing_strategies=pricing_strategies,
            financial_projections=financial_projections
        )

    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error en cálculo: {str(e)}"
        )


@router.get("/strategies")
async def get_pricing_strategies():
    """Obtiene información sobre estrategias de precios"""
    return {
        "strategies": [
            {
                "name": "Penetración de Mercado",
                "description": "Precios bajos para ganar participación",
                "best_for": "Productos nuevos, mercados competitivos"
            },
            {
                "name": "Descremado",
                "description": "Precios altos iniciales, luego reducción",
                "best_for": "Productos innovadores, early adopters"
            },
            {
                "name": "Precio Competitivo",
                "description": "Precio similar a competidores",
                "best_for": "Mercados maduros, productos similares"
            },
            {
                "name": "Precio Premium",
                "description": "Precios altos basados en valor percibido",
                "best_for": "Productos de calidad superior, marca fuerte"
            }
        ]
    }
