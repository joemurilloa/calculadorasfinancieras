import pytest
from httpx import AsyncClient, ASGITransport
from backend.app.main import app


@pytest.mark.asyncio
async def test_cashflow_positive():
    payload = {
        "starting_cash": 1000,
        "revenue": [
            {"name": "Ventas", "amount": 5000},
        ],
        "other_inflows": [
            {"name": "Otros", "amount": 200}
        ],
        "cogs": [{"name": "Materia prima", "amount": 1500}],
        "opex_fixed": [{"name": "Renta", "amount": 800}],
        "opex_variable": [{"name": "Envíos", "amount": 300}],
        "payroll": [{"name": "Sueldos", "amount": 1200}],
        "loan_interest": [{"name": "Intereses préstamo", "amount": 100}],
        "loan_principal": [{"name": "Abono capital", "amount": 200}],
        "capex": [{"name": "Maquinaria", "amount": 0}],
        "other_outflows": [],
        "tax_rate": 0.1,
        "round_to": 2,
    }
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        r = await ac.post("/api/v1/cashflow/calculate", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data["totals"]["total_inflows"] > 0
    assert data["totals"]["ending_cash"] >= 0
    assert "analysis" in data


@pytest.mark.asyncio
async def test_cashflow_validation_errors():
    payload = {
        "starting_cash": -5,
        "revenue": [],
    }
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        r = await ac.post("/api/v1/cashflow/calculate", json=payload)
    assert r.status_code == 422
