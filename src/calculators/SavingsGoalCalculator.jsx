import { useMemo, useState } from 'react'
import { Field, Stat } from '../components/FormControls'
import { formatCurrencyINR, toNumber, breakdownMonths } from '../utils/helpers'

export default function SavingsGoalCalculator() {
  const [targetAmount, setTargetAmount] = useState(2000000)
  const [currentSavings, setCurrentSavings] = useState(200000)
  const [annualReturn, setAnnualReturn] = useState(9)
  const [monthlyContribution, setMonthlyContribution] = useState(25000)

  const data = useMemo(() => {
    const target = Math.max(toNumber(targetAmount), 0)
    let corpus = Math.max(toNumber(currentSavings), 0)
    const monthlyRate = Math.max(toNumber(annualReturn), 0) / 1200
    const contribution = Math.max(toNumber(monthlyContribution), 0)
    let months = 0

    while (corpus < target && months < 1200) {
      corpus = corpus * (1 + monthlyRate) + contribution
      months += 1
    }

    const reached = corpus >= target
    const bd = breakdownMonths(months)
    return { reached, months, years: bd.years, remMonths: bd.months, corpus }
  }, [targetAmount, currentSavings, annualReturn, monthlyContribution])

  return (
    <section className="tool">
      <h2>Savings Goal Calculator</h2>
      <p className="tool-desc">Estimate how long it takes to reach your target corpus.</p>
      <div className="grid-2">
        <Field label="Target Amount (INR)">
          <input type="number" min="0" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} />
        </Field>
        <Field label="Current Savings (INR)">
          <input type="number" min="0" value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} />
        </Field>
        <Field label="Expected Return (% p.a.)">
          <input type="number" min="0" step="0.1" value={annualReturn} onChange={(e) => setAnnualReturn(e.target.value)} />
        </Field>
        <Field label="Monthly Contribution (INR)">
          <input type="number" min="0" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} />
        </Field>
      </div>
      <div className="stat-grid">
        <Stat label="Goal Reached" value={data.reached ? 'Yes' : 'Not in 100 years'} />
        <Stat label="Time Needed" value={`${data.years}y ${data.remMonths}m (${data.months} months)`} />
        <Stat label="Projected Corpus" value={formatCurrencyINR(data.corpus)} />
      </div>
    </section>
  )
}
