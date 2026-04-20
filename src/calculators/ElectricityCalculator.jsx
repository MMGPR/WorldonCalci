import { useMemo, useState } from 'react'
import { Field, Stat } from '../components/FormControls'
import { formatCurrencyINR, formatNumber, toNumber } from '../utils/helpers'

export default function ElectricityCalculator() {
  const [wattage, setWattage] = useState(1200)
  const [hoursPerDay, setHoursPerDay] = useState(4)
  const [daysPerMonth, setDaysPerMonth] = useState(30)
  const [tariff, setTariff] = useState(8)

  const data = useMemo(() => {
    const units = (Math.max(toNumber(wattage), 0) * Math.max(toNumber(hoursPerDay), 0) * Math.max(toNumber(daysPerMonth), 0)) / 1000
    const bill = units * Math.max(toNumber(tariff), 0)
    return { units, bill }
  }, [wattage, hoursPerDay, daysPerMonth, tariff])

  return (
    <section className="tool">
      <h2>Electricity Bill Estimator</h2>
      <p className="tool-desc">Estimate units consumed and expected electricity bill.</p>
      <div className="grid-2">
        <Field label="Appliance Wattage (W)">
          <input type="number" min="0" value={wattage} onChange={(e) => setWattage(e.target.value)} />
        </Field>
        <Field label="Hours Per Day">
          <input type="number" min="0" step="0.1" value={hoursPerDay} onChange={(e) => setHoursPerDay(e.target.value)} />
        </Field>
        <Field label="Days Per Month">
          <input type="number" min="0" step="1" value={daysPerMonth} onChange={(e) => setDaysPerMonth(e.target.value)} />
        </Field>
        <Field label="Tariff (INR per unit)">
          <input type="number" min="0" step="0.1" value={tariff} onChange={(e) => setTariff(e.target.value)} />
        </Field>
      </div>
      <div className="stat-grid">
        <Stat label="Monthly Units" value={`${formatNumber(data.units, 2)} kWh`} />
        <Stat label="Estimated Bill" value={formatCurrencyINR(data.bill)} />
      </div>
    </section>
  )
}
