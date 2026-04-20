import { useMemo, useState } from 'react'
import { Field, Stat } from '../components/FormControls'
import { formatCurrencyINR, toNumber } from '../utils/helpers'

export default function EmergencyFundCalculator() {
  const [monthlyExpenses, setMonthlyExpenses] = useState(50000)
  const [monthsCoverage, setMonthsCoverage] = useState(6)
  const [currentSavings, setCurrentSavings] = useState(100000)
  const [monthlySaving, setMonthlySaving] = useState(15000)
  const [annualReturn, setAnnualReturn] = useState(6)

  const data = useMemo(() => {
    const required = Math.max(toNumber(monthlyExpenses), 0) * Math.max(toNumber(monthsCoverage), 0)
    let corpus = Math.max(toNumber(currentSavings), 0)
    const monthlyAdd = Math.max(toNumber(monthlySaving), 0)
    const monthlyRate = Math.max(toNumber(annualReturn), 0) / 1200
    let months = 0

    while (corpus < required && months < 1200) {
      corpus = corpus * (1 + monthlyRate) + monthlyAdd
      months += 1
    }

    return {
      required,
      shortfall: Math.max(required - Math.max(toNumber(currentSavings), 0), 0),
      months,
      reached: corpus >= required,
      corpus,
    }
  }, [monthlyExpenses, monthsCoverage, currentSavings, monthlySaving, annualReturn])

  return (
    <section className="tool">
      <h2>Emergency Fund Calculator</h2>
      <p className="tool-desc">Plan your safety net and time needed to build it.</p>
      <div className="grid-2">
        <Field label="Monthly Expenses (INR)">
          <input type="number" min="0" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(e.target.value)} />
        </Field>
        <Field label="Coverage Needed (Months)">
          <input type="number" min="0" step="1" value={monthsCoverage} onChange={(e) => setMonthsCoverage(e.target.value)} />
        </Field>
        <Field label="Current Emergency Savings (INR)">
          <input type="number" min="0" value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} />
        </Field>
        <Field label="Monthly Addition (INR)">
          <input type="number" min="0" value={monthlySaving} onChange={(e) => setMonthlySaving(e.target.value)} />
        </Field>
        <Field label="Expected Return (% p.a.)">
          <input type="number" min="0" step="0.1" value={annualReturn} onChange={(e) => setAnnualReturn(e.target.value)} />
        </Field>
      </div>
      <div className="stat-grid">
        <Stat label="Required Fund" value={formatCurrencyINR(data.required)} />
        <Stat label="Current Shortfall" value={formatCurrencyINR(data.shortfall)} />
        <Stat label="Months to Reach" value={data.reached ? data.months : 'Not reached'} />
        <Stat label="Projected Corpus" value={formatCurrencyINR(data.corpus)} />
      </div>
    </section>
  )
}
