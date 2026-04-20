import { useState } from 'react'
import { Stat } from '../components/FormControls'

export default function BasicCalculator() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('0')
  const [history, setHistory] = useState([])

  const evaluate = () => {
    const safe = expression.replace(/x/g, '*').replace(/÷/g, '/')
    if (!/^[0-9+\-*/().%\s]*$/.test(safe)) {
      setResult('Invalid input')
      return
    }
    try {
      const value = Function(`'use strict'; return (${safe})`)()
      const final = Number.isFinite(value) ? value : 'Error'
      setResult(String(final))
      if (Number.isFinite(value)) {
        setHistory((prev) => [{ exp: expression, value }, ...prev].slice(0, 5))
      }
    } catch {
      setResult('Error')
    }
  }

  return (
    <section className="tool">
      <h2>Basic Calculator</h2>
      <p className="tool-desc">Simple arithmetic with quick history.</p>
      <div className="calc-row">
        <input
          type="text"
          placeholder="Example: (25 + 5) * 3"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && evaluate()}
        />
        <button onClick={evaluate}>Calculate</button>
        <button onClick={() => setExpression('')}>Clear</button>
      </div>
      <div className="stat-grid">
        <Stat label="Result" value={result} />
      </div>
      <div className="history">
        {history.map((item, idx) => (
          <p key={`${item.exp}-${idx}`}>{item.exp} = {item.value}</p>
        ))}
      </div>
    </section>
  )
}
