from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Optional, Literal


router = APIRouter()


class LineItem(BaseModel):
    name: str = Field(..., min_length=1, max_length=64)
    amount: float = Field(..., ge=0)  # non-negative cash amounts


class CashflowRequest(BaseModel):
    """
    Precise monthly cash flow inputs. Amounts are monthly and in the same
    currency. Taxes are approximated as a cash outflow on positive
    operating profit.
    """

    starting_cash: float = Field(0, ge=0)
    revenue: List[LineItem] = Field(..., min_length=1)
    other_inflows: List[LineItem] = Field(default_factory=list)

    # Cash outflows (monthly)
    cogs: List[LineItem] = Field(default_factory=list)
    opex_fixed: List[LineItem] = Field(default_factory=list)
    opex_variable: List[LineItem] = Field(default_factory=list)
    payroll: List[LineItem] = Field(default_factory=list)
    loan_interest: List[LineItem] = Field(default_factory=list)
    loan_principal: List[LineItem] = Field(default_factory=list)
    capex: List[LineItem] = Field(default_factory=list)
    other_outflows: List[LineItem] = Field(default_factory=list)

    # effective monthly tax rate on positive operating profit
    tax_rate: float = Field(0.0, ge=0, le=1)
    round_to: int = Field(2, ge=0, le=6)


class CashflowTotals(BaseModel):
    total_inflows: float
    total_outflows: float
    taxes_cash: float
    operating_cash_flow: float
    free_cash_flow: float
    net_cash_flow: float
    ending_cash: float
    burn_rate: float
    runway_months: Optional[float]


class CashflowBreakdown(BaseModel):
    inflows: List[LineItem]
    outflows: List[LineItem]


class CashflowAnalysis(BaseModel):
    summary: str
    risk_level: Literal["low", "medium", "high"]
    recommendations: List[str]


class CashflowResponse(BaseModel):
    totals: CashflowTotals
    breakdown: CashflowBreakdown
    analysis: CashflowAnalysis


def _sum(items: List[LineItem]) -> float:
    return float(sum(i.amount for i in items))


def _round(v: float, nd: int) -> float:
    return round(float(v), nd)


