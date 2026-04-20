import { useMemo, useState } from 'react'
import { Field, Stat } from '../components/FormControls'

const now = new Date()
const pad = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()).toISOString().slice(0, 16)

export default function TimeDifferenceCalculator() {
  const [start, setStart] = useState(pad(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0)))
  const [end, setEnd] = useState(pad(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0)))

  const data = useMemo(() => {
    const s = new Date(start)
    const e = new Date(end)
    if (e <= s) return null

    const diffMs = e - s
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60)

    let workdays = 0
    const cursor = new Date(s)
    while (cursor <= e) {
      const day = cursor.getDay()
      if (day !== 0 && day !== 6) workdays += 1
      cursor.setDate(cursor.getDate() + 1)
    }

    return { days, hours, minutes, workdays }
  }, [start, end])

  return (
    <section className="tool">
      <h2>Time Difference Calculator</h2>
      <p className="tool-desc">Compute duration and business-day span between two dates.</p>
      <div className="grid-2">
        <Field label="Start Date & Time">
          <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
        </Field>
        <Field label="End Date & Time">
          <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
        </Field>
      </div>
      {data ? (
        <div className="stat-grid">
          <Stat label="Days" value={data.days} />
          <Stat label="Hours" value={data.hours} />
          <Stat label="Minutes" value={data.minutes} />
          <Stat label="Business Days" value={data.workdays} />
        </div>
      ) : (
        <p className="note">End datetime must be after start datetime.</p>
      )}
    </section>
  )
}
