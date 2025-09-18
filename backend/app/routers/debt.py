from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import math

router = APIRouter(prefix="/debt", tags=["debt"])

class Debt(BaseModel):
    id: str = Field(..., description="ID único de la deuda")
    name: str = Field(..., description="Nombre de la deuda")
    balance: float = Field(..., ge=0, description="Saldo actual")
    interest_rate: float = Field(..., ge=0, le=100, description="Tasa de interés anual (%)")
    minimum_payment: float = Field(..., ge=0, description="Pago mínimo mensual")
    type: str = Field(..., description="Tipo de deuda")
    priority: Optional[int] = Field(None, description="Prioridad personalizada")

class DebtAnalysis(BaseModel):
    total_debt: float
    total_minimum_payments: float
    average_interest_rate: float
    highest_interest_rate: float
    lowest_balance: float
    highest_balance: float
    debt_to_income_ratio: float
    recommended_strategy: str
    reasoning: str

class DebtPayment(BaseModel):
    month: int
    debt_id: str
    debt_name: str
    payment: float
    principal: float
    interest: float
    remaining_balance: float
    is_paid_off: bool

class DebtPaymentPlan(BaseModel):
    strategy: str
    total_debt: float
    total_interest: float
    total_payments: float
    months_to_freedom: int
    monthly_payment: float
    extra_payment: float
    savings: float
    payments: List[DebtPayment]
    explanation: str
    tips: List[str]

class DebtCalculationRequest(BaseModel):
    debts: List[Debt]
    monthly_income: float = Field(..., ge=0, description="Ingreso mensual")
    extra_payment: float = Field(0, ge=0, description="Pago extra disponible")
    strategy: str = Field("avalanche", description="Estrategia de pago")
    custom_priorities: Optional[Dict[str, int]] = Field(None, description="Prioridades personalizadas")

