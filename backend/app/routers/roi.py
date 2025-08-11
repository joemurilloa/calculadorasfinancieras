from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Literal

router = APIRouter(tags=["roi"])


class InvestmentData(BaseModel):
    initial_amount: float = Field(
        ..., gt=0, description="Monto inicial de inversión"
    )
    additional_costs: float = Field(
        0, ge=0, description="Costos adicionales (setup, implementación)"
    )
    investment_date: str = Field(
        ..., description="Fecha de inversión (YYYY-MM-DD)"
    )


class ReturnsData(BaseModel):
    monthly_revenue_increase: float = Field(
        0, ge=0, description="Aumento mensual de ingresos"
    )
    monthly_cost_savings: float = Field(
        0, ge=0, description="Ahorro mensual en costos"
    )
    residual_value: float = Field(
        0, ge=0, description="Valor residual al final del período"
    )


class ParametersData(BaseModel):
    analysis_period_months: int = Field(
        12, gt=0, le=120, description="Período de análisis en meses"
    )
    discount_rate: float = Field(
        0.10, ge=0, le=1, description="Tasa de descuento anual"
    )
    inflation_rate: float = Field(
        0.03, ge=0, le=1, description="Tasa de inflación anual"
    )


class ROIScenario(BaseModel):
    name: str
    roi_percentage: float
    npv: float
    payback_months: Optional[int]
    description: str


class ROIMetrics(BaseModel):
    simple_roi: float
    annualized_roi: float
    npv: float
    irr: Optional[float]
    payback_period_months: Optional[int]
    break_even_month: Optional[int]


class ROIAnalysis(BaseModel):
    investment_grade: Literal["Excelente", "Buena", "Regular", "Mala"]
    risk_level: Literal["Bajo", "Medio", "Alto"]
    recommendation: str
    key_factors: List[str]


class ROIResult(BaseModel):
    investment_data: InvestmentData
    returns_data: ReturnsData
    parameters_data: ParametersData
    metrics: ROIMetrics
    scenarios: List[ROIScenario]
    timeline: List[dict]
    analysis: ROIAnalysis


def _calculate_irr(cash_flows: List[float],
                   max_iterations: int = 100) -> Optional[float]:
    """Calcula la Tasa Interna de Retorno usando método Newton-Raphson"""
    if not cash_flows or len(cash_flows) < 2:
        return None

    rate = 0.1
    for _ in range(max_iterations):
        npv = sum(cf / ((1 + rate) ** i) for i, cf in enumerate(cash_flows))
        if abs(npv) < 1e-6:
            return rate

        # Derivada del NPV
        dnpv = sum(-i * cf / ((1 + rate) ** (i + 1))
                   for i, cf in enumerate(cash_flows))
        if abs(dnpv) < 1e-10:
            break

        rate = rate - npv / dnpv

        if rate < -0.99:
            rate = -0.99
        elif rate > 10:
            rate = 10

    return rate if abs(npv) < 0.01 else None


def _generate_scenarios(base_returns: float, base_investment: float,
                        period_months: int) -> dict[str, ROIScenario]:
    """Genera escenarios optimista, realista y pesimista"""

    scenarios = {}

    # Escenario Pesimista (-30% returns, +20% costs)
    pessimistic_returns = base_returns * 0.7
    pessimistic_investment = base_investment * 1.2
    pessimistic_roi = ((pessimistic_returns * period_months -
                       pessimistic_investment) / pessimistic_investment) * 100

    scenarios["pessimistic"] = ROIScenario(
        name="Pesimista",
        roi_percentage=round(pessimistic_roi, 2),
        npv=pessimistic_returns * period_months - pessimistic_investment,
        payback_months=None,
        description="Escenario con reducción del 30% en retornos"
    )

    # Escenario Realista (base case)
    realistic_roi = ((base_returns * period_months - base_investment) /
                     base_investment) * 100

    scenarios["realistic"] = ROIScenario(
        name="Realista",
        roi_percentage=round(realistic_roi, 2),
        npv=base_returns * period_months - base_investment,
        payback_months=int(base_investment / base_returns)
        if base_returns > 0 else None,
        description="Escenario base con proyecciones actuales"
    )

    # Escenario Optimista (+50% returns, -10% costs)
    optimistic_returns = base_returns * 1.5
    optimistic_investment = base_investment * 0.9
    optimistic_roi = ((optimistic_returns * period_months -
                      optimistic_investment) / optimistic_investment) * 100

    scenarios["optimistic"] = ROIScenario(
        name="Optimista",
        roi_percentage=round(optimistic_roi, 2),
        npv=optimistic_returns * period_months - optimistic_investment,
        payback_months=int(optimistic_investment / optimistic_returns)
        if optimistic_returns > 0 else None,
        description="Escenario con incremento del 50% en retornos"
    )

    return scenarios


