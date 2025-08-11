import pytest
from httpx import AsyncClient, ASGITransport
from backend.app.main import app


@pytest.mark.asyncio
async def test_health():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        r = await ac.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "healthy"


@pytest.mark.asyncio
async def test_pricing_calculate_basic():
    payload = {
        "product_name": "Test",
        "cost_materials": 50,
        "cost_labor": 30,
        "cost_overhead": 20,
        "desired_profit_margin": 25,
        "competitor_prices": [90, 110, 100]
    }
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        r = await ac.post("/api/v1/pricing/calculate", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data["recommended_price"] > 0
    assert data["cost_breakdown"]["total_cost"] == 100.0
    assert data["profit_margin"] == 25


@pytest.mark.asyncio
async def test_pricing_margin_out_of_range():
    payload = {
        "product_name": "Test",
        "cost_materials": 10,
        "cost_labor": 10,
        "cost_overhead": 10,
        "desired_profit_margin": 150,  # inválido
        "competitor_prices": []
    }
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        r = await ac.post("/api/v1/pricing/calculate", json=payload)
    assert r.status_code == 422  # Pydantic validation error