class DebtCalculator:
    @staticmethod
    def analyze_debts(debts: List[Debt], monthly_income: float) -> DebtAnalysis:
        if not debts:
            raise ValueError("No se pueden analizar deudas vacías")
        
        total_debt = sum(debt.balance for debt in debts)
        total_minimum_payments = sum(debt.minimum_payment for debt in debts)
        average_interest_rate = sum(debt.interest_rate for debt in debts) / len(debts)
        highest_interest_rate = max(debt.interest_rate for debt in debts)
        lowest_balance = min(debt.balance for debt in debts)
        highest_balance = max(debt.balance for debt in debts)
        debt_to_income_ratio = total_debt / monthly_income if monthly_income > 0 else 0

        # Determinar estrategia recomendada
        if len(debts) == 1:
            recommended_strategy = "custom"
            reasoning = "Solo tienes una deuda. Enfócate en pagarla lo más rápido posible."
        elif highest_interest_rate - average_interest_rate > 5:
            recommended_strategy = "avalanche"
            reasoning = "Tienes una deuda con tasa de interés muy alta. El método avalancha te ahorrará más dinero."
        elif lowest_balance < total_debt * 0.2:
            recommended_strategy = "snowball"
            reasoning = "Tienes deudas pequeñas que puedes pagar rápido. El método bola de nieve te dará motivación."
        else:
            recommended_strategy = "avalanche"
            reasoning = "El método avalancha te ahorrará más dinero a largo plazo."

        return DebtAnalysis(
            total_debt=total_debt,
            total_minimum_payments=total_minimum_payments,
            average_interest_rate=round(average_interest_rate, 2),
            highest_interest_rate=highest_interest_rate,
            lowest_balance=lowest_balance,
            highest_balance=highest_balance,
            debt_to_income_ratio=round(debt_to_income_ratio, 2),
            recommended_strategy=recommended_strategy,
            reasoning=reasoning
        )

    @staticmethod
    def calculate_avalanche_strategy(debts: List[Debt], extra_payment: float, monthly_income: float) -> DebtPaymentPlan:
        # Ordenar deudas por tasa de interés (mayor a menor)
        sorted_debts = sorted(debts, key=lambda x: x.interest_rate, reverse=True)
        
        total_debt = sum(debt.balance for debt in debts)
        total_minimum_payments = sum(debt.minimum_payment for debt in debts)
        total_monthly_payment = total_minimum_payments + extra_payment
        
        payments = []
        month = 1
        total_interest = 0
        current_debts = [{"id": debt.id, "name": debt.name, "balance": debt.balance, "interest_rate": debt.interest_rate, "minimum_payment": debt.minimum_payment} for debt in sorted_debts]
        
        while any(debt["balance"] > 0 for debt in current_debts):
            for debt in current_debts:
                if debt["balance"] <= 0:
                    continue
                
                monthly_rate = debt["interest_rate"] / 100 / 12
                interest_payment = debt["balance"] * monthly_rate
                minimum_payment = debt["minimum_payment"]
                
                # Si es la deuda con mayor interés, agregar el pago extra
                is_highest_interest = debt["id"] == sorted_debts[0].id
                extra_for_this_debt = extra_payment if is_highest_interest else 0
                total_payment = min(minimum_payment + extra_for_this_debt, debt["balance"] + interest_payment)
                
                principal_payment = max(0, total_payment - interest_payment)
                new_balance = max(0, debt["balance"] - principal_payment)
                
                payments.append(DebtPayment(
                    month=month,
                    debt_id=debt["id"],
                    debt_name=debt["name"],
                    payment=round(total_payment, 2),
                    principal=round(principal_payment, 2),
                    interest=round(interest_payment, 2),
                    remaining_balance=round(new_balance, 2),
                    is_paid_off=new_balance <= 0
                ))
                
                debt["balance"] = new_balance
                total_interest += interest_payment
            
            # Remover deudas pagadas
            current_debts = [debt for debt in current_debts if debt["balance"] > 0]
            month += 1
            
            # Prevenir bucle infinito
            if month > 600:
                break
        
        months_to_freedom = month - 1
        total_payments = sum(payment.payment for payment in payments)
        savings = DebtCalculator._calculate_savings(debts, total_payments)
        
        return DebtPaymentPlan(
            strategy="avalanche",
            total_debt=total_debt,
            total_interest=round(total_interest, 2),
            total_payments=round(total_payments, 2),
            months_to_freedom=months_to_freedom,
            monthly_payment=round(total_monthly_payment, 2),
            extra_payment=extra_payment,
            savings=round(savings, 2),
            payments=payments,
            explanation=DebtCalculator._generate_avalanche_explanation(debts, months_to_freedom, savings),
            tips=DebtCalculator._generate_avalanche_tips(debts, extra_payment)
        )

    @staticmethod
    def calculate_snowball_strategy(debts: List[Debt], extra_payment: float, monthly_income: float) -> DebtPaymentPlan:
        # Ordenar deudas por balance (menor a mayor)
        sorted_debts = sorted(debts, key=lambda x: x.balance)
        
        total_debt = sum(debt.balance for debt in debts)
        total_minimum_payments = sum(debt.minimum_payment for debt in debts)
        total_monthly_payment = total_minimum_payments + extra_payment
        
        payments = []
        month = 1
        total_interest = 0
        current_debts = [{"id": debt.id, "name": debt.name, "balance": debt.balance, "interest_rate": debt.interest_rate, "minimum_payment": debt.minimum_payment} for debt in sorted_debts]
        available_extra = extra_payment
        
        while any(debt["balance"] > 0 for debt in current_debts):
            for debt in current_debts:
                if debt["balance"] <= 0:
                    continue
                
                monthly_rate = debt["interest_rate"] / 100 / 12
                interest_payment = debt["balance"] * monthly_rate
                minimum_payment = debt["minimum_payment"]
                
                # Si es la deuda más pequeña, agregar el pago extra disponible
                is_smallest_debt = debt["id"] == sorted_debts[0].id
                extra_for_this_debt = available_extra if is_smallest_debt else 0
                total_payment = min(minimum_payment + extra_for_this_debt, debt["balance"] + interest_payment)
                
                principal_payment = max(0, total_payment - interest_payment)
                new_balance = max(0, debt["balance"] - principal_payment)
                
                payments.append(DebtPayment(
                    month=month,
                    debt_id=debt["id"],
                    debt_name=debt["name"],
                    payment=round(total_payment, 2),
                    principal=round(principal_payment, 2),
                    interest=round(interest_payment, 2),
                    remaining_balance=round(new_balance, 2),
                    is_paid_off=new_balance <= 0
                ))
                
                debt["balance"] = new_balance
                total_interest += interest_payment
                
                # Si la deuda se pagó, liberar el pago mínimo para la siguiente
                if new_balance <= 0 and is_smallest_debt:
                    available_extra += minimum_payment
                    # Remover deuda pagada y actualizar la siguiente más pequeña
                    current_debts = [d for d in current_debts if d["balance"] > 0]
                    if current_debts:
                        sorted_debts.pop(0)
            
            # Remover deudas pagadas
            current_debts = [debt for debt in current_debts if debt["balance"] > 0]
            month += 1
            
            # Prevenir bucle infinito
            if month > 600:
                break
        
        months_to_freedom = month - 1
        total_payments = sum(payment.payment for payment in payments)
        savings = DebtCalculator._calculate_savings(debts, total_payments)
        
        return DebtPaymentPlan(
            strategy="snowball",
            total_debt=total_debt,
            total_interest=round(total_interest, 2),
            total_payments=round(total_payments, 2),
            months_to_freedom=months_to_freedom,
            monthly_payment=round(total_monthly_payment, 2),
            extra_payment=extra_payment,
            savings=round(savings, 2),
            payments=payments,
            explanation=DebtCalculator._generate_snowball_explanation(debts, months_to_freedom, savings),
            tips=DebtCalculator._generate_snowball_tips(debts, extra_payment)
        )

    @staticmethod
    def calculate_custom_strategy(debts: List[Debt], extra_payment: float, monthly_income: float, custom_priorities: Dict[str, int]) -> DebtPaymentPlan:
        # Ordenar deudas por prioridad personalizada
        sorted_debts = sorted(debts, key=lambda x: custom_priorities.get(x.id, 0))
        
        total_debt = sum(debt.balance for debt in debts)
        total_minimum_payments = sum(debt.minimum_payment for debt in debts)
        total_monthly_payment = total_minimum_payments + extra_payment
        
        payments = []
        month = 1
        total_interest = 0
        current_debts = [{"id": debt.id, "name": debt.name, "balance": debt.balance, "interest_rate": debt.interest_rate, "minimum_payment": debt.minimum_payment} for debt in sorted_debts]
        available_extra = extra_payment
        
        while any(debt["balance"] > 0 for debt in current_debts):
            for debt in current_debts:
                if debt["balance"] <= 0:
                    continue
                
                monthly_rate = debt["interest_rate"] / 100 / 12
                interest_payment = debt["balance"] * monthly_rate
                minimum_payment = debt["minimum_payment"]
                
                # Si es la deuda con mayor prioridad, agregar el pago extra disponible
                is_highest_priority = debt["id"] == sorted_debts[0].id
                extra_for_this_debt = available_extra if is_highest_priority else 0
                total_payment = min(minimum_payment + extra_for_this_debt, debt["balance"] + interest_payment)
                
                principal_payment = max(0, total_payment - interest_payment)
                new_balance = max(0, debt["balance"] - principal_payment)
                
                payments.append(DebtPayment(
                    month=month,
                    debt_id=debt["id"],
                    debt_name=debt["name"],
                    payment=round(total_payment, 2),
                    principal=round(principal_payment, 2),
                    interest=round(interest_payment, 2),
                    remaining_balance=round(new_balance, 2),
                    is_paid_off=new_balance <= 0
                ))
                
                debt["balance"] = new_balance
                total_interest += interest_payment
                
                # Si la deuda se pagó, liberar el pago mínimo para la siguiente
                if new_balance <= 0 and is_highest_priority:
                    available_extra += minimum_payment
                    # Remover deuda pagada y actualizar la siguiente con mayor prioridad
                    current_debts = [d for d in current_debts if d["balance"] > 0]
                    if current_debts:
                        sorted_debts.pop(0)
            
            # Remover deudas pagadas
            current_debts = [debt for debt in current_debts if debt["balance"] > 0]
            month += 1
            
            # Prevenir bucle infinito
            if month > 600:
                break
        
        months_to_freedom = month - 1
        total_payments = sum(payment.payment for payment in payments)
        savings = DebtCalculator._calculate_savings(debts, total_payments)
        
        return DebtPaymentPlan(
            strategy="custom",
            total_debt=total_debt,
            total_interest=round(total_interest, 2),
            total_payments=round(total_payments, 2),
            months_to_freedom=months_to_freedom,
            monthly_payment=round(total_monthly_payment, 2),
            extra_payment=extra_payment,
            savings=round(savings, 2),
            payments=payments,
            explanation=DebtCalculator._generate_custom_explanation(debts, months_to_freedom, savings),
            tips=DebtCalculator._generate_custom_tips(debts, extra_payment)
        )

    @staticmethod
    def _calculate_savings(debts: List[Debt], total_payments: float) -> float:
        # Calcular cuánto pagarían solo con pagos mínimos
        total_minimum_payments = sum(debt.minimum_payment for debt in debts)
        average_interest_rate = sum(debt.interest_rate for debt in debts) / len(debts)
        total_debt = sum(debt.balance for debt in debts)
        
        # Estimación simple de ahorros
        months_with_minimums = total_debt / total_minimum_payments if total_minimum_payments > 0 else 0
        interest_with_minimums = total_debt * (average_interest_rate / 100) * (months_with_minimums / 12)
        total_with_minimums = total_debt + interest_with_minimums
        
        return max(0, total_with_minimums - total_payments)

    @staticmethod
    def _generate_avalanche_explanation(debts: List[Debt], months_to_freedom: int, savings: float) -> str:
        highest_interest_debt = max(debts, key=lambda x: x.interest_rate)
        return f"El método avalancha te enfoca en pagar primero la deuda con mayor tasa de interés ({highest_interest_debt.name} al {highest_interest_debt.interest_rate}%). Esto te ahorrará ${savings:,.2f} en intereses y te liberará de deudas en {months_to_freedom} meses. Es la estrategia más eficiente económicamente."

    @staticmethod
    def _generate_snowball_explanation(debts: List[Debt], months_to_freedom: int, savings: float) -> str:
        smallest_debt = min(debts, key=lambda x: x.balance)
        return f"El método bola de nieve te enfoca en pagar primero la deuda más pequeña ({smallest_debt.name} de ${smallest_debt.balance:,.2f}). Esto te dará motivación al ver progreso rápido y liberará dinero para pagar las siguientes deudas. Te liberarás en {months_to_freedom} meses."

    @staticmethod
    def _generate_custom_explanation(debts: List[Debt], months_to_freedom: int, savings: float) -> str:
        return f"Tu estrategia personalizada te permite priorizar las deudas según tus necesidades específicas. Esto puede incluir factores como relaciones con acreedores, plazos de vencimiento, o metas personales. Te liberarás en {months_to_freedom} meses."

    @staticmethod
    def _generate_avalanche_tips(debts: List[Debt], extra_payment: float) -> List[str]:
        return [
            "Mantén el enfoque en la deuda con mayor interés, no te distraigas con otras",
            "Si puedes aumentar el pago extra, hazlo para acelerar el proceso",
            "Considera transferir deudas de alto interés a tarjetas con 0% APR si es posible",
            "Revisa tu presupuesto mensualmente para encontrar dinero extra",
            "Celebra cada deuda que pagues completamente"
        ]

    @staticmethod
    def _generate_snowball_tips(debts: List[Debt], extra_payment: float) -> List[str]:
        return [
            "Paga la deuda más pequeña primero, sin importar la tasa de interés",
            "Una vez que pagues una deuda, usa ese dinero para la siguiente",
            "Mantén un registro visual de tu progreso para motivarte",
            "Comparte tu progreso con familiares o amigos para mantenerte responsable",
            "No agregues nuevas deudas mientras pagas las existentes"
        ]

    @staticmethod
    def _generate_custom_tips(debts: List[Debt], extra_payment: float) -> List[str]:
        return [
            "Revisa y ajusta tus prioridades según cambien tus circunstancias",
            "Considera factores como plazos de vencimiento y relaciones con acreedores",
            "Mantén un enfoque consistente en tu estrategia elegida",
            "Documenta por qué elegiste cada prioridad para mantenerte enfocado",
            "Revisa tu progreso mensualmente y ajusta si es necesario"
        ]

