import { useMemo, useState } from 'react'
import { Field, Stat } from '../components/FormControls'
import { formatCurrencyINR, formatNumber, toNumber } from '../utils/helpers'

export default function TaxEstimator() {
  const [annualIncome, setAnnualIncome] = useState(1200000)
  const [deductions, setDeductions] = useState(150000)

  const taxData = useMemo(() => {
    const income = Math.max(toNumber(annualIncome), 0)
    const deductible = Math.max(toNumber(deductions), 0)
    const taxable = Math.max(income - deductible, 0)

    const slabs = [
      { upto: 300000, rate: 0 },
      { upto: 700000, rate: 0.05 },
      { upto: 1000000, rate: 0.1 },
      { upto: 1200000, rate: 0.15 },
      { upto: 1500000, rate: 0.2 },
      { upto: Infinity, rate: 0.3 },
    ]

    let remaining = taxable
    let previousCap = 0
    let tax = 0

    for (const slab of slabs) {
      if (remaining <= 0) break
      const taxableInSlab = Math.min(remaining, slab.upto - previousCap)
      tax += taxableInSlab * slab.rate
      remaining -= taxableInSlab
      previousCap = slab.upto
    }

    return { taxable, tax, effectiveRate: taxable > 0 ? (tax / taxable) * 100 : 0, takeHome: income - tax }
  }, [annualIncome, deductions])

  return (
    <section className="tool">
      <h2>Tax Estimator</h2>
      <p className="tool-desc">Quick progressive tax approximation for annual planning.</p>
      <div className="grid-2">
        <Field label="Annual Income (INR)">
          <input type="number" min="0" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} />
        </Field>
        <Field label="Total Deductions (INR)">
          <input type="number" min="0" value={deductions} onChange={(e) => setDeductions(e.target.value)} />
        </Field>
      </div>
      <div className="stat-grid">
        <Stat label="Taxable Income" value={formatCurrencyINR(taxData.taxable)} />
        <Stat label="Estimated Tax" value={formatCurrencyINR(taxData.tax)} />
        <Stat label="Effective Rate" value={`${formatNumber(taxData.effectiveRate)}%`} />
        <Stat label="Post-Tax Income" value={formatCurrencyINR(taxData.takeHome)} />
      </div>
    </section>
  )
}
