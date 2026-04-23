import { useState } from 'react'
import '../App.css'

import EmiCalculator              from '../calculators/EmiCalculator'
import AgeCalculator              from '../calculators/AgeCalculator'
import SimpleInterestCalculator   from '../calculators/SimpleInterestCalculator'
import CompoundInterestCalculator from '../calculators/CompoundInterestCalculator'
import BasicCalculator            from '../calculators/BasicCalculator'
import BreakEvenCalculator        from '../calculators/BreakEvenCalculator'
import LoanPrepaymentCalculator   from '../calculators/LoanPrepaymentCalculator'
import SavingsGoalCalculator      from '../calculators/SavingsGoalCalculator'
import SipCalculator              from '../calculators/SipCalculator'
import BudgetPlanner              from '../calculators/BudgetPlanner'
import InflationCalculator        from '../calculators/InflationCalculator'
import TaxEstimator               from '../calculators/TaxEstimator'
import BmiCalorieCalculator       from '../calculators/BmiCalorieCalculator'
import UnitConverter              from '../calculators/UnitConverter'
import TimeDifferenceCalculator   from '../calculators/TimeDifferenceCalculator'
import BillSplitCalculator        from '../calculators/BillSplitCalculator'
import ElectricityCalculator      from '../calculators/ElectricityCalculator'
import FuelCostCalculator         from '../calculators/FuelCostCalculator'
import EmergencyFundCalculator    from '../calculators/EmergencyFundCalculator'
import SplitWise                  from '../calculators/SplitWise'

// ── Categories ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'finance',   icon: '💰', label: 'Finance',        desc: 'Loans, investments, taxes & savings' },
  { id: 'everyday',  icon: '🏠', label: 'Daily Life',     desc: 'Bills, fuel, electricity & budget' },
  { id: 'general',   icon: '🧮', label: 'General',        desc: 'Basic math, age, time & unit conversion' },
  { id: 'health',    icon: '💪', label: 'Health',         desc: 'BMI, calories & body metrics' },
  { id: 'groups',    icon: '👥', label: 'Group Expenses', desc: 'Split group bills with settlements' },
]

// ── Calculator registry ───────────────────────────────────────────────────────
const CALCULATORS = [
  // Finance
  { id: 'emi',               category: 'finance',  icon: '🏦', label: 'EMI',             component: <EmiCalculator /> },
  { id: 'simple-interest',   category: 'finance',  icon: '📈', label: 'Simple Interest', component: <SimpleInterestCalculator /> },
  { id: 'compound-interest', category: 'finance',  icon: '📊', label: 'Compound Interest', component: <CompoundInterestCalculator /> },
  { id: 'loan-prepay',       category: 'finance',  icon: '💳', label: 'Loan Prepayment', component: <LoanPrepaymentCalculator /> },
  { id: 'savings-goal',      category: 'finance',  icon: '🎯', label: 'Savings Goal',    component: <SavingsGoalCalculator /> },
  { id: 'sip',               category: 'finance',  icon: '📆', label: 'SIP Returns',     component: <SipCalculator /> },
  { id: 'break-even',        category: 'finance',  icon: '⚖️', label: 'Break-Even',      component: <BreakEvenCalculator /> },
  { id: 'inflation',         category: 'finance',  icon: '📉', label: 'Inflation Impact',component: <InflationCalculator /> },
  { id: 'tax',               category: 'finance',  icon: '🧾', label: 'Tax Estimator',   component: <TaxEstimator /> },
  { id: 'emergency',         category: 'finance',  icon: '🛡️', label: 'Emergency Fund',  component: <EmergencyFundCalculator /> },
  // Daily Life
  { id: 'budget',            category: 'everyday', icon: '💼', label: 'Budget Planner',  component: <BudgetPlanner /> },
  { id: 'bill-split',        category: 'everyday', icon: '🍽️', label: 'Bill Split + Tip',component: <BillSplitCalculator /> },
  { id: 'electricity',       category: 'everyday', icon: '💡', label: 'Electricity Bill',component: <ElectricityCalculator /> },
  { id: 'fuel',              category: 'everyday', icon: '⛽', label: 'Fuel Cost',        component: <FuelCostCalculator /> },
  // General
  { id: 'basic',             category: 'general',  icon: '🧮', label: 'Basic Calculator',component: <BasicCalculator /> },
  { id: 'age',               category: 'general',  icon: '🎂', label: 'Age Calculator',  component: <AgeCalculator /> },
  { id: 'time-diff',         category: 'general',  icon: '⏱️', label: 'Time Difference', component: <TimeDifferenceCalculator /> },
  { id: 'converter',         category: 'general',  icon: '🔄', label: 'Unit Converter',  component: <UnitConverter /> },
  // Health
  { id: 'bmi',               category: 'health',   icon: '💪', label: 'BMI + Calories',  component: <BmiCalorieCalculator /> },
  // Groups
  { id: 'splitwise',         category: 'groups',   icon: '👥', label: 'Split Groups',    component: <SplitWise /> },
]

