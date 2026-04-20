import { useMemo, useState } from 'react'
import { Field, Stat } from '../components/FormControls'
import { formatCurrencyINR, formatNumber, toNumber } from '../utils/helpers'

export default function BudgetPlanner() {
  const [income, setIncome] = useState(90000)
  const [rent, setRent] = useState(20000)
  const [groceries, setGroceries] = useState(10000)
  const [transport, setTransport] = useState(6000)
  const [utilities, setUtilities] = useState(5000)
  const [misc, setMisc] = useState(8000)

  const data = useMemo(() => {
    const monthlyIncome = Math.max(toNumber(income), 0)
    const totalExpenses = [rent, groceries, transport, utilities, misc]
      .reduce((sum, val) => sum + Math.max(toNumber(val), 0), 0)
    return {
      monthlyIncome,
      totalExpenses,
      surplus: monthlyIncome - totalExpenses,
    }
  }, [income, rent, groceries, transport, utilities, misc])

  return (
    <section className="tool">
      <h2>Budget Planner</h2>
      <p className="tool-desc">Track monthly spending and identify savings surplus.</p>
      <div className="grid-2">
        <Field label="Monthly Income (INR)">
          <input type="number" min="0" value={income} onChange={(e) => setIncome(e.target.value)} />
        </Field>
        <Field label="Rent (INR)">
          <input type="number" min="0" value={rent} onChange={(e) => setRent(e.target.value)} />
        </Field>
        <Field label="Groceries (INR)">
          <input type="number" min="0" value={groceries} onChange={(e) => setGroceries(e.target.value)} />
        </Field>
        <Field label="Transport (INR)">
          <input type="number" min="0" value={transport} onChange={(e) => setTransport(e.target.value)} />
        </Field>
        <Field label="Utilities (INR)">
          <input type="number" min="0" value={utilities} onChange={(e) => setUtilities(e.target.value)} />
        </Field>
        <Field label="Miscellaneous (INR)">
          <input type="number" min="0" value={misc} onChange={(e) => setMisc(e.target.value)} />
        </Field>
      </div>
      <div className="stat-grid">
        <Stat label="Total Expenses" value={formatCurrencyINR(data.totalExpenses)} />
        <Stat label="Surplus / Deficit" value={formatCurrencyINR(data.surplus)} />
        <Stat label="Spent % of Income" value={`${formatNumber((data.totalExpenses / (data.monthlyIncome || 1)) * 100)}%`} />
      </div>
    </section>
  )
}
