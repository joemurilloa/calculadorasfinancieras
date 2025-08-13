// Utilidades de cálculo para comparador de préstamos
// Mantiene estilo similar a otras librerías de /lib/calculations

export interface LoanInput {
  id: string;                // identificador interno
  name: string;              // etiqueta para mostrar
  amount: number;            // monto del préstamo
  annualRate: number;        // tasa nominal anual (0..1)
  termMonths: number;        // plazo en meses
  originationFeePct: number; // % sobre el monto (0..1)
  originationFeeFlat: number;// monto fijo adicional
  extraMonthlyPayment: number; // abono extra opcional
}

export interface UserContextInput {
  monthlyIncome: number;       // ingreso mensual bruto
  otherMonthlyDebt: number;    // otros pagos de deuda
}

export interface LoanMetrics {
  id: string;
  name: string;
  monthlyPayment: number;          // pago estándar
  monthlyPaymentWithExtra: number;  // pago con extra aplicado
  totalInterest: number;           // interés total (sin extra)
  totalInterestWithExtra: number;  // interés total con extra
  totalCost: number;               // principal + interés + fees (sin extra)
  totalCostWithExtra: number;      // con extra
  payoffMonths: number;            // meses para liquidar (sin extra)
  payoffMonthsWithExtra: number;   // meses con extra
  originationFeesTotal: number;    // comisión total
  aprApprox: number;               // APR aproximado (%)
  dti: number;                     // ratio deuda/ingreso (pago estándar / ingreso)
}

