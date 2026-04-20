import { useMemo, useState } from 'react'
import { Field, Stat } from '../components/FormControls'
import { formatCurrencyINR, toNumber, addMonths, breakdownMonths } from '../utils/helpers'

export default function BreakEvenCalculator() {
  const [initialInvestment, setInitialInvestment] = useState(500000)
  const [monthlyExpenses, setMonthlyExpenses] = useState(60000)
  const [monthlyEarnings, setMonthlyEarnings] = useState(85000)
  const [expenseGrowth, setExpenseGrowth] = useState(0)
  const [earningGrowth, setEarningGrowth] = useState(0)
  const [oneTimeCost, setOneTimeCost] = useState(0)

  const data = useMemo(() => {
    let balance = -(Math.max(toNumber(initialInvestment), 0) + Math.max(toNumber(oneTimeCost), 0))
    let month = 0
    let currentExpense = Math.max(toNumber(monthlyExpenses), 0)
    let currentEarning = Math.max(toNumber(monthlyEarnings), 0)
    const expenseRate = Math.max(toNumber(expenseGrowth), -100) / 100
    const earningRate = Math.max(toNumber(earningGrowth), -100) / 100

    while (balance < 0 && month < 1200) {
      balance += currentEarning - currentExpense
      month += 1
      currentExpense *= 1 + expenseRate
      currentEarning *= 1 + earningRate
    }

    const brokeEven = balance >= 0
    const bd = breakdownMonths(month)
    const targetDate = addMonths(new Date(), month)

    return { brokeEven, month, years: bd.years, remMonths: bd.months, days: bd.days, balance, targetDate }
  }, [initialInvestment, monthlyExpenses, monthlyEarnings, expenseGrowth, earningGrowth, oneTimeCost])

  return (
    <section className="tool">
      <h2>Break-Even Calculator</h2>
      <p className="tool-desc">Find when cumulative profit offsets your initial investment and monthly burn.</p>
      <div className="grid-2">
        <Field label="Initial Investment (INR)">
          <input type="number" min="0" value={initialInvestment} onChange={(e) => setInitialInvestment(e.target.value)} />
        </Field>
        <Field label="One-Time Extra Cost (INR)">
          <input type="number" min="0" value={oneTimeCost} onChange={(e) => setOneTimeCost(e.target.value)} />
        </Field>
        <Field label="Monthly Expenses (INR)">
          <input type="number" min="0" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(e.target.value)} />
        </Field>
        <Field label="Monthly Earnings (INR)">
          <input type="number" min="0" value={monthlyEarnings} onChange={(e) => setMonthlyEarnings(e.target.value)} />
        </Field>
        <Field label="Expense Growth (% monthly)">
          <input type="number" step="0.1" value={expenseGrowth} onChange={(e) => setExpenseGrowth(e.target.value)} />
        </Field>
        <Field label="Earning Growth (% monthly)">
          <input type="number" step="0.1" value={earningGrowth} onChange={(e) => setEarningGrowth(e.target.value)} />
        </Field>
      </div>
      <div className="stat-grid">
        <Stat label="Break-Even (Months)" value={data.brokeEven ? data.month : 'Not reached'} />
        <Stat label="Break-Even (Y/M/D)" value={data.brokeEven ? `${data.years}y ${data.remMonths}m ${data.days}d` : 'Not reached'} />
        <Stat label="Estimated Break-Even Date" value={data.brokeEven ? data.targetDate.toLocaleDateString() : 'Not reached'} />
        <Stat label="Balance at Simulation End" value={formatCurrencyINR(data.balance)} />
      </div>
    </section>
  )
}