// ── Ad slot component ─────────────────────────────────────────────────────────
function AdSlot({ size = 'leaderboard', label }) {
  const sizes = {
    leaderboard:  { w: '100%', h: '90px',  hint: '728 × 90 — Leaderboard' },
    rectangle:    { w: '300px', h: '250px', hint: '300 × 250 — Medium Rectangle' },
    halfpage:     { w: '300px', h: '600px', hint: '300 × 600 — Half Page' },
  }
  const s = sizes[size] ?? sizes.leaderboard
  return (
    <div className="ad-slot" style={{ maxWidth: s.w, height: s.h }} aria-label="Advertisement placeholder">
      <span className="ad-label">Ad</span>
      <p className="ad-hint">{label ?? s.hint}</p>
      <p className="ad-sub">Place your Google AdSense or sponsor banner here</p>
    </div>
  )
}

// ── Home ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [activeCategory, setActiveCategory] = useState('finance')
  const [activeCalcId,   setActiveCalcId]   = useState('emi')

  const visibleCalcs = CALCULATORS.filter((c) => c.category === activeCategory)
  const activeCalc   = CALCULATORS.find((c) => c.id === activeCalcId)
                    ?? visibleCalcs[0]
                    ?? CALCULATORS[0]

  const switchCategory = (catId) => {
    setActiveCategory(catId)
    const first = CALCULATORS.find((c) => c.category === catId)
    if (first) setActiveCalcId(first.id)
  }

  const activeCat = CATEGORIES.find((c) => c.id === activeCategory)

  return (
    <div className="app-shell">
      {/* ── Header ── */}
      <header className="site-header card">
        <div className="site-header-inner">
          <div>
            <p className="site-kicker">Smart Finance Studio</p>
            <h1>Calicu World</h1>
            <p className="site-tagline">Your all-in-one calculator hub for finance, daily life, health &amp; more.</p>
          </div>
          <div className="header-ad-wrap">
            <AdSlot size="leaderboard" label="Header Banner — 728 × 90" />
          </div>
        </div>
      </header>

      {/* ── Category tabs ── */}
      <nav className="cat-nav card" aria-label="Calculator categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={activeCategory === cat.id ? 'cat-tab active' : 'cat-tab'}
            onClick={() => switchCategory(cat.id)}
          >
            <span className="cat-icon">{cat.icon}</span>
            <span className="cat-label">{cat.label}</span>
          </button>
        ))}
      </nav>

      {/* ── Calculator pills for active category ── */}
      <div className="calc-strip card">
        <p className="strip-desc">{activeCat?.desc}</p>
        <div className="calc-pills">
          {visibleCalcs.map((c) => (
            <button
              key={c.id}
              className={activeCalc?.id === c.id ? 'calc-pill active' : 'calc-pill'}
              onClick={() => setActiveCalcId(c.id)}
            >
              <span>{c.icon}</span> {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main content + right ad column ── */}
      <div className="main-area">
        <section className="card tool-panel">
          {activeCalc?.component}
        </section>

        <aside className="ad-column">
          <AdSlot size="rectangle" />
          <AdSlot size="halfpage" />
        </aside>
      </div>

      {/* ── Bottom ad banner ── */}
      <div className="bottom-ad-wrap">
        <AdSlot size="leaderboard" label="Footer Banner — 728 × 90" />
      </div>

      {/* ── Footer ── */}
      <footer className="site-footer card">
        <div className="footer-left">
          <strong>Calicu World</strong>
          <span>·</span>
          <span>{new Date().getFullYear()} — All-in-one daily calculator hub</span>
        </div>
        <div className="footer-right">
          <span>20 calculators across 5 categories</span>
        </div>
      </footer>
    </div>
  )
}