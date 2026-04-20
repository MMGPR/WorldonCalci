import { useMemo, useState } from 'react'
import { Field, Stat } from '../components/FormControls'
import { formatCurrencyINR, toNumber } from '../utils/helpers'

export default function BillSplitCalculator() {
  const [billAmount, setBillAmount] = useState(2500)
  const [tipPercent, setTipPercent] = useState(10)
  const [people, setPeople] = useState(4)

  const data = useMemo(() => {
    const bill = Math.max(toNumber(billAmount), 0)
    const tip = (bill * Math.max(toNumber(tipPercent), 0)) / 100
    const total = bill + tip
    const count = Math.max(toNumber(people), 1)
    return { tip, total, perPerson: total / count }
  }, [billAmount, tipPercent, people])

  return (
    <section className="tool">
      <h2>Bill Split & Tip Calculator</h2>
      <p className="tool-desc">Split shared bills fairly with tip included.</p>
      <div className="grid-2">
        <Field label="Bill Amount (INR)">
          <input type="number" min="0" value={billAmount} onChange={(e) => setBillAmount(e.target.value)} />
        </Field>
        <Field label="Tip (%)">
          <input type="number" min="0" step="0.1" value={tipPercent} onChange={(e) => setTipPercent(e.target.value)} />
        </Field>
        <Field label="People">
          <input type="number" min="1" step="1" value={people} onChange={(e) => setPeople(e.target.value)} />
        </Field>
      </div>
      <div className="stat-grid">
        <Stat label="Tip Amount" value={formatCurrencyINR(data.tip)} />
        <Stat label="Total Bill" value={formatCurrencyINR(data.total)} />
        <Stat label="Per Person" value={formatCurrencyINR(data.perPerson)} />
      </div>
    </section>
  )
}
