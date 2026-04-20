import { useMemo, useState } from 'react'
import { Field, Stat } from '../components/FormControls'
import { formatNumber, toNumber } from '../utils/helpers'

export default function BmiCalorieCalculator() {
  const [age, setAge] = useState(28)
  const [gender, setGender] = useState('male')
  const [height, setHeight] = useState(172)
  const [weight, setWeight] = useState(72)
  const [activity, setActivity] = useState(1.55)

  const data = useMemo(() => {
    const hM = Math.max(toNumber(height), 0) / 100
    const w = Math.max(toNumber(weight), 0)
    const a = Math.max(toNumber(age), 0)
    const bmi = hM > 0 ? w / (hM * hM) : 0

    let category = 'Underweight'
    if (bmi >= 18.5 && bmi < 25) category = 'Normal'
    else if (bmi >= 25 && bmi < 30) category = 'Overweight'
    else if (bmi >= 30) category = 'Obese'

    const bmr = gender === 'male'
      ? 10 * w + 6.25 * toNumber(height) - 5 * a + 5
      : 10 * w + 6.25 * toNumber(height) - 5 * a - 161
    const calories = bmr * toNumber(activity)

    return { bmi, category, calories }
  }, [age, gender, height, weight, activity])

  return (
    <section className="tool">
      <h2>BMI + Calorie Calculator</h2>
      <p className="tool-desc">Understand weight category and maintenance calorie estimate.</p>
      <div className="grid-2">
        <Field label="Age">
          <input type="number" min="0" value={age} onChange={(e) => setAge(e.target.value)} />
        </Field>
        <Field label="Gender">
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </Field>
        <Field label="Height (cm)">
          <input type="number" min="0" value={height} onChange={(e) => setHeight(e.target.value)} />
        </Field>
        <Field label="Weight (kg)">
          <input type="number" min="0" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </Field>
        <Field label="Activity Level">
          <select value={activity} onChange={(e) => setActivity(e.target.value)}>
            <option value={1.2}>Sedentary</option>
            <option value={1.375}>Lightly Active</option>
            <option value={1.55}>Moderately Active</option>
            <option value={1.725}>Very Active</option>
          </select>
        </Field>
      </div>
      <div className="stat-grid">
        <Stat label="BMI" value={formatNumber(data.bmi)} />
        <Stat label="Category" value={data.category} />
        <Stat label="Daily Calories" value={`${formatNumber(data.calories, 0)} kcal`} />
      </div>
    </section>
  )
}