@router.post("/calculate", response_model=CashflowResponse)
def calculate_cashflow(payload: CashflowRequest) -> CashflowResponse:
    # Inflows
    rev = _sum(payload.revenue)
    other_in = _sum(payload.other_inflows)
    total_inflows = rev + other_in

    # Operating outflows (cash)
    cogs = _sum(payload.cogs)
    opex_fix = _sum(payload.opex_fixed)
    opex_var = _sum(payload.opex_variable)
    payroll = _sum(payload.payroll)
    operating_cash_out = cogs + opex_fix + opex_var + payroll

    # Financing/Investing and other outflows
    interest = _sum(payload.loan_interest)
    principal = _sum(payload.loan_principal)
    capex = _sum(payload.capex)
    other_out = _sum(payload.other_outflows)

    # Approximate taxes only when there is positive operating profit
    operating_profit_approx = rev - operating_cash_out - interest
    taxes_cash = 0.0
    if operating_profit_approx > 0 and payload.tax_rate > 0:
        taxes_cash = operating_profit_approx * float(payload.tax_rate)

    # Totals
    total_outflows = (
        operating_cash_out
        + interest
        + principal
        + capex
        + other_out
        + taxes_cash
    )
    net_cash_flow = total_inflows - total_outflows
    ending_cash = payload.starting_cash + net_cash_flow

    operating_cash_flow = rev - operating_cash_out - taxes_cash
    free_cash_flow = operating_cash_flow - capex

    burn_rate = -net_cash_flow if net_cash_flow < 0 else 0.0
    runway_months = None
    if burn_rate > 0:
        runway_months = (
            payload.starting_cash / burn_rate if burn_rate else None
        )

    # Risk level heuristic
    risk_level: Literal["low", "medium", "high"]
    if net_cash_flow >= 0 and (runway_months is None or runway_months >= 6):
        risk_level = "low"
    elif net_cash_flow >= 0 or (
        runway_months is not None and runway_months >= 3
    ):
        risk_level = "medium"
    else:
        risk_level = "high"

    # Analysis & recommendations
    rnd = payload.round_to
    if net_cash_flow >= 0:
        summary = (
            f"Flujo de caja positivo de {_round(net_cash_flow, rnd)}. "
            f"Saldo final {_round(ending_cash, rnd)}. "
            f"Flujo operativo {_round(operating_cash_flow, rnd)}; "
            f"FCF {_round(free_cash_flow, rnd)}."
        )
        recommendations = [
            (
                "Considera destinar 10-20% del flujo positivo a un fondo de "
                "reserva (runway)."
            ),
            "Evalúa reducir deuda con mayor tasa utilizando el excedente.",
            (
                "Reinvierte en canales con ROI probado (p. ej., campañas con "
                "CAC < LTV)."
            ),
        ]
    else:
        summary = (
            f"Flujo de caja negativo de {_round(-net_cash_flow, rnd)} (burn). "
            f"Runway estimado: "
            f"{_round(runway_months, rnd) if runway_months else 0} meses."
        )
        # Identify top outflow buckets
        buckets = [
            ("COGS", cogs),
            ("OPEX fijo", opex_fix),
            ("OPEX variable", opex_var),
            ("Nómina", payroll),
            ("Intereses", interest),
            ("Principal deuda", principal),
            ("CapEx", capex),
            ("Otros", other_out),
        ]
        buckets.sort(key=lambda x: x[1], reverse=True)
        top = ", ".join(
            [f"{n}: {_round(v, rnd)}" for n, v in buckets[:3] if v > 0]
        )
        rec_delta_rev = max(0.0, total_outflows - total_inflows)
        recommendations = [
            (
                f"Prioriza recortes en: {top}"
                if top
                else (
                    "Revisa cada partida de gasto para identificar recortes."
                )
            ),
            "Negocia pagos con proveedores o alarga plazos para aliviar caja.",
            (
                "Objetivo de aumento de ingresos: "
                f"{_round(rec_delta_rev, rnd)} para alcanzar punto de "
                "equilibrio de caja."
            ),
        ]

    totals = CashflowTotals(
        total_inflows=_round(total_inflows, rnd),
        total_outflows=_round(total_outflows, rnd),
        taxes_cash=_round(taxes_cash, rnd),
        operating_cash_flow=_round(operating_cash_flow, rnd),
        free_cash_flow=_round(free_cash_flow, rnd),
        net_cash_flow=_round(net_cash_flow, rnd),
        ending_cash=_round(ending_cash, rnd),
        burn_rate=_round(burn_rate, rnd),
        runway_months=(
            _round(runway_months, rnd) if runway_months is not None else None
        ),
    )

    breakdown = CashflowBreakdown(
        inflows=[
            LineItem(name="Ingresos", amount=_round(rev, rnd)),
            LineItem(name="Otros ingresos", amount=_round(other_in, rnd)),
        ],
        outflows=[
            LineItem(name="COGS", amount=_round(cogs, rnd)),
            LineItem(name="OPEX fijo", amount=_round(opex_fix, rnd)),
            LineItem(name="OPEX variable", amount=_round(opex_var, rnd)),
            LineItem(name="Nómina", amount=_round(payroll, rnd)),
            LineItem(name="Impuestos (cash)", amount=_round(taxes_cash, rnd)),
            LineItem(name="Intereses", amount=_round(interest, rnd)),
            LineItem(name="Principal deuda", amount=_round(principal, rnd)),
            LineItem(name="CapEx", amount=_round(capex, rnd)),
            LineItem(name="Otros egresos", amount=_round(other_out, rnd)),
        ],
    )

    analysis = CashflowAnalysis(
        summary=summary,
        risk_level=risk_level,
        recommendations=recommendations,
    )

    return CashflowResponse(
        totals=totals, breakdown=breakdown, analysis=analysis
    )
