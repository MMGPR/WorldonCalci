import { useMemo, useState } from 'react'
import { Field, Stat } from '../components/FormControls'
import { formatCurrencyINR, toNumber } from '../utils/helpers'

export default function LoanPrepaymentCalculator() {
  const [principal, setPrincipal] = useState(1500000)
  const [annualRate, setAnnualRate] = useState(9)
  const [emi, setEmi] = useState(22000)
  const [extraPayment, setExtraPayment] = useState(3000)

  const simulate = (extra = 0, deps) => {
    let outstanding = Math.max(toNumber(deps.principal), 0)
    const monthlyRate = Math.max(toNumber(deps.annualRate), 0) / 1200
    const baseEmi = Math.max(toNumber(deps.emi), 0)
    const extraPay = Math.max(toNumber(extra), 0)
    let months = 0
    let totalInterest = 0

    while (outstanding > 0 && months < 600) {
      const interest = outstanding * monthlyRate
      const payment = baseEmi + extraPay
      if (payment <= interest) return { valid: false, months: 0, totalInterest: 0 }
      const principalPart = Math.min(payment - interest, outstanding)
      outstanding -= principalPart
      totalInterest += interest
      months += 1
    }
    return { valid: true, months, totalInterest }
  }

  const base = useMemo(() => simulate(0, { principal, annualRate, emi }), [principal, annualRate, emi])
  const withExtra = useMemo(() => simulate(extraPayment, { principal, annualRate, emi }), [principal, annualRate, emi, extraPayment])

  return (
    <section className="tool">
      <h2>Loan Prepayment Calculator</h2>
      <p className="tool-desc">Measure how extra monthly payment reduces interest and tenure.</p>
      <div className="grid-2">
        <Field label="Outstanding Principal (INR)">
          <input type="number" min="0" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
        </Field>
        <Field label="Interest Rate (% p.a.)">
          <input type="number" min="0" step="0.1" value={annualRate} onChange={(e) => setAnnualRate(e.target.value)} />
        </Field>
        <Field label="Current EMI (INR)">
          <input type="number" min="0" value={emi} onChange={(e) => setEmi(e.target.value)} />
        </Field>
        <Field label="Extra Monthly Payment (INR)">
          <input type="number" min="0" value={extraPayment} onChange={(e) => setExtraPayment(e.target.value)} />
        </Field>
      </div>
      {!base.valid || !withExtra.valid ? (
        <p className="note">EMI is too low to cover monthly interest. Increase EMI amount.</p>
      ) : (
        <div className="stat-grid">
          <Stat label="Months Without Extra" value={base.months} />
          <Stat label="Months With Extra" value={withExtra.months} />
          <Stat label="Months Saved" value={base.months - withExtra.months} />
          <Stat label="Interest Saved" value={formatCurrencyINR(base.totalInterest - withExtra.totalInterest)} />
        </div>
      )}
    </section>
  )
}
