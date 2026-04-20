import { useMemo, useState } from 'react'
import { Field, Stat } from '../components/FormControls'
import { formatCurrencyINR, toNumber } from '../utils/helpers'

export default function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState(100000)
  const [rate, setRate] = useState(8)
  const [timeYears, setTimeYears] = useState(3)

  const data = useMemo(() => {
    const p = Math.max(toNumber(principal), 0)
    const r = Math.max(toNumber(rate), 0)
    const t = Math.max(toNumber(timeYears), 0)
    const interest = (p * r * t) / 100
    return { interest, maturity: p + interest }
  }, [principal, rate, timeYears])

  return (
    <section className="tool">
      <h2>Simple Interest Calculator</h2>
      <p className="tool-desc">Quick simple interest and maturity amount.</p>
      <div className="grid-2">
        <Field label="Principal (INR)">
          <input type="number" min="0" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
        </Field>
        <Field label="Annual Rate (%)">
          <input type="number" min="0" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Time (Years)">
          <input type="number" min="0" step="0.1" value={timeYears} onChange={(e) => setTimeYears(e.target.value)} />
        </Field>
      </div>
      <div className="stat-grid">
        <Stat label="Interest Earned" value={formatCurrencyINR(data.interest)} />
        <Stat label="Maturity Amount" value={formatCurrencyINR(data.maturity)} />
      </div>
    </section>
  )
}
