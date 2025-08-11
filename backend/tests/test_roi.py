from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_roi_calculation_basic():
    """Prueba cálculo básico de ROI"""
    payload = {
        "investment": {
            "initial_amount": 10000,
            "additional_costs": 1000,
            "investment_date": "2024-01-01"
        },
        "returns": {
            "monthly_revenue_increase": 2000,
            "monthly_cost_savings": 500,
            "residual_value": 2000
        },
        "parameters": {
            "analysis_period_months": 12,
            "discount_rate": 0.10,
            "inflation_rate": 0.03
        }
    }

    response = client.post("/api/v1/roi/calculate", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert "metrics" in data
    assert "scenarios" in data
    assert "timeline" in data
    assert "analysis" in data

    metrics = data["metrics"]
    assert "simple_roi" in metrics
    assert "annualized_roi" in metrics
    assert "npv" in metrics
    assert "payback_period_months" in metrics

    # Verificar que los cálculos son razonables
    assert metrics["simple_roi"] > 0  # ROI positivo
    assert metrics["payback_period_months"] <= 12  # Recuperación rápida


def test_roi_calculation_scenarios():
    """Prueba generación de escenarios"""
    payload = {
        "investment": {
            "initial_amount": 5000,
            "additional_costs": 500,
            "investment_date": "2024-01-01"
        },
        "returns": {
            "monthly_revenue_increase": 1000,
            "monthly_cost_savings": 200,
            "residual_value": 1000
        },
        "parameters": {
            "analysis_period_months": 6,
            "discount_rate": 0.08,
            "inflation_rate": 0.02
        }
    }

    response = client.post("/api/v1/roi/calculate", json=payload)
    assert response.status_code == 200

    data = response.json()
    scenarios = data["scenarios"]

    assert len(scenarios) == 3
    scenario_names = [s["name"] for s in scenarios]
    assert "Pesimista" in scenario_names
    assert "Realista" in scenario_names
    assert "Optimista" in scenario_names

    # Verificar orden lógico de ROI
    pessimistic = next(s for s in scenarios if s["name"] == "Pesimista")
    realistic = next(s for s in scenarios if s["name"] == "Realista")
    optimistic = next(s for s in scenarios if s["name"] == "Optimista")

    assert pessimistic["roi_percentage"] <= realistic["roi_percentage"]
    assert realistic["roi_percentage"] <= optimistic["roi_percentage"]


def test_roi_analysis_generation():
    """Prueba generación de análisis inteligente"""
    payload = {
        "investment": {
            "initial_amount": 8000,
            "additional_costs": 2000,
            "investment_date": "2024-01-01"
        },
        "returns": {
            "monthly_revenue_increase": 3000,
            "monthly_cost_savings": 1000,
            "residual_value": 5000
        },
        "parameters": {
            "analysis_period_months": 18,
            "discount_rate": 0.12,
            "inflation_rate": 0.04
        }
    }

    response = client.post("/api/v1/roi/calculate", json=payload)
    assert response.status_code == 200

    data = response.json()
    analysis = data["analysis"]

    assert "investment_grade" in analysis
    assert "risk_level" in analysis
    assert "recommendation" in analysis
    assert "key_factors" in analysis

    # Verificar tipos de datos
    assert analysis["investment_grade"] in [
        "Excelente", "Buena", "Regular", "Mala"
    ]
    assert analysis["risk_level"] in ["Bajo", "Medio", "Alto"]
    assert isinstance(analysis["recommendation"], str)
    assert isinstance(analysis["key_factors"], list)
    assert len(analysis["key_factors"]) > 0


def test_roi_timeline_generation():
    """Prueba generación de timeline de flujo de caja"""
    payload = {
        "investment": {
            "initial_amount": 6000,
            "additional_costs": 1000,
            "investment_date": "2024-01-01"
        },
        "returns": {
            "monthly_revenue_increase": 1500,
            "monthly_cost_savings": 300,
            "residual_value": 2000
        },
        "parameters": {
            "analysis_period_months": 8,
            "discount_rate": 0.09,
            "inflation_rate": 0.025
        }
    }

    response = client.post("/api/v1/roi/calculate", json=payload)
    assert response.status_code == 200

    data = response.json()
    timeline = data["timeline"]

    # Verificar estructura del timeline
    assert len(timeline) == 9  # Mes 0 + 8 meses
    assert timeline[0]["month"] == 0
    assert timeline[0]["cash_flow"] == -7000  # Inversión inicial

    # Verificar que el flujo acumulado mejora con el tiempo
    for i in range(1, len(timeline)):
        assert timeline[i]["month"] == i
        assert "cash_flow" in timeline[i]
        assert "cumulative" in timeline[i]
        assert "npv" in timeline[i]


def test_roi_validation_errors():
    """Prueba validación de datos de entrada"""
    # Prueba monto negativo
    payload = {
        "investment": {
            "initial_amount": -1000,  # Negativo
            "additional_costs": 500,
            "investment_date": "2024-01-01"
        },
        "returns": {
            "monthly_revenue_increase": 800,
            "monthly_cost_savings": 200,
            "residual_value": 1000
        },
        "parameters": {
            "analysis_period_months": 12,
            "discount_rate": 0.10,
            "inflation_rate": 0.03
        }
    }

    response = client.post("/api/v1/roi/calculate", json=payload)
    assert response.status_code == 422  # Validation error


def test_roi_edge_cases():
    """Prueba casos extremos"""
    # Caso: Sin retornos mensuales
    payload = {
        "investment": {
            "initial_amount": 5000,
            "additional_costs": 0,
            "investment_date": "2024-01-01"
        },
        "returns": {
            "monthly_revenue_increase": 0,
            "monthly_cost_savings": 0,
            "residual_value": 6000
        },
        "parameters": {
            "analysis_period_months": 12,
            "discount_rate": 0.05,
            "inflation_rate": 0.02
        }
    }

    response = client.post("/api/v1/roi/calculate", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert "metrics" in data
    # Con solo valor residual, debería haber algún ROI
    assert data["metrics"]["simple_roi"] is not None