export interface AmortizationPoint {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

export interface LoanComparisonResult {
  loans: LoanMetrics[];
  bestByTotalCost: string | null;
  bestByLowestPayment: string | null;
  bestByFastestPayoff: string | null;
  analysisSummary: string;
  recommendations: string[];
  selectedSchedule: AmortizationPoint[]; // schedule del préstamo considerado "mejor" por costo
}

// Calcula pago mensual estándar usando fórmula de anualidad
export function calculateMonthlyPayment(amount: number, annualRate: number, termMonths: number): number {
  if (termMonths <= 0 || amount <= 0) return 0;
  const r = annualRate / 12;
  if (r === 0) return amount / termMonths;
  return amount * (r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1);
}

// Genera amortización considerando pago extra (si extra > 0) hasta liquidar
export function generateAmortization(amount: number, annualRate: number, termMonths: number, monthlyPayment: number, extra: number): AmortizationPoint[] {
  const schedule: AmortizationPoint[] = [];
  const r = annualRate / 12;
  let balance = amount;
  let month = 0;
  while (balance > 0 && month < termMonths + 600) { // límite de seguridad
    month += 1;
    const interest = r * balance;
    let payment = monthlyPayment + extra;
    if (payment > balance + interest) payment = balance + interest; // último pago
    const principal = payment - interest;
    balance = +(balance - principal).toFixed(8);
    schedule.push({ month, payment, interest, principal, balance: Math.max(balance, 0) });
    if (balance <= 0.01) { balance = 0; break; }
  }
  return schedule;
}

export function approximateAPR(amount: number, annualRate: number, fees: number, termMonths: number): number {
  // Apróx: (interés total + fees) / monto / años * 100 — rápida, no exacta
  const monthly = calculateMonthlyPayment(amount, annualRate, termMonths);
  const totalPaid = monthly * termMonths;
  const interestTotal = totalPaid - amount;
  const years = termMonths / 12;
  if (amount <= 0 || years <= 0) return 0;
  const apr = ((interestTotal + fees) / amount) / years * 100;
  return apr;
}

export function compareLoans(loans: LoanInput[], user: UserContextInput): LoanComparisonResult {
  const metrics: LoanMetrics[] = loans.map(l => {
    const basePayment = calculateMonthlyPayment(l.amount, l.annualRate, l.termMonths);
    const fees = l.amount * l.originationFeePct + l.originationFeeFlat;
    const scheduleNoExtra = generateAmortization(l.amount, l.annualRate, l.termMonths, basePayment, 0);
    const scheduleExtra = l.extraMonthlyPayment > 0 ? generateAmortization(l.amount, l.annualRate, l.termMonths, basePayment, l.extraMonthlyPayment) : scheduleNoExtra;
    const totalPaidNoExtra = scheduleNoExtra.reduce((s, p) => s + p.payment, 0) + fees;
    const totalPaidExtra = scheduleExtra.reduce((s, p) => s + p.payment, 0) + fees;
    const totalInterestNoExtra = totalPaidNoExtra - l.amount - fees;
    const totalInterestExtra = totalPaidExtra - l.amount - fees;
    const apr = approximateAPR(l.amount, l.annualRate, fees, l.termMonths);
    const dti = user.monthlyIncome > 0 ? (basePayment + user.otherMonthlyDebt) / user.monthlyIncome : 0;
    return {
      id: l.id,
      name: l.name,
      monthlyPayment: basePayment,
      monthlyPaymentWithExtra: basePayment + l.extraMonthlyPayment,
      totalInterest: totalInterestNoExtra,
      totalInterestWithExtra: totalInterestExtra,
      totalCost: totalPaidNoExtra,
      totalCostWithExtra: totalPaidExtra,
      payoffMonths: scheduleNoExtra.length,
      payoffMonthsWithExtra: scheduleExtra.length,
      originationFeesTotal: fees,
      aprApprox: apr,
      dti
    };
  });

  let bestByCost: LoanMetrics | null = null;
  let bestByPayment: LoanMetrics | null = null;
  let bestBySpeed: LoanMetrics | null = null;
  metrics.forEach(m => {
    if (!bestByCost || m.totalCost < bestByCost.totalCost) bestByCost = m;
    if (!bestByPayment || m.monthlyPayment < bestByPayment.monthlyPayment) bestByPayment = m;
    if (!bestBySpeed || m.payoffMonthsWithExtra < bestBySpeed.payoffMonthsWithExtra) bestBySpeed = m;
  });

  // Construir análisis básico con casting seguro para evitar inferencias erróneas
  const recs: string[] = [];
  const cCost = bestByCost as LoanMetrics | null;
  const cPay = bestByPayment as LoanMetrics | null;
  const cSpeed = bestBySpeed as LoanMetrics | null;
  if (cCost && cPay && cCost.id !== cPay.id) {
    recs.push(`El préstamo "${cCost.name}" tiene el menor costo total, mientras que "${cPay.name}" ofrece la cuota mensual más baja. Evalúa tu flujo de caja vs. costo total.`);
  }
  if (cSpeed && cSpeed !== cCost) {
    recs.push(`Si priorizas terminar antes, "${cSpeed.name}" se liquida en ${cSpeed.payoffMonthsWithExtra} meses (con extra).`);
  }
  metrics.forEach((m: LoanMetrics) => {
    if (m.dti > 0.43) {
      recs.push(`Advertencia: El DTI del préstamo "${m.name}" supera 43% (≈ ${(m.dti*100).toFixed(1)}%). Podría considerarse riesgoso.`);
    }
  });
  if (recs.length === 0) recs.push('Todos los préstamos se encuentran dentro de parámetros razonables. Elige según balance entre cuota y costo total.');

  let analysisSummary = 'Sin préstamos válidos';
  if (cCost) {
    const parts: string[] = [];
    parts.push(`Mejor costo total: "${cCost.name}" (${cCost.totalCost.toFixed(2)})`);
    if (cPay && cPay.id !== cCost.id) parts.push(`Cuota más baja: "${cPay.name}" (${cPay.monthlyPayment.toFixed(2)})`);
    if (cSpeed && cSpeed.id !== cCost.id) parts.push(`Liquidación más rápida: "${cSpeed.name}" (${cSpeed.payoffMonthsWithExtra} meses)`);
    analysisSummary = parts.join('. ') + '.';
  }

  const selectedScheduleLoanId = cCost?.id || (metrics[0]?.id ?? '');
  const selectedLoan = loans.find(l => l.id === selectedScheduleLoanId);
  let selectedSchedule: AmortizationPoint[] = [];
  if (selectedLoan) {
    const basePayment = calculateMonthlyPayment(selectedLoan.amount, selectedLoan.annualRate, selectedLoan.termMonths);
    selectedSchedule = generateAmortization(selectedLoan.amount, selectedLoan.annualRate, selectedLoan.termMonths, basePayment, selectedLoan.extraMonthlyPayment);
  }

  return {
    loans: metrics,
  bestByTotalCost: cCost?.id || null,
  bestByLowestPayment: cPay?.id || null,
  bestByFastestPayoff: cSpeed?.id || null,
    analysisSummary,
    recommendations: recs,
    selectedSchedule
  };
}
