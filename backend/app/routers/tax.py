from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
import math

router = APIRouter(prefix="/tax", tags=["tax"])

class TaxInput(BaseModel):
    # Información del contribuyente
    taxpayer_type: str = Field(..., description="Tipo de contribuyente: individual o business")
    regime: str = Field(..., description="Régimen fiscal")
    
    # Ingresos
    monthly_income: float = Field(..., ge=0, description="Ingreso mensual")
    annual_income: float = Field(..., ge=0, description="Ingreso anual")
    
    # Gastos y deducciones
    business_expenses: float = Field(0, ge=0, description="Gastos de negocio")
    personal_deductions: float = Field(0, ge=0, description="Deducciones personales")
    medical_expenses: float = Field(0, ge=0, description="Gastos médicos")
    educational_expenses: float = Field(0, ge=0, description="Gastos educativos")
    mortgage_interest: float = Field(0, ge=0, description="Intereses hipotecarios")
    donations: float = Field(0, ge=0, description="Donaciones")
    
    # IVA
    vat_rate: float = Field(0.16, ge=0, le=1, description="Tasa de IVA")
    vat_collected: float = Field(0, ge=0, description="IVA cobrado")
    vat_paid: float = Field(0, ge=0, description="IVA pagado")
    
    # Retenciones
    withholding_tax: float = Field(0, ge=0, description="Retenciones")
    isr_withholding: float = Field(0, ge=0, description="Retención de ISR")
    
    # Otros
    other_income: float = Field(0, ge=0, description="Otros ingresos")
    other_deductions: float = Field(0, ge=0, description="Otras deducciones")

class TaxResult(BaseModel):
    isr: dict
    vat: dict
    total_taxes: float
    net_income: float
    tax_optimization: dict
    breakdown: dict

