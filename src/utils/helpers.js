export const formatCurrencyINR = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0)

export const formatNumber = (value, maxDigits = 2) =>
  new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: maxDigits,
  }).format(Number.isFinite(value) ? value : 0)

export const toNumber = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export const addMonths = (date, monthsToAdd) => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + monthsToAdd)
  return result
}

export const breakdownMonths = (totalMonths) => {
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  const days = months * 30
  return { years, months, days }
}

export const calculateEmi = (principal, annualRate, months) => {
  const p = Math.max(principal, 0)
  const n = Math.max(Math.round(months), 0)
  const r = Math.max(annualRate, 0) / 1200
  if (p <= 0 || n <= 0) return 0
  if (r === 0) return p / n
  const growth = (1 + r) ** n
  return (p * r * growth) / (growth - 1)
}
