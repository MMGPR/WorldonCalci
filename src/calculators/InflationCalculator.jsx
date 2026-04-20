import { useMemo, useState } from 'react'
import { Field, Stat } from '../components/FormControls'
import { formatCurrencyINR, toNumber } from '../utils/helpers'

export default function InflationCalculator() {
  const [currentCost, setCurrentCost] = useState(50000)
  const [inflation, setInflation] = useState(6)
  const [years, setYears] = useState(10)

  const futureCost = useMemo(() => {
    const c = Math.max(toNumber(currentCost), 0)
    const i = Math.max(toNumber(inflation), 0) / 100
    const y = Math.max(toNumber(years), 0)
    return c * (1 + i) ** y
  }, [currentCost, inflation, years])

  return (
    <section className="tool">
      <h2>Inflation Impact Calculator</h2>
      <p className="tool-desc">Estimate how much today&apos;s cost could become in future.</p>
      <div className="grid-2">
        <Field label="Current Cost (INR)">
          <input type="number" min="0" value={currentCost} onChange={(e) => setCurrentCost(e.target.value)} />
        </Field>
        <Field label="Inflation Rate (% p.a.)">
          <input type="number" min="0" step="0.1" value={inflation} onChange={(e) => setInflation(e.target.value)} />
        </Field>
        <Field label="Years">
          <input type="number" min="0" step="0.1" value={years} onChange={(e) => setYears(e.target.value)} />
        </Field>
      </div>
      <div className="stat-grid">
        <Stat label="Future Cost" value={formatCurrencyINR(futureCost)} />
      </div>
    </section>
  )
}
