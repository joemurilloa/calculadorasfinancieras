import pytest
from app.routers.tax import TaxCalculator, TaxInput

def test_individual_tax_calculation():
    """Prueba cálculo de impuestos para persona física"""
    input_data = TaxInput(
        taxpayer_type="individual",
        regime="simplified",
        monthly_income=50000,
        annual_income=600000,
        medical_expenses=10000,
        educational_expenses=5000,
        mortgage_interest=20000,
        donations=5000,
        vat_collected=8000,
        vat_paid=6000,
        vat_rate=0.16
    )
    
    result = TaxCalculator.calculate(input_data)
    
    # Verificar que el resultado no sea None
    assert result is not None
    
    # Verificar estructura del resultado
    assert "isr" in result.dict()
    assert "vat" in result.dict()
    assert "total_taxes" in result.dict()
    assert "net_income" in result.dict()
    
    # Verificar que los valores sean positivos
    assert result.total_taxes >= 0
    assert result.net_income >= 0
    
    # Verificar que el ingreso neto sea menor al bruto
    assert result.net_income < result.breakdown["gross_income"]

def test_business_tax_calculation():
    """Prueba cálculo de impuestos para persona moral"""
    input_data = TaxInput(
        taxpayer_type="business",
        regime="general",
        monthly_income=100000,
        annual_income=1200000,
        business_expenses=200000,
        vat_collected=16000,
        vat_paid=12000,
        vat_rate=0.16
    )
    
    result = TaxCalculator.calculate(input_data)
    
    # Verificar que el resultado no sea None
    assert result is not None
    
    # Verificar que los valores sean positivos
    assert result.total_taxes >= 0
    assert result.net_income >= 0

def test_deduction_limits():
    """Prueba que las deducciones respeten los límites legales"""
    input_data = TaxInput(
        taxpayer_type="individual",
        regime="simplified",
        monthly_income=100000,
        annual_income=1200000,
        medical_expenses=200000,  # Excede el 15% del ingreso
        educational_expenses=150000,  # Excede el 10% del ingreso
        vat_collected=0,
        vat_paid=0
    )
    
    result = TaxCalculator.calculate(input_data)
    
    # Verificar que las deducciones no excedan los límites
    medical_limit = 1200000 * 0.15  # 180,000
    educational_limit = 1200000 * 0.10  # 120,000
    
    # Las deducciones aplicadas deben ser las del límite, no las ingresadas
    assert result.breakdown["total_deductions"] <= medical_limit + educational_limit

def test_vat_calculation():
    """Prueba cálculo de IVA"""
    input_data = TaxInput(
        taxpayer_type="individual",
        regime="simplified",
        monthly_income=50000,
        annual_income=600000,
        vat_collected=10000,
        vat_paid=8000,
        vat_rate=0.16
    )
    
    result = TaxCalculator.calculate(input_data)
    
    # Verificar cálculo de IVA
    assert result.vat["vat_collected"] == 10000
    assert result.vat["vat_paid"] == 8000
    assert result.vat["vat_to_pay"] == 2000  # 10000 - 8000
    assert result.vat["vat_to_refund"] == 0

def test_vat_refund():
    """Prueba cálculo de IVA a favor"""
    input_data = TaxInput(
        taxpayer_type="individual",
        regime="simplified",
        monthly_income=50000,
        annual_income=600000,
        vat_collected=5000,
        vat_paid=8000,
        vat_rate=0.16
    )
    
    result = TaxCalculator.calculate(input_data)
    
    # Verificar cálculo de IVA a favor
    assert result.vat["vat_collected"] == 5000
    assert result.vat["vat_paid"] == 8000
    assert result.vat["vat_to_pay"] == 0
    assert result.vat["vat_to_refund"] == 3000  # 8000 - 5000

def test_zero_income():
    """Prueba con ingresos cero"""
    input_data = TaxInput(
        taxpayer_type="individual",
        regime="simplified",
        monthly_income=0,
        annual_income=0,
        vat_collected=0,
        vat_paid=0
    )
    
    result = TaxCalculator.calculate(input_data)
    
    # Con ingresos cero, no debe haber impuestos
    assert result.total_taxes == 0
    assert result.net_income == 0

def test_high_income():
    """Prueba con ingresos altos"""
    input_data = TaxInput(
        taxpayer_type="individual",
        regime="general",
        monthly_income=200000,
        annual_income=2400000,
        business_expenses=500000,
        vat_collected=32000,
        vat_paid=25000,
        vat_rate=0.16
    )
    
    result = TaxCalculator.calculate(input_data)
    
    # Verificar que el resultado sea válido
    assert result is not None
    assert result.total_taxes > 0
    assert result.net_income > 0

def test_optimization_recommendations():
    """Prueba que se generen recomendaciones de optimización"""
    input_data = TaxInput(
        taxpayer_type="individual",
        regime="general",
        monthly_income=100000,
        annual_income=1200000,
        business_expenses=100000,  # Bajo para el ingreso
        medical_expenses=5000,  # Muy bajo para el ingreso
        vat_collected=0,
        vat_paid=0
    )
    
    result = TaxCalculator.calculate(input_data)
    
    # Verificar que se generen recomendaciones
    assert len(result.tax_optimization["recommendations"]) > 0
    assert "gastos médicos" in str(result.tax_optimization["recommendations"]).lower()

def test_negative_values():
    """Prueba que no se acepten valores negativos"""
    with pytest.raises(ValueError):
        TaxInput(
            taxpayer_type="individual",
            regime="simplified",
            monthly_income=-1000,  # Valor negativo
            annual_income=600000,
            vat_collected=0,
            vat_paid=0
        )

def test_invalid_taxpayer_type():
    """Prueba con tipo de contribuyente inválido"""
    input_data = TaxInput(
        taxpayer_type="invalid_type",
        regime="simplified",
        monthly_income=50000,
        annual_income=600000,
        vat_collected=0,
        vat_paid=0
    )
    
    # Debe manejar el tipo inválido sin fallar
    result = TaxCalculator.calculate(input_data)
    assert result is not None

if __name__ == "__main__":
    pytest.main([__file__])