@router.post("/analyze", response_model=DebtAnalysis)
async def analyze_debts(request: DebtCalculationRequest):
    """
    Analiza las deudas y recomienda una estrategia
    """
    try:
        analysis = DebtCalculator.analyze_debts(request.debts, request.monthly_income)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error analizando deudas: {str(e)}")

@router.post("/calculate", response_model=DebtPaymentPlan)
async def calculate_payment_plan(request: DebtCalculationRequest):
    """
    Calcula un plan de pagos personalizado
    """
    try:
        if not request.debts:
            raise ValueError("No se pueden calcular planes sin deudas")
        
        if request.monthly_income <= 0:
            raise ValueError("El ingreso mensual debe ser mayor a 0")
        
        if request.strategy == "avalanche":
            plan = DebtCalculator.calculate_avalanche_strategy(request.debts, request.extra_payment, request.monthly_income)
        elif request.strategy == "snowball":
            plan = DebtCalculator.calculate_snowball_strategy(request.debts, request.extra_payment, request.monthly_income)
        elif request.strategy == "custom":
            if not request.custom_priorities:
                raise ValueError("Las prioridades personalizadas son requeridas para la estrategia custom")
            plan = DebtCalculator.calculate_custom_strategy(request.debts, request.extra_payment, request.monthly_income, request.custom_priorities)
        else:
            raise ValueError(f"Estrategia no válida: {request.strategy}")
        
        return plan
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error calculando plan de pagos: {str(e)}")

