import { PricingResult } from '@/hooks/usePricingCalculator';
import { BreakevenResult, BreakevenFormData } from '@/hooks/useBreakevenCalculator';
import type { CashflowResult } from '@/hooks/useCashflowCalculator';
import type { ROIResult } from '@/hooks/useROICalculator';
import { formatCurrency, formatPercentage } from './formatters';

export const exportToPDF = async (result: PricingResult, productName: string) => {
  try {
    // Crear contenido HTML profesional para el PDF
    const currentDate = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Análisis de Precios - ${productName}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1e293b;
            margin: 0;
            padding: 40px;
            background: #ffffff;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #1e293b;
            font-size: 28px;
            margin: 0 0 10px 0;
            font-weight: 700;
          }
          .header .subtitle {
            color: #64748b;
            font-size: 16px;
            margin: 0;
          }
          .date {
            text-align: right;
            color: #64748b;
            font-size: 14px;
            margin-bottom: 30px;
          }
          .section {
            margin-bottom: 35px;
            page-break-inside: avoid;
          }
          .section h2 {
            color: #1e293b;
            font-size: 20px;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e2e8f0;
            font-weight: 600;
          }
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }
          .metric-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
          }
          .metric-card h3 {
            color: #475569;
            font-size: 14px;
            margin: 0 0 8px 0;
            font-weight: 500;
          }
          .metric-card .value {
            color: #1e293b;
            font-size: 24px;
            font-weight: 700;
            margin: 0;
          }
          .metric-card .secondary {
            color: #64748b;
            font-size: 12px;
            margin: 4px 0 0 0;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .table th, .table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
          }
          .table th {
            background: #f1f5f9;
            color: #475569;
            font-weight: 600;
            font-size: 14px;
          }
          .table td {
            color: #1e293b;
          }
          .strategies-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
          }
          .strategy-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
          }
          .strategy-card h3 {
            color: #1e293b;
            font-size: 18px;
            margin: 0 0 8px 0;
            font-weight: 600;
          }
          .strategy-card .price {
            color: #3b82f6;
            font-size: 24px;
            font-weight: 700;
            margin: 0 0 12px 0;
          }
          .strategy-card .description {
            color: #64748b;
            font-size: 14px;
            margin-bottom: 16px;
          }
          .pros-cons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          .pros h4, .cons h4 {
            font-size: 12px;
            margin: 0 0 8px 0;
            font-weight: 600;
          }
          .pros h4 { color: #059669; }
          .cons h4 { color: #dc2626; }
          .pros ul, .cons ul {
            margin: 0;
            padding-left: 16px;
            font-size: 12px;
          }
          .pros li { color: #059669; }
          .cons li { color: #dc2626; }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 12px;
          }
          @media print {
            body { margin: 0; padding: 20px; }
            .section { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Análisis de Precios</h1>
          <p class="subtitle">${productName}</p>
        </div>
        
        <div class="date">Fecha del análisis: ${currentDate}</div>

        <div class="section">
          <h2>📊 Resumen Ejecutivo</h2>
          <div class="metrics-grid">
            <div class="metric-card">
              <h3>Precio Recomendado</h3>
              <p class="value">${formatCurrency(result.recommendedPrice)}</p>
              <p class="secondary">Optimizado para máximo ROI</p>
            </div>
            <div class="metric-card">
              <h3>Ganancia Unitaria</h3>
              <p class="value">${formatCurrency(result.costBreakdown.profitAmount)}</p>
              <p class="secondary">Margen: ${formatPercentage(result.profitMargin)}</p>
            </div>
            <div class="metric-card">
              <h3>ROI Proyectado</h3>
              <p class="value">${formatPercentage(result.financialProjections.roiPercentage)}</p>
              <p class="secondary">Base: 100 unidades/mes</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>💰 Desglose de Costos</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Concepto</th>
                <th>Monto</th>
                <th>Porcentaje</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Materiales</td>
                <td>${formatCurrency(result.costBreakdown.materials)}</td>
                <td>${formatPercentage((result.costBreakdown.materials / result.costBreakdown.totalCost) * 100)}</td>
              </tr>
              <tr>
                <td>Mano de obra</td>
                <td>${formatCurrency(result.costBreakdown.labor)}</td>
                <td>${formatPercentage((result.costBreakdown.labor / result.costBreakdown.totalCost) * 100)}</td>
              </tr>
              <tr>
                <td>Gastos generales</td>
                <td>${formatCurrency(result.costBreakdown.overhead)}</td>
                <td>${formatPercentage((result.costBreakdown.overhead / result.costBreakdown.totalCost) * 100)}</td>
              </tr>
              <tr style="background: #f1f5f9; font-weight: 600;">
                <td><strong>Total Costos</strong></td>
                <td><strong>${formatCurrency(result.costBreakdown.totalCost)}</strong></td>
                <td><strong>100%</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        ${result.competitiveAnalysis.avgPrice ? `
        <div class="section">
          <h2>🏆 Análisis Competitivo</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Métrica</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Precio Mínimo del Mercado</td>
                <td>${formatCurrency(result.competitiveAnalysis.minPrice || 0)}</td>
              </tr>
              <tr>
                <td>Precio Promedio del Mercado</td>
                <td>${formatCurrency(result.competitiveAnalysis.avgPrice || 0)}</td>
              </tr>
              <tr>
                <td>Precio Máximo del Mercado</td>
                <td>${formatCurrency(result.competitiveAnalysis.maxPrice || 0)}</td>
              </tr>
              <tr style="background: #f1f5f9;">
                <td><strong>Posición vs. Competencia</strong></td>
                <td><strong>
                  ${result.recommendedPrice > (result.competitiveAnalysis.avgPrice || 0) 
                    ? `+${formatPercentage(((result.recommendedPrice - (result.competitiveAnalysis.avgPrice || 0)) / (result.competitiveAnalysis.avgPrice || 1)) * 100)} Premium`
                    : `-${formatPercentage((((result.competitiveAnalysis.avgPrice || 0) - result.recommendedPrice) / (result.competitiveAnalysis.avgPrice || 1)) * 100)} Competitivo`
                  }
                </strong></td>
              </tr>
            </tbody>
          </table>
        </div>
        ` : ''}

        <div class="section">
          <h2>🎯 Estrategias de Precios</h2>
          <div class="strategies-grid">
            ${result.pricingStrategies.map(strategy => `
              <div class="strategy-card">
                <h3>${strategy.name}</h3>
                <p class="price">${formatCurrency(strategy.price)}</p>
                <p class="description">${strategy.description}</p>
                <div class="pros-cons">
                  <div class="pros">
                    <h4>✓ Ventajas</h4>
                    <ul>
                      ${strategy.pros.map(pro => `<li>${pro}</li>`).join('')}
                    </ul>
                  </div>
                  <div class="cons">
                    <h4>⚠ Consideraciones</h4>
                    <ul>
                      ${strategy.cons.map(con => `<li>${con}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="section">
          <h2>📈 Proyecciones Financieras</h2>
          <p style="color: #64748b; margin-bottom: 20px;">Estimaciones basadas en la venta de 100 unidades mensuales</p>
          <div class="metrics-grid">
            <div class="metric-card">
              <h3>Ingresos Mensuales</h3>
              <p class="value">${formatCurrency(result.financialProjections.monthlyRevenue100Units)}</p>
              <p class="secondary">${formatCurrency(result.recommendedPrice)} × 100 unidades</p>
            </div>
            <div class="metric-card">
              <h3>Ganancia Mensual</h3>
              <p class="value">${formatCurrency(result.financialProjections.monthlyProfit100Units)}</p>
              <p class="secondary">${formatCurrency(result.costBreakdown.profitAmount)} × 100 unidades</p>
            </div>
            <div class="metric-card">
              <h3>ROI Mensual</h3>
              <p class="value">${formatPercentage(result.financialProjections.roiPercentage)}</p>
              <p class="secondary">Retorno sobre inversión</p>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>Reporte generado por Calculadora de Precios | ${currentDate}</p>
          <p>Este análisis es una estimación basada en los datos proporcionados</p>
        </div>
      </body>
      </html>
    `;

    // Crear y descargar el PDF
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Crear un enlace temporal para descargar
    const link = document.createElement('a');
    link.href = url;
    link.download = `analisis-precios-${productName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.html`;
    
    // Simular clic para descargar
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Limpiar URL
    URL.revokeObjectURL(url);
    
    // Mostrar mensaje de éxito
    alert('¡Reporte descargado! Abre el archivo HTML en tu navegador y usa Ctrl+P para guardarlo como PDF.');
    
  } catch (error) {
    console.error('Error al generar PDF:', error);
    alert('Error al generar el reporte. Por favor, inténtalo nuevamente.');
  }
};

export const exportToCSV = (result: PricingResult, productName: string) => {
  const csvData = [
    ['Producto', productName],
    ['Precio Recomendado', result.recommendedPrice],
    ['Costo Materiales', result.costBreakdown.materials],
    ['Costo Mano de Obra', result.costBreakdown.labor],
    ['Gastos Generales', result.costBreakdown.overhead],
    ['Costo Total', result.costBreakdown.totalCost],
    ['Ganancia Unitaria', result.costBreakdown.profitAmount],
    ['Margen de Ganancia (%)', result.profitMargin],
    ['Ingresos Mensuales (100 unidades)', result.financialProjections.monthlyRevenue100Units],
    ['Ganancia Mensual (100 unidades)', result.financialProjections.monthlyProfit100Units],
    ['ROI Mensual (%)', result.financialProjections.roiPercentage],
  ];
  
  const csvContent = csvData.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${productName.replace(/\s+/g, '_')}_pricing_analysis.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportBreakevenToPDF = async (result: BreakevenResult, formData: BreakevenFormData) => {
  try {
    const currentDate = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Análisis de Punto de Equilibrio</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1e293b;
            margin: 0;
            padding: 40px;
            background: #ffffff;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #1e293b;
            font-size: 28px;
            margin: 0 0 10px 0;
            font-weight: 700;
          }
          .header .subtitle {
            color: #64748b;
            font-size: 16px;
            margin: 0;
          }
          .date {
            text-align: right;
            color: #64748b;
            font-size: 14px;
            margin-bottom: 30px;
          }
          .section {
            margin-bottom: 30px;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
          }
          .section h2 {
            color: #1e293b;
            font-size: 20px;
            margin: 0 0 15px 0;
            font-weight: 600;
          }
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
          }
          .metric {
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
          }
          .metric-label {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 5px;
          }
          .metric-value {
            font-size: 18px;
            font-weight: 700;
            color: #1e293b;
          }
          .input-data {
            background: #f1f5f9;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .input-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #cbd5e1;
          }
          .input-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }
          .input-label {
            font-weight: 500;
            color: #475569;
          }
          .input-value {
            font-weight: 600;
            color: #1e293b;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 Análisis de Punto de Equilibrio</h1>
          <p class="subtitle">Reporte detallado de cálculo BEP</p>
        </div>
        
        <div class="date">
          Generado el: ${currentDate}
        </div>

        <div class="section">
          <h2>📝 Datos de Entrada</h2>
          <div class="input-data">
            <div class="input-item">
              <span class="input-label">Costos Fijos Totales:</span>
              <span class="input-value">${formatCurrency(formData.fixedCosts)}</span>
            </div>
            <div class="input-item">
              <span class="input-label">Precio de Venta (por unidad):</span>
              <span class="input-value">${formatCurrency(formData.unitPrice)}</span>
            </div>
            <div class="input-item">
              <span class="input-label">Costo Variable Unitario:</span>
              <span class="input-value">${formatCurrency(formData.variableCost)}</span>
            </div>
            ${formData.currentSales > 0 ? `
            <div class="input-item">
              <span class="input-label">Ventas Actuales:</span>
              <span class="input-value">${formData.currentSales.toLocaleString()} unidades</span>
            </div>
            ` : ''}
          </div>
        </div>

        <div class="section">
          <h2>📈 Resultados Principales</h2>
          <div class="metrics-grid">
            <div class="metric">
              <div class="metric-label">Unidades de Punto de Equilibrio</div>
              <div class="metric-value">${Math.ceil(result.breakevenUnits).toLocaleString()} unidades</div>
            </div>
            <div class="metric">
              <div class="metric-label">Ingresos de Punto de Equilibrio</div>
              <div class="metric-value">${formatCurrency(result.breakevenRevenue)}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Margen de Contribución</div>
              <div class="metric-value">${formatCurrency(result.contributionMarginPerUnit)} por unidad</div>
            </div>
            <div class="metric">
              <div class="metric-label">% Margen de Contribución</div>
              <div class="metric-value">${formatPercentage(result.contributionMarginPercentage)}</div>
            </div>
            ${result.safetyMarginPercentage !== null ? `
            <div class="metric">
              <div class="metric-label">Margen de Seguridad</div>
              <div class="metric-value">${formatPercentage(result.safetyMarginPercentage)}</div>
            </div>
            ` : ''}
          </div>
        </div>

        <div class="section">
          <h2>💡 Interpretación de Resultados</h2>
          <p><strong>Punto de Equilibrio:</strong> Necesitas vender ${Math.ceil(result.breakevenUnits).toLocaleString()} unidades para cubrir todos tus costos.</p>
          <p><strong>Margen de Contribución:</strong> Cada unidad vendida contribuye con ${formatCurrency(result.contributionMarginPerUnit)} para cubrir los costos fijos y generar ganancia.</p>
          ${result.safetyMarginPercentage !== null && result.safetyMarginPercentage > 0 ? `
          <p><strong>Margen de Seguridad:</strong> Tus ventas actuales están ${formatPercentage(result.safetyMarginPercentage)} por encima del punto de equilibrio, lo que indica una buena posición financiera.</p>
          ` : result.safetyMarginPercentage !== null && result.safetyMarginPercentage <= 0 ? `
          <p><strong>⚠️ Advertencia:</strong> Tus ventas actuales están por debajo del punto de equilibrio. Necesitas aumentar las ventas o reducir costos.</p>
          ` : ''}
        </div>

        <div class="footer">
          <p>Reporte generado por Calculadoras Financieras | ${currentDate}</p>
        </div>
      </body>
      </html>
    `;

    // Crear y descargar el archivo
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analisis-punto-equilibrio-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error al exportar PDF:', error);
    alert('Error al generar el reporte. Por favor, intenta nuevamente.');
  }
};

export const exportCashflowToHTML = async (result: CashflowResult) => {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Flujo de Caja Mensual</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color:#0f172a; padding:40px; }
      h1 { margin:0 0 8px 0; }
      .grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap:16px; }
      .card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px; }
      .label { color:#475569; font-size:12px; margin-bottom:4px; }
      .value { font-weight:700; font-size:20px; }
      table { width:100%; border-collapse:collapse; margin-top:16px; }
      th, td { padding:10px; border-bottom:1px solid #e2e8f0; text-align:left; }
      th { background:#f1f5f9; font-weight:600; }
    </style>
  </head>
  <body>
    <h1>📊 Flujo de Caja Mensual</h1>
    <p style="color:#64748b">Generado el ${currentDate}</p>
    <div class="grid">
      <div class="card"><div class="label">Total Ingresos</div><div class="value">${result.totals.total_inflows.toLocaleString()}</div></div>
      <div class="card"><div class="label">Total Egresos</div><div class="value">${result.totals.total_outflows.toLocaleString()}</div></div>
      <div class="card"><div class="label">Flujo Neto</div><div class="value">${result.totals.net_cash_flow.toLocaleString()}</div></div>
      <div class="card"><div class="label">Caja Final</div><div class="value">${result.totals.ending_cash.toLocaleString()}</div></div>
      <div class="card"><div class="label">Burn Rate</div><div class="value">${result.totals.burn_rate.toLocaleString()}</div></div>
      <div class="card"><div class="label">Runway (meses)</div><div class="value">${result.totals.runway_months ?? '—'}</div></div>
    </div>
    <h2>Detalle de Ingresos</h2>
    <table>
      <thead><tr><th>Concepto</th><th>Monto</th></tr></thead>
      <tbody>
        ${result.breakdown.inflows.map(i => `<tr><td>${i.name}</td><td>${i.amount.toLocaleString()}</td></tr>`).join('')}
      </tbody>
    </table>
    <h2>Detalle de Egresos</h2>
    <table>
      <thead><tr><th>Concepto</th><th>Monto</th></tr></thead>
      <tbody>
        ${result.breakdown.outflows.map(i => `<tr><td>${i.name}</td><td>${i.amount.toLocaleString()}</td></tr>`).join('')}
      </tbody>
    </table>
    <h2>Análisis</h2>
    <p><b>Nivel de riesgo:</b> ${result.analysis.risk_level}</p>
    <p>${result.analysis.summary}</p>
    <ul>
      ${result.analysis.recommendations.map(r => `<li>${r}</li>`).join('')}
    </ul>
  </body>
  </html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cashflow-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportCashflowToCSV = (result: CashflowResult) => {
  const rows: string[][] = [];
  rows.push(['Métrica','Valor']);
  rows.push(['Total Ingresos', String(result.totals.total_inflows)]);
  rows.push(['Total Egresos', String(result.totals.total_outflows)]);
  rows.push(['Flujo Operativo', String(result.totals.operating_cash_flow)]);
  rows.push(['FCF', String(result.totals.free_cash_flow)]);
  rows.push(['Flujo Neto', String(result.totals.net_cash_flow)]);
  rows.push(['Caja Final', String(result.totals.ending_cash)]);
  rows.push(['Burn Rate', String(result.totals.burn_rate)]);
  rows.push(['Runway', String(result.totals.runway_months ?? '')]);
  rows.push([]);
  rows.push(['Ingresos']);
  rows.push(['Concepto','Monto']);
  for (const i of result.breakdown.inflows) rows.push([i.name, String(i.amount)]);
  rows.push([]);
  rows.push(['Egresos']);
  rows.push(['Concepto','Monto']);
  for (const i of result.breakdown.outflows) rows.push([i.name, String(i.amount)]);

  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cashflow-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportROIToHTML = async (result: ROIResult) => {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Análisis de ROI - Retorno de Inversión</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color:#0f172a; padding:40px; line-height:1.6; }
      h1 { margin:0 0 8px 0; color:#1e293b; }
      h2 { color:#475569; border-bottom:2px solid #e2e8f0; padding-bottom:8px; margin-top:32px; }
      .grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap:16px; margin:24px 0; }
      .card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px; text-align:center; }
      .card.excellent { border-left:4px solid #10b981; background:#ecfdf5; }
      .card.good { border-left:4px solid #3b82f6; background:#eff6ff; }
      .card.fair { border-left:4px solid #f59e0b; background:#fffbeb; }
      .card.poor { border-left:4px solid #ef4444; background:#fef2f2; }
      .label { color:#475569; font-size:12px; margin-bottom:4px; text-transform:uppercase; letter-spacing:0.5px; }
      .value { font-weight:700; font-size:20px; margin:0; }
      .large { font-size:24px; }
      .positive { color:#059669; }
      .negative { color:#dc2626; }
      table { width:100%; border-collapse:collapse; margin-top:16px; }
      th, td { padding:10px; border-bottom:1px solid #e2e8f0; text-align:left; }
      th { background:#f1f5f9; font-weight:600; color:#475569; }
      .scenario { padding:12px; margin:8px 0; border-radius:8px; border:1px solid #e2e8f0; }
      .scenario.pessimistic { background:#fef2f2; border-color:#fecaca; }
      .scenario.realistic { background:#eff6ff; border-color:#bfdbfe; }
      .scenario.optimistic { background:#ecfdf5; border-color:#bbf7d0; }
      .insight { display:flex; align-items:start; gap:8px; margin:8px 0; padding:8px; background:#f8fafc; border-radius:6px; }
      .insight-icon { margin-top:2px; }
      .footer { margin-top:40px; padding-top:20px; border-top:1px solid #e2e8f0; text-align:center; color:#64748b; font-size:12px; }
    </style>
  </head>
  <body>
    <h1>📈 Análisis de ROI - Retorno de Inversión</h1>
    <p style="color:#64748b">Generado el ${currentDate}</p>
    
    <h2>📊 Métricas Principales</h2>
    <div class="grid">
      <div class="card ${result.analysis.investment_grade}">
        <div class="label">ROI Simple</div>
        <div class="value large ${result.metrics.simple_roi >= 0 ? 'positive' : 'negative'}">${result.metrics.simple_roi.toFixed(2)}%</div>
      </div>
      <div class="card">
        <div class="label">ROI Anualizado</div>
        <div class="value">${result.metrics.annualized_roi.toFixed(2)}%</div>
      </div>
      <div class="card">
        <div class="label">Período de Recuperación</div>
        <div class="value">${result.metrics.payback_period_months ? `${result.metrics.payback_period_months.toFixed(1)} meses` : 'No se recupera'}</div>
      </div>
      <div class="card">
        <div class="label">Valor Presente Neto</div>
        <div class="value ${result.metrics.npv >= 0 ? 'positive' : 'negative'}">$${result.metrics.npv.toLocaleString()}</div>
      </div>
      <div class="card">
        <div class="label">Inversión Total</div>
        <div class="value">$${result.metrics.total_investment.toLocaleString()}</div>
      </div>
      <div class="card">
        <div class="label">Retornos Totales</div>
        <div class="value">$${result.metrics.total_returns.toLocaleString()}</div>
      </div>
      <div class="card">
        <div class="label">Ganancia Neta</div>
        <div class="value ${result.metrics.profit >= 0 ? 'positive' : 'negative'}">$${result.metrics.profit.toLocaleString()}</div>
      </div>
      ${result.metrics.irr ? `
      <div class="card">
        <div class="label">TIR</div>
        <div class="value">${(result.metrics.irr * 100).toFixed(2)}%</div>
      </div>` : ''}
    </div>

    <h2>🎯 Análisis de Inversión</h2>
    <div class="card ${result.analysis.investment_grade}" style="text-align:left;">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
        <span style="font-size:24px;">
          ${result.analysis.investment_grade === 'excellent' ? '🌟' :
            result.analysis.investment_grade === 'good' ? '✅' :
            result.analysis.investment_grade === 'fair' ? '⚠️' :
            result.analysis.investment_grade === 'poor' ? '📉' : '🚨'}
        </span>
        <span style="font-weight:600; text-transform:capitalize;">${result.analysis.investment_grade === 'excellent' ? 'Excelente' :
          result.analysis.investment_grade === 'good' ? 'Buena' :
          result.analysis.investment_grade === 'fair' ? 'Regular' :
          result.analysis.investment_grade === 'poor' ? 'Pobre' : 'Evitar'}</span>
        <span style="padding:2px 8px; border-radius:12px; font-size:11px; background:rgba(0,0,0,0.1);">
          Riesgo ${result.analysis.risk_level === 'low' ? 'Bajo' : result.analysis.risk_level === 'medium' ? 'Medio' : 'Alto'}
        </span>
      </div>
      <p style="margin:12px 0; color:#374151;">${result.analysis.recommendation}</p>
    </div>

    <h3>💡 Insights Clave</h3>
    ${result.analysis.key_insights.map(insight => `
      <div class="insight">
        <span class="insight-icon">💡</span>
        <span>${insight}</span>
      </div>
    `).join('')}

    <h2>📊 Análisis de Escenarios</h2>
    ${Object.entries(result.scenarios).map(([key, scenario]) => `
      <div class="scenario ${key}">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:600; text-transform:capitalize;">${scenario.scenario_name}</span>
          <span style="font-weight:700; font-size:18px; color:${scenario.roi_percentage >= 0 ? '#059669' : '#dc2626'};">
            ${scenario.roi_percentage.toFixed(2)}%
          </span>
        </div>
        <div style="margin-top:8px; font-size:14px; color:#6b7280;">
          NPV: $${scenario.npv.toLocaleString()} | 
          Retorno Total: $${scenario.total_return.toLocaleString()} |
          Payback: ${scenario.payback_months ? `${scenario.payback_months.toFixed(1)} meses` : 'N/A'}
        </div>
      </div>
    `).join('')}

    <h2>📈 Proyección Temporal</h2>
    <table>
      <thead>
        <tr>
          <th>Mes</th>
          <th>Flujo Acumulado</th>
          <th>Retorno Mensual</th>
          <th>NPV</th>
          <th>Payback Logrado</th>
        </tr>
      </thead>
      <tbody>
        ${result.timeline.map(month => `
          <tr>
            <td>Mes ${month.month}</td>
            <td style="color:${month.cumulative_cash_flow >= 0 ? '#059669' : '#dc2626'};">
              $${month.cumulative_cash_flow.toLocaleString()}
            </td>
            <td>$${month.monthly_return.toLocaleString()}</td>
            <td>$${month.net_present_value.toLocaleString()}</td>
            <td>${month.payback_achieved ? '✅ Sí' : '❌ No'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="footer">
      <p>Reporte generado por Calculadora de ROI | ${currentDate}</p>
      <p>Este análisis es una estimación basada en los datos proporcionados</p>
    </div>
  </body>
  </html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `roi-analysis-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportROIToCSV = (result: ROIResult) => {
  const rows: string[][] = [];
  
  // Métricas principales
  rows.push(['Métrica','Valor']);
  rows.push(['ROI Simple (%)', String(result.metrics.simple_roi)]);
  rows.push(['ROI Anualizado (%)', String(result.metrics.annualized_roi)]);
  rows.push(['Período de Recuperación (meses)', String(result.metrics.payback_period_months ?? 'N/A')]);
  rows.push(['Valor Presente Neto', String(result.metrics.npv)]);
  rows.push(['TIR (%)', String(result.metrics.irr ? (result.metrics.irr * 100) : 'N/A')]);
  rows.push(['Inversión Total', String(result.metrics.total_investment)]);
  rows.push(['Retornos Totales', String(result.metrics.total_returns)]);
  rows.push(['Ganancia Neta', String(result.metrics.profit)]);
  rows.push([]);
  
  // Análisis
  rows.push(['Análisis']);
  rows.push(['Grado de Inversión', result.analysis.investment_grade]);
  rows.push(['Nivel de Riesgo', result.analysis.risk_level]);
  rows.push(['Recomendación', result.analysis.recommendation]);
  rows.push([]);
  
  // Escenarios
  rows.push(['Escenarios']);
  rows.push(['Escenario','ROI (%)','NPV','Retorno Total','Payback (meses)']);
  Object.entries(result.scenarios).forEach(([, scenario]) => {
    rows.push([
      scenario.scenario_name,
      String(scenario.roi_percentage),
      String(scenario.npv),
      String(scenario.total_return),
      String(scenario.payback_months ?? 'N/A')
    ]);
  });
  rows.push([]);
  
  // Timeline
  rows.push(['Proyección Temporal']);
  rows.push(['Mes','Flujo Acumulado','Retorno Mensual','NPV','Payback Logrado']);
  result.timeline.forEach(month => {
    rows.push([
      String(month.month),
      String(month.cumulative_cash_flow),
      String(month.monthly_return),
      String(month.net_present_value),
      month.payback_achieved ? 'Sí' : 'No'
    ]);
  });

  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `roi-analysis-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
