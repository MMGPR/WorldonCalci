import { useMemo, useState } from 'react'
import { Field, Stat } from '../components/FormControls'
import { formatCurrencyINR, toNumber, calculateEmi } from '../utils/helpers'

export default function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState(2500000)
  const [annualRate, setAnnualRate] = useState(8.5)
  const [tenureYears, setTenureYears] = useState(20)
  const [downPayment, setDownPayment] = useState(0)
  const [processingFeePercent, setProcessingFeePercent] = useState(0.5)

  const values = useMemo(() => {
    const principal = Math.max(toNumber(loanAmount) - toNumber(downPayment), 0)
    const months = Math.max(Math.round(toNumber(tenureYears) * 12), 0)
    const emi = calculateEmi(principal, toNumber(annualRate), months)
    const totalPayment = emi * months
    const totalInterest = totalPayment - principal
    const processingFee = (principal * Math.max(toNumber(processingFeePercent), 0)) / 100
    const grandTotal = totalPayment + processingFee
    return { principal, months, emi, totalPayment, totalInterest, processingFee, grandTotal }
  }, [loanAmount, annualRate, tenureYears, downPayment, processingFeePercent])

  return (
    <section className="tool">
      <h2>EMI Calculator</h2>
      <p className="tool-desc">Monthly loan installment and repayment insights.</p>
      <div className="grid-2">
        <Field label="Loan Amount (INR)">
          <input type="number" min="0" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} />
        </Field>
        <Field label="Down Payment (INR)">
          <input type="number" min="0" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} />
        </Field>
        <Field label="Interest Rate (% p.a.)">
          <input type="number" min="0" step="0.1" value={annualRate} onChange={(e) => setAnnualRate(e.target.value)} />
        </Field>
        <Field label="Tenure (Years)">
          <input type="number" min="1" step="1" value={tenureYears} onChange={(e) => setTenureYears(e.target.value)} />
        </Field>
        <Field label="Processing Fee (%)">
          <input type="number" min="0" step="0.1" value={processingFeePercent} onChange={(e) => setProcessingFeePercent(e.target.value)} />
        </Field>
      </div>
      <div className="stat-grid">
        <Stat label="Net Principal" value={formatCurrencyINR(values.principal)} />
        <Stat label="Monthly EMI" value={formatCurrencyINR(values.emi)} />
        <Stat label="Total Interest" value={formatCurrencyINR(values.totalInterest)} />
        <Stat label="Total Payment" value={formatCurrencyINR(values.totalPayment)} />
        <Stat label="Processing Fee" value={formatCurrencyINR(values.processingFee)} />
        <Stat label="Overall Cost" value={formatCurrencyINR(values.grandTotal)} />
      </div>
    </section>
  )
}
