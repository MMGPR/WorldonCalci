import { useMemo, useState } from 'react'
import { Field, Stat } from '../components/FormControls'
import { formatCurrencyINR, toNumber } from '../utils/helpers'

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(100000)
  const [rate, setRate] = useState(10)
  const [years, setYears] = useState(10)
  const [frequency, setFrequency] = useState(4)
  const [monthlyContribution, setMonthlyContribution] = useState(0)

  const data = useMemo(() => {
    const p = Math.max(toNumber(principal), 0)
    const r = Math.max(toNumber(rate), 0) / 100
    const y = Math.max(toNumber(years), 0)
    const n = Math.max(toNumber(frequency), 1)
    const c = Math.max(toNumber(monthlyContribution), 0)

    const principalFV = p * (1 + r / n) ** (n * y)
    const months = Math.round(y * 12)
    const rm = r / 12
    const contributionsFV = rm === 0 ? c * months : c * (((1 + rm) ** months - 1) / rm)
    const totalInvested = p + c * months
    const finalValue = principalFV + contributionsFV
    const gains = finalValue - totalInvested

    return { finalValue, gains, totalInvested }
  }, [principal, rate, years, frequency, monthlyContribution])

  return (
    <section className="tool">
      <h2>Compound Interest Calculator</h2>
      <p className="tool-desc">Corpus growth with compounding and optional monthly investment.</p>
      <div className="grid-2">
        <Field label="Principal (INR)">
          <input type="number" min="0" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
        </Field>
        <Field label="Annual Return (%)">
          <input type="number" min="0" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Duration (Years)">
          <input type="number" min="0" step="0.1" value={years} onChange={(e) => setYears(e.target.value)} />
        </Field>
        <Field label="Compounds Per Year">
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
            <option value={1}>Yearly</option>
            <option value={2}>Half-Yearly</option>
            <option value={4}>Quarterly</option>
            <option value={12}>Monthly</option>
          </select>
        </Field>
        <Field label="Monthly Contribution (INR)">
          <input type="number" min="0" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} />
        </Field>
      </div>
      <div className="stat-grid">
        <Stat label="Total Invested" value={formatCurrencyINR(data.totalInvested)} />
        <Stat label="Estimated Gain" value={formatCurrencyINR(data.gains)} />
        <Stat label="Final Corpus" value={formatCurrencyINR(data.finalValue)} />
      </div>
    </section>
  )
}
