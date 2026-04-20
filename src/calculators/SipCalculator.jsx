import { useMemo, useState } from 'react'
import { Field, Stat } from '../components/FormControls'
import { formatCurrencyINR, toNumber } from '../utils/helpers'

export default function SipCalculator() {
  const [monthlySip, setMonthlySip] = useState(10000)
  const [annualReturn, setAnnualReturn] = useState(12)
  const [years, setYears] = useState(15)

  const data = useMemo(() => {
    const sip = Math.max(toNumber(monthlySip), 0)
    const months = Math.max(Math.round(toNumber(years) * 12), 0)
    const rate = Math.max(toNumber(annualReturn), 0) / 1200
    const finalValue = rate === 0 ? sip * months : sip * (((1 + rate) ** months - 1) / rate) * (1 + rate)
    const invested = sip * months
    return { invested, returns: finalValue - invested, finalValue }
  }, [monthlySip, annualReturn, years])

  return (
    <section className="tool">
      <h2>SIP Calculator</h2>
      <p className="tool-desc">Monthly investment projection for long-term wealth creation.</p>
      <div className="grid-2">
        <Field label="Monthly SIP (INR)">
          <input type="number" min="0" value={monthlySip} onChange={(e) => setMonthlySip(e.target.value)} />
        </Field>
        <Field label="Expected Return (% p.a.)">
          <input type="number" min="0" step="0.1" value={annualReturn} onChange={(e) => setAnnualReturn(e.target.value)} />
        </Field>
        <Field label="Duration (Years)">
          <input type="number" min="0" step="0.1" value={years} onChange={(e) => setYears(e.target.value)} />
        </Field>
      </div>
      <div className="stat-grid">
        <Stat label="Invested Amount" value={formatCurrencyINR(data.invested)} />
        <Stat label="Estimated Returns" value={formatCurrencyINR(data.returns)} />
        <Stat label="Maturity Amount" value={formatCurrencyINR(data.finalValue)} />
      </div>
    </section>
  )
}