class TaxCalculator:
    # Tablas de ISR 2024 - Personas Físicas
    ISR_TABLES = {
        "individual": [
            {"min": 0, "max": 12892.32, "rate": 0.0192, "fixed": 0},
            {"min": 12892.33, "max": 10928.33, "rate": 0.0640, "fixed": 247.23},
            {"min": 10928.34, "max": 10928.33, "rate": 0.1088, "fixed": 914.96},
            {"min": 10928.34, "max": 10928.33, "rate": 0.1600, "fixed": 2000.00},
            {"min": 10928.34, "max": 10928.33, "rate": 0.1792, "fixed": 3000.00},
            {"min": 10928.34, "max": 10928.33, "rate": 0.2136, "fixed": 4000.00},
            {"min": 10928.34, "max": 10928.33, "rate": 0.2352, "fixed": 5000.00},
            {"min": 10928.34, "max": 10928.33, "rate": 0.3000, "fixed": 6000.00},
            {"min": 10928.34, "max": 10928.33, "rate": 0.3200, "fixed": 7000.00},
            {"min": 10928.34, "max": 10928.33, "rate": 0.3400, "fixed": 8000.00},
            {"min": 10928.34, "max": 10928.33, "rate": 0.3500, "fixed": 9000.00},
            {"min": 10928.34, "max": 10928.33, "rate": 0.4000, "fixed": 10000.00}
        ],
        "business": [
            {"min": 0, "max": 300000, "rate": 0.30, "fixed": 0},
            {"min": 300001, "max": 600000, "rate": 0.30, "fixed": 90000},
            {"min": 600001, "max": 1000000, "rate": 0.30, "fixed": 180000},
            {"min": 1000001, "max": 2000000, "rate": 0.30, "fixed": 300000},
            {"min": 2000001, "max": 3000000, "rate": 0.30, "fixed": 600000},
            {"min": 3000001, "max": 999999999, "rate": 0.30, "fixed": 900000}
        ]
    }

    # Límites de deducciones 2024
    DEDUCTION_LIMITS = {
        "medical": 0.15,  # 15% del ingreso
        "educational": 0.10,  # 10% del ingreso
        "mortgage": 0.10,  # 10% del ingreso
        "donations": 0.07,  # 7% del ingreso
        "total": 0.15  # 15% del ingreso total
    }

    @classmethod
    def calculate(cls, input_data: TaxInput) -> TaxResult:
        # Calcular ingresos totales
        total_income = input_data.monthly_income * 12 + input_data.other_income
        
        # Calcular deducciones totales
        total_deductions = cls._calculate_total_deductions(input_data, total_income)
        
        # Calcular ingreso gravable
        taxable_income = max(0, total_income - total_deductions)
        
        # Calcular ISR
        isr_result = cls._calculate_isr(taxable_income, input_data.taxpayer_type)
        
        # Calcular IVA
        vat_result = cls._calculate_vat(input_data)
        
        # Calcular totales
        total_taxes = isr_result["isr_calculated"] + vat_result["vat_to_pay"]
        net_income = total_income - total_taxes
        
        # Generar recomendaciones de optimización
        optimization = cls._generate_optimization_recommendations(input_data, total_income, total_deductions)
        
        return TaxResult(
            isr=isr_result,
            vat=vat_result,
            total_taxes=round(total_taxes, 2),
            net_income=round(net_income, 2),
            tax_optimization=optimization,
            breakdown={
                "gross_income": total_income,
                "total_deductions": total_deductions,
                "taxable_income": taxable_income,
                "total_taxes": total_taxes,
                "net_income": net_income
            }
        )

    @classmethod
    def _calculate_total_deductions(cls, input_data: TaxInput, total_income: float) -> float:
        total_deductions = 0
        
        # Gastos de negocio (solo para régimen general)
        if input_data.regime == "general":
            total_deductions += input_data.business_expenses
        
        # Deducciones personales con límites
        medical_limit = total_income * cls.DEDUCTION_LIMITS["medical"]
        total_deductions += min(input_data.medical_expenses, medical_limit)
        
        educational_limit = total_income * cls.DEDUCTION_LIMITS["educational"]
        total_deductions += min(input_data.educational_expenses, educational_limit)
        
        mortgage_limit = total_income * cls.DEDUCTION_LIMITS["mortgage"]
        total_deductions += min(input_data.mortgage_interest, mortgage_limit)
        
        donations_limit = total_income * cls.DEDUCTION_LIMITS["donations"]
        total_deductions += min(input_data.donations, donations_limit)
        
        # Otras deducciones
        total_deductions += input_data.other_deductions
        
        # Límite total de deducciones
        max_deductions = total_income * cls.DEDUCTION_LIMITS["total"]
        return min(total_deductions, max_deductions)

    @classmethod
    def _calculate_isr(cls, taxable_income: float, taxpayer_type: str) -> dict:
        table = cls.ISR_TABLES[taxpayer_type]
        
        for bracket in table:
            if bracket["min"] <= taxable_income <= bracket["max"]:
                isr_calculated = (taxable_income - bracket["min"]) * bracket["rate"] + bracket["fixed"]
                effective_rate = (isr_calculated / taxable_income) * 100 if taxable_income > 0 else 0
                
                return {
                    "taxable_income": round(taxable_income, 2),
                    "isr_calculated": round(isr_calculated, 2),
                    "isr_withholding": 0,  # Se calculará por separado
                    "isr_to_pay": round(isr_calculated, 2),
                    "effective_rate": round(effective_rate, 2)
                }
        
        # Si no encuentra bracket, usar el último
        last_bracket = table[-1]
        isr_calculated = (taxable_income - last_bracket["min"]) * last_bracket["rate"] + last_bracket["fixed"]
        effective_rate = (isr_calculated / taxable_income) * 100 if taxable_income > 0 else 0
        
        return {
            "taxable_income": round(taxable_income, 2),
            "isr_calculated": round(isr_calculated, 2),
            "isr_withholding": 0,
            "isr_to_pay": round(isr_calculated, 2),
            "effective_rate": round(effective_rate, 2)
        }

    @classmethod
    def _calculate_vat(cls, input_data: TaxInput) -> dict:
        vat_collected = input_data.vat_collected
        vat_paid = input_data.vat_paid
        vat_to_pay = max(0, vat_collected - vat_paid)
        vat_to_refund = max(0, vat_paid - vat_collected)
        
        return {
            "vat_collected": round(vat_collected, 2),
            "vat_paid": round(vat_paid, 2),
            "vat_to_pay": round(vat_to_pay, 2),
            "vat_to_refund": round(vat_to_refund, 2)
        }

    @classmethod
    def _generate_optimization_recommendations(cls, input_data: TaxInput, total_income: float, total_deductions: float) -> dict:
        recommendations = []
        potential_savings = 0
        
        # Verificar límites de deducciones
        medical_limit = total_income * cls.DEDUCTION_LIMITS["medical"]
        if input_data.medical_expenses < medical_limit:
            recommendations.append(f"Puedes deducir hasta ${medical_limit:,.2f} en gastos médicos")
        
        educational_limit = total_income * cls.DEDUCTION_LIMITS["educational"]
        if input_data.educational_expenses < educational_limit:
            recommendations.append(f"Puedes deducir hasta ${educational_limit:,.2f} en gastos educativos")
        
        # Recomendaciones por régimen
        if input_data.regime == "simplified":
            recommendations.append("Considera cambiar al régimen general si tienes más de $2,000,000 en ingresos")
        
        if input_data.regime == "general" and input_data.business_expenses < total_income * 0.3:
            recommendations.append("Aumenta tus gastos de negocio para reducir el ISR")
            potential_savings += (total_income * 0.3 - input_data.business_expenses) * 0.3
        
        # Optimización de IVA
        if input_data.vat_paid < input_data.vat_collected * 0.5:
            recommendations.append("Considera aumentar tus compras con IVA para reducir el IVA a pagar")
        
        return {
            "recommendations": recommendations,
            "potential_savings": round(potential_savings, 2)
        }

