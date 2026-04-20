import { useMemo, useState } from 'react'
import { Field, Stat } from '../components/FormControls'
import { formatCurrencyINR, formatNumber, toNumber } from '../utils/helpers'

export default function FuelCostCalculator() {
  const [distance, setDistance] = useState(240)
  const [mileage, setMileage] = useState(18)
  const [fuelPrice, setFuelPrice] = useState(104)
  const [tolls, setTolls] = useState(200)

  const data = useMemo(() => {
    const km = Math.max(toNumber(distance), 0)
    const kmpl = Math.max(toNumber(mileage), 0.1)
    const price = Math.max(toNumber(fuelPrice), 0)
    const toll = Math.max(toNumber(tolls), 0)
    const fuelNeeded = km / kmpl
    const fuelCost = fuelNeeded * price
    const total = fuelCost + toll
    return { fuelNeeded, fuelCost, total, costPerKm: km > 0 ? total / km : 0 }
  }, [distance, mileage, fuelPrice, tolls])

  return (
    <section className="tool">
      <h2>Fuel Cost / Trip Planner</h2>
      <p className="tool-desc">Estimate trip fuel requirement and total travel cost.</p>
      <div className="grid-2">
        <Field label="Distance (km)">
          <input type="number" min="0" value={distance} onChange={(e) => setDistance(e.target.value)} />
        </Field>
        <Field label="Mileage (km/l)">
          <input type="number" min="0.1" step="0.1" value={mileage} onChange={(e) => setMileage(e.target.value)} />
        </Field>
        <Field label="Fuel Price (INR/l)">
          <input type="number" min="0" step="0.1" value={fuelPrice} onChange={(e) => setFuelPrice(e.target.value)} />
        </Field>
        <Field label="Tolls / Parking (INR)">
          <input type="number" min="0" value={tolls} onChange={(e) => setTolls(e.target.value)} />
        </Field>
      </div>
      <div className="stat-grid">
        <Stat label="Fuel Needed" value={`${formatNumber(data.fuelNeeded, 2)} liters`} />
        <Stat label="Fuel Cost" value={formatCurrencyINR(data.fuelCost)} />
        <Stat label="Total Trip Cost" value={formatCurrencyINR(data.total)} />
        <Stat label="Cost per km" value={formatCurrencyINR(data.costPerKm)} />
      </div>
    </section>
  )
}
