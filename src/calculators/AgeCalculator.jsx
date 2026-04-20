import { useMemo, useState } from 'react'
import { Field, Stat } from '../components/FormControls'

export default function AgeCalculator() {
  const [dob, setDob] = useState('1998-01-01')
  const [asOf, setAsOf] = useState(new Date().toISOString().slice(0, 10))

  const result = useMemo(() => {
    if (!dob || !asOf) return null
    const start = new Date(dob)
    const end = new Date(asOf)
    if (start > end) return null

    let years = end.getFullYear() - start.getFullYear()
    let months = end.getMonth() - start.getMonth()
    let days = end.getDate() - start.getDate()

    if (days < 0) {
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0)
      days += prevMonth.getDate()
      months -= 1
    }
    if (months < 0) {
      months += 12
      years -= 1
    }

    const nextBirthday = new Date(end.getFullYear(), start.getMonth(), start.getDate())
    if (nextBirthday < end) nextBirthday.setFullYear(end.getFullYear() + 1)
    const daysToBirthday = Math.ceil((nextBirthday - end) / (1000 * 60 * 60 * 24))

    return { years, months, days, daysToBirthday }
  }, [dob, asOf])

  return (
    <section className="tool">
      <h2>Age Calculator</h2>
      <p className="tool-desc">Find exact age and next birthday countdown.</p>
      <div className="grid-2">
        <Field label="Date of Birth">
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
        </Field>
        <Field label="Calculate As Of">
          <input type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} />
        </Field>
      </div>
      {result ? (
        <div className="stat-grid">
          <Stat label="Years" value={result.years} />
          <Stat label="Months" value={result.months} />
          <Stat label="Days" value={result.days} />
          <Stat label="Next Birthday In" value={`${result.daysToBirthday} days`} />
        </div>
      ) : (
        <p className="note">Enter valid dates. Date of birth must be before the selected date.</p>
      )}
    </section>
  )
}