@router.post("/calculate", response_model=TaxResult)
async def calculate_taxes(input_data: TaxInput):
    """
    Calcula impuestos para personas físicas y morales
    """
    try:
        result = TaxCalculator.calculate(input_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error calculando impuestos: {str(e)}")

@router.get("/regimes")
async def get_tax_regimes():
    """
    Obtiene información sobre los regímenes fiscales disponibles
    """
    regimes = {
        "simplified": {
            "name": "Régimen Simplificado de Confianza",
            "description": "Para personas físicas con ingresos menores a $2,000,000",
            "max_income": 2000000,
            "tax_rate": 0.02
        },
        "general": {
            "name": "Régimen General",
            "description": "Para personas físicas y morales con ingresos mayores a $2,000,000",
            "max_income": None,
            "tax_rate": "Variable según tabla ISR"
        },
        "wage_earner": {
            "name": "Sueldos y Salarios",
            "description": "Para trabajadores asalariados",
            "max_income": None,
            "tax_rate": "Variable según tabla ISR"
        },
        "professional_services": {
            "name": "Servicios Profesionales",
            "description": "Para profesionistas independientes",
            "max_income": None,
            "tax_rate": "Variable según tabla ISR"
        }
    }
    return regimes

@router.get("/deduction-limits")
async def get_deduction_limits():
    """
    Obtiene los límites de deducciones para el año actual
    """
    limits = {
        "medical": {
            "percentage": 0.15,
            "description": "Gastos médicos (máximo 15% del ingreso)"
        },
        "educational": {
            "percentage": 0.10,
            "description": "Gastos educativos (máximo 10% del ingreso)"
        },
        "mortgage": {
            "percentage": 0.10,
            "description": "Intereses hipotecarios (máximo 10% del ingreso)"
        },
        "donations": {
            "percentage": 0.07,
            "description": "Donaciones (máximo 7% del ingreso)"
        },
        "total": {
            "percentage": 0.15,
            "description": "Deducciones totales (máximo 15% del ingreso)"
        }
    }
    return limits
