import { PricingResult } from '@/hooks/usePricingCalculator';
import { BreakevenResult, BreakevenFormData } from '@/hooks/useBreakevenCalculator';
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