@router.get("/strategies")
async def get_debt_strategies():
    """
    Obtiene información sobre las estrategias de pago disponibles
    """
    strategies = {
        "avalanche": {
            "name": "Método Avalancha",
            "description": "Paga primero la deuda con mayor tasa de interés",
            "pros": ["Ahorra más dinero en intereses", "Estratégicamente eficiente"],
            "cons": ["Puede tomar más tiempo ver progreso", "Requiere disciplina"],
            "best_for": "Personas que quieren ahorrar dinero y tienen disciplina"
        },
        "snowball": {
            "name": "Método Bola de Nieve",
            "description": "Paga primero la deuda más pequeña",
            "pros": ["Motivación rápida", "Libera dinero rápido"],
            "cons": ["Puede costar más en intereses", "No es matemáticamente óptimo"],
            "best_for": "Personas que necesitan motivación y progreso visible"
        },
        "custom": {
            "name": "Estrategia Personalizada",
            "description": "Prioriza deudas según tus necesidades específicas",
            "pros": ["Flexibilidad total", "Se adapta a tu situación"],
            "cons": ["Requiere más planificación", "Puede no ser óptimo"],
            "best_for": "Personas con circunstancias especiales o preferencias específicas"
        }
    }
    return strategies

@router.get("/debt-types")
async def get_debt_types():
    """
    Obtiene los tipos de deudas disponibles
    """
    debt_types = {
        "credit_card": {
            "name": "Tarjeta de Crédito",
            "icon": "💳",
            "color": "red",
            "description": "Deudas de tarjetas de crédito"
        },
        "personal_loan": {
            "name": "Préstamo Personal",
            "icon": "🏦",
            "color": "blue",
            "description": "Préstamos personales de bancos"
        },
        "mortgage": {
            "name": "Hipoteca",
            "icon": "🏠",
            "color": "green",
            "description": "Préstamos hipotecarios"
        },
        "car_loan": {
            "name": "Préstamo de Auto",
            "icon": "🚗",
            "color": "purple",
            "description": "Préstamos para vehículos"
        },
        "student_loan": {
            "name": "Préstamo Estudiantil",
            "icon": "🎓",
            "color": "indigo",
            "description": "Préstamos para educación"
        },
        "other": {
            "name": "Otra Deuda",
            "icon": "📋",
            "color": "gray",
            "description": "Otros tipos de deudas"
        }
    }
    return debt_types
