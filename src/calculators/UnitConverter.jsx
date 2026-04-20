import { useMemo, useState } from 'react'
import { Field, Stat } from '../components/FormControls'
import { formatNumber, toNumber } from '../utils/helpers'

const converterMeta = {
  length: {
    units: ['meter', 'kilometer', 'mile', 'foot'],
    toBase: { meter: (v) => v, kilometer: (v) => v * 1000, mile: (v) => v * 1609.34, foot: (v) => v * 0.3048 },
    fromBase: { meter: (v) => v, kilometer: (v) => v / 1000, mile: (v) => v / 1609.34, foot: (v) => v / 0.3048 },
  },
  weight: {
    units: ['kilogram', 'gram', 'pound'],
    toBase: { kilogram: (v) => v, gram: (v) => v / 1000, pound: (v) => v * 0.453592 },
    fromBase: { kilogram: (v) => v, gram: (v) => v * 1000, pound: (v) => v / 0.453592 },
  },
  temperature: {
    units: ['celsius', 'fahrenheit', 'kelvin'],
    toBase: { celsius: (v) => v, fahrenheit: (v) => ((v - 32) * 5) / 9, kelvin: (v) => v - 273.15 },
    fromBase: { celsius: (v) => v, fahrenheit: (v) => (v * 9) / 5 + 32, kelvin: (v) => v + 273.15 },
  },
  area: {
    units: ['sqm', 'sqft', 'acre'],
    toBase: { sqm: (v) => v, sqft: (v) => v / 10.7639, acre: (v) => v * 4046.856 },
    fromBase: { sqm: (v) => v, sqft: (v) => v * 10.7639, acre: (v) => v / 4046.856 },
  },
  speed: {
    units: ['kmph', 'mph', 'mps'],
    toBase: { kmph: (v) => v, mph: (v) => v * 1.60934, mps: (v) => v * 3.6 },
    fromBase: { kmph: (v) => v, mph: (v) => v / 1.60934, mps: (v) => v / 3.6 },
  },
  data: {
    units: ['byte', 'kb', 'mb', 'gb'],
    toBase: { byte: (v) => v, kb: (v) => v * 1024, mb: (v) => v * 1024 * 1024, gb: (v) => v * 1024 * 1024 * 1024 },
    fromBase: { byte: (v) => v, kb: (v) => v / 1024, mb: (v) => v / (1024 * 1024), gb: (v) => v / (1024 * 1024 * 1024) },
  },
}

export default function UnitConverter() {
  const [type, setType] = useState('length')
  const [from, setFrom] = useState('meter')
  const [to, setTo] = useState('kilometer')
  const [value, setValue] = useState(1000)

  const units = converterMeta[type].units

  const output = useMemo(() => {
    const base = converterMeta[type].toBase[from](toNumber(value))
    return converterMeta[type].fromBase[to](base)
  }, [type, from, to, value])

  return (
    <section className="tool">
      <h2>Unit Converter</h2>
      <p className="tool-desc">Convert common day-to-day units instantly.</p>
      <div className="grid-2">
        <Field label="Category">
          <select value={type} onChange={(e) => {
            const t = e.target.value
            setType(t)
            setFrom(converterMeta[t].units[0])
            setTo(converterMeta[t].units[1] ?? converterMeta[t].units[0])
          }}>
            <option value="length">Length</option>
            <option value="weight">Weight</option>
            <option value="temperature">Temperature</option>
            <option value="area">Area</option>
            <option value="speed">Speed</option>
            <option value="data">Data</option>
          </select>
        </Field>
        <Field label="Value">
          <input type="number" value={value} onChange={(e) => setValue(e.target.value)} />
        </Field>
        <Field label="From">
          <select value={from} onChange={(e) => setFrom(e.target.value)}>
            {units.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </Field>
        <Field label="To">
          <select value={to} onChange={(e) => setTo(e.target.value)}>
            {units.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </Field>
      </div>
      <div className="stat-grid">
        <Stat label="Converted Value" value={formatNumber(output, 4)} />
      </div>
    </section>
  )
}