def _analyze_investment(metrics: ROIMetrics,
                        total_investment: float) -> ROIAnalysis:
    """Analiza la inversión y genera recomendaciones inteligentes"""

    # Determinar grado de inversión
    if metrics.annualized_roi >= 50:
        grade = "Excelente"
    elif metrics.annualized_roi >= 25:
        grade = "Buena"
    elif metrics.annualized_roi >= 10:
        grade = "Regular"
    else:
        grade = "Mala"

    # Determinar nivel de riesgo
    if metrics.payback_period_months and metrics.payback_period_months <= 6:
        risk = "Bajo"
    elif metrics.payback_period_months and metrics.payback_period_months <= 18:
        risk = "Medio"
    else:
        risk = "Alto"

    recommendations = {
        "Excelente": ("Inversión altamente recomendada. "
                      "ROI excepcional con retorno rápido."),
        "Buena": ("Inversión recomendada. "
                  "Buen balance entre retorno y riesgo."),
        "Regular": ("Inversión a considerar. "
                    "Evaluar alternativas antes de decidir."),
        "Mala": ("Inversión no recomendada. "
                 "Buscar mejores oportunidades de inversión.")
    }

    # Factores clave
    key_factors = [
        f"ROI anualizado del {metrics.annualized_roi:.1f}%",
        f"Período de recuperación: {metrics.payback_period_months} meses"
        if metrics.payback_period_months else "Sin recuperación clara",
        f"VPN de ${metrics.npv:,.0f}",
        f"Nivel de riesgo: {risk}"
    ]

    if metrics.irr:
        key_factors.append(f"TIR del {metrics.irr * 100:.1f}%")

    return ROIAnalysis(
        investment_grade=grade,
        risk_level=risk,
        recommendation=recommendations[grade],
        key_factors=key_factors
    )


@router.post("/calculate", response_model=ROIResult)
async def calculate_roi(
    investment: InvestmentData,
    returns: ReturnsData,
    parameters: ParametersData
):
    """Calcula el ROI con análisis completo y escenarios"""

    try:
        # Calcular totales
        total_investment = (investment.initial_amount +
                            investment.additional_costs)
        monthly_returns = (returns.monthly_revenue_increase +
                           returns.monthly_cost_savings)

        # Generar flujo de caja
        cash_flows = [-total_investment]
        for month in range(parameters.analysis_period_months):
            monthly_flow = monthly_returns
            if month == parameters.analysis_period_months - 1:
                monthly_flow += returns.residual_value
            cash_flows.append(monthly_flow)

        # Calcular métricas principales
        total_returns = monthly_returns * parameters.analysis_period_months
        total_returns += returns.residual_value

        simple_roi = ((total_returns - total_investment) /
                      total_investment) * 100
        annualized_roi = (((total_returns / total_investment) **
                          (12 / parameters.analysis_period_months)) - 1) * 100

        # Calcular NPV
        monthly_discount_rate = parameters.discount_rate / 12
        npv = -total_investment
        for month in range(parameters.analysis_period_months):
            monthly_flow = monthly_returns
            if month == parameters.analysis_period_months - 1:
                monthly_flow += returns.residual_value
            npv += monthly_flow / ((1 + monthly_discount_rate) ** (month + 1))

        # Calcular IRR
        irr = _calculate_irr(cash_flows)

        # Calcular período de recuperación
        payback_months = None
        break_even_month = None
        cumulative = -total_investment
        for month in range(parameters.analysis_period_months):
            cumulative += monthly_returns
            if cumulative >= 0 and break_even_month is None:
                break_even_month = month + 1
                payback_months = month + 1
                break

        # Crear métricas
        metrics = ROIMetrics(
            simple_roi=round(simple_roi, 2),
            annualized_roi=round(annualized_roi, 2),
            npv=round(npv, 2),
            irr=round(irr, 4) if irr else None,
            payback_period_months=payback_months,
            break_even_month=break_even_month
        )

        # Generar escenarios
        scenarios_dict = _generate_scenarios(
            monthly_returns, total_investment,
            parameters.analysis_period_months
        )
        scenarios = list(scenarios_dict.values())

        # Generar timeline
        timeline = []
        cumulative = -total_investment
        for month in range(parameters.analysis_period_months + 1):
            if month == 0:
                timeline.append({
                    "month": 0,
                    "cash_flow": -total_investment,
                    "cumulative": cumulative,
                    "npv": -total_investment
                })
            else:
                monthly_flow = monthly_returns
                if month == parameters.analysis_period_months:
                    monthly_flow += returns.residual_value

                cumulative += monthly_flow
                npv_month = (monthly_flow /
                             ((1 + monthly_discount_rate) ** month))

                timeline.append({
                    "month": month,
                    "cash_flow": monthly_flow,
                    "cumulative": round(cumulative, 2),
                    "npv": round(npv_month, 2)
                })

        # Analizar inversión
        analysis = _analyze_investment(metrics, total_investment)

        return ROIResult(
            investment_data=investment,
            returns_data=returns,
            parameters_data=parameters,
            metrics=metrics,
            scenarios=scenarios,
            timeline=timeline,
            analysis=analysis
        )

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error en cálculo: {str(e)}"
        )
