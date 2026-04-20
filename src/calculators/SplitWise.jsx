import { useMemo, useState } from 'react'
import { formatCurrencyINR, toNumber } from '../utils/helpers'

// ── tiny id generator ─────────────────────────────────────────────────────────
const genId = () => Math.random().toString(36).slice(2, 9)

// ── expense categories ────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: 'food',          label: '🍔 Food' },
  { value: 'transport',     label: '🚗 Transport' },
  { value: 'rent',          label: '🏠 Rent' },
  { value: 'entertainment', label: '🎬 Entertainment' },
  { value: 'utilities',     label: '💡 Utilities' },
  { value: 'groceries',     label: '🛒 Groceries' },
  { value: 'travel',        label: '✈️ Travel' },
  { value: 'other',         label: '📦 Other' },
]

// ── balance calculation ───────────────────────────────────────────────────────
function computeBalances(members, expenses) {
  const bal = Object.fromEntries(members.map((m) => [m, 0]))
  for (const exp of expenses) {
    const total = toNumber(exp.amount)
    bal[exp.paidBy] = (bal[exp.paidBy] ?? 0) + total
    for (const [m, val] of Object.entries(exp.splits)) {
      bal[m] = (bal[m] ?? 0) - toNumber(val)
    }
  }
  return bal
}

// ── debt simplification (greedy minimum transactions) ────────────────────────
function simplifyDebts(balances) {
  const credits = []
  const debts = []
  for (const [person, balance] of Object.entries(balances)) {
    const r = Math.round(balance * 100) / 100
    if (r > 0.01) credits.push({ person, amount: r })
    else if (r < -0.01) debts.push({ person, amount: -r })
  }
  credits.sort((a, b) => b.amount - a.amount)
  debts.sort((a, b) => b.amount - a.amount)

  const txns = []
  let i = 0, j = 0
  while (i < debts.length && j < credits.length) {
    const amt = Math.min(debts[i].amount, credits[j].amount)
    txns.push({ from: debts[i].person, to: credits[j].person, amount: Math.round(amt * 100) / 100 })
    debts[i].amount -= amt
    credits[j].amount -= amt
    if (debts[i].amount < 0.01) i++
    if (credits[j].amount < 0.01) j++
  }
  return txns
}

// ── helpers ───────────────────────────────────────────────────────────────────
const buildInitialSplits = (members) => Object.fromEntries(members.map((m) => [m, '']))

// ── ExpenseForm ───────────────────────────────────────────────────────────────
function ExpenseForm({ members, onAdd, onCancel }) {
  const [title, setTitle]           = useState('')
  const [amount, setAmount]         = useState('')
  const [paidBy, setPaidBy]         = useState(members[0] ?? '')
  const [splitType, setSplitType]   = useState('equal')
  const [splits, setSplits]         = useState(buildInitialSplits(members))
  const [category, setCategory]     = useState('other')
  const [date, setDate]             = useState(new Date().toISOString().slice(0, 10))
  const [notes, setNotes]           = useState('')

  const total = toNumber(amount)
  const equalShare = members.length > 0 ? total / members.length : 0

  const splitTotal = useMemo(() => {
    if (splitType === 'equal') return total
    return Object.values(splits).reduce((s, v) => s + toNumber(v), 0)
  }, [splits, splitType, total])

  const isValid = useMemo(() => {
    if (!title.trim() || total <= 0) return false
    if (splitType === 'equal') return true
    if (splitType === 'percentage') return Math.abs(splitTotal - 100) < 0.5
    return Math.abs(splitTotal - total) < 1
  }, [title, total, splitType, splitTotal])

  const setSplit = (member, value) => setSplits((prev) => ({ ...prev, [member]: value }))

  const splitError = splitType === 'percentage'
    ? Math.abs(splitTotal - 100) > 0.5 ? `${splitTotal.toFixed(1)}% / 100%` : null
    : splitType === 'unequal' && Math.abs(splitTotal - total) > 1
      ? `${formatCurrencyINR(splitTotal)} of ${formatCurrencyINR(total)}`
      : null

  const handleAdd = () => {
    if (!isValid) return
    const finalSplits = splitType === 'equal'
      ? Object.fromEntries(members.map((m) => [m, equalShare]))
      : splitType === 'percentage'
        ? Object.fromEntries(Object.entries(splits).map(([k, v]) => [k, (total * toNumber(v)) / 100]))
        : Object.fromEntries(Object.entries(splits).map(([k, v]) => [k, toNumber(v)]))
    onAdd({ id: genId(), title: title.trim(), amount: total, paidBy, splitType, splits: finalSplits, category, date, notes: notes.trim() })
  }

  return (
    <div className="sw-expense-form">
      <h3 className="sw-section-title">Add Expense</h3>
      <div className="grid-2">
        <label className="field">
          <span>Title</span>
          <input placeholder="e.g. Dinner" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label className="field">
          <span>Amount (₹)</span>
          <input type="number" min="0" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <label className="field">
          <span>Paid By</span>
          <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
            {members.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Date</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="field">
          <span>Notes (optional)</span>
          <input placeholder="Any notes…" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
      </div>

      <div className="sw-split-toggle">
        {[
          { key: 'equal',      label: '= Split Equally' },
          { key: 'unequal',    label: '± Custom Amounts' },
          { key: 'percentage', label: '% By Percentage' },
        ].map(({ key, label }) => (
          <button key={key} className={splitType === key ? 'sw-toggle active' : 'sw-toggle'} onClick={() => setSplitType(key)}>
            {label}
          </button>
        ))}
      </div>

      {splitType === 'equal' && total > 0 && (
        <p className="sw-equal-hint">Each person pays {formatCurrencyINR(equalShare)}</p>
      )}

      {splitType !== 'equal' && (
        <div className="sw-splits">
          {members.map((m) => (
            <div key={m} className="sw-split-row">
              <span className="sw-split-name">{m}</span>
              <div className="sw-split-input-wrap">
                <span className="sw-split-prefix">{splitType === 'percentage' ? '%' : '₹'}</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={splits[m]}
                  onChange={(e) => setSplit(m, e.target.value)}
                />
              </div>
              {splitType === 'unequal' && toNumber(splits[m]) > 0 && (
                <span className="sw-split-pct">{total > 0 ? `${((toNumber(splits[m]) / total) * 100).toFixed(0)}%` : ''}</span>
              )}
            </div>
          ))}
          {splitError ? (
            <p className="sw-split-total invalid">⚠ Total: {splitError}</p>
          ) : (
            <p className="sw-split-total valid">✓ Split looks good</p>
          )}
        </div>
      )}

      <div className="sw-form-actions">
        <button className="sw-btn-primary" disabled={!isValid} onClick={handleAdd}>Add Expense</button>
        <button className="sw-btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}

// ── GroupList ─────────────────────────────────────────────────────────────────
function GroupList({ groups, onCreate, onOpen }) {
  const [open, setOpen]             = useState(false)
  const [name, setName]             = useState('')
  const [membersRaw, setMembersRaw] = useState('')

  const handleCreate = () => {
    const members = membersRaw.split(',').map((s) => s.trim()).filter(Boolean)
    if (!name.trim() || members.length < 2) return
    onCreate({ id: genId(), name: name.trim(), members, expenses: [] })
    setName('')
    setMembersRaw('')
    setOpen(false)
  }

  return (
    <section className="tool">
      <div className="sw-header">
        <div>
          <h2>Split Groups</h2>
          <p className="tool-desc">Create shared expense groups, track who paid what, and settle debts with minimum transactions.</p>
        </div>
        <button className="sw-btn-primary" onClick={() => setOpen((v) => !v)}>
          {open ? 'Cancel' : '+ New Group'}
        </button>
      </div>

      {open && (
        <div className="sw-create-box">
          <h3 className="sw-section-title">New Group</h3>
          <div className="grid-2">
            <label className="field">
              <span>Group Name</span>
              <input placeholder="e.g. Goa Trip 🏖️" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="field">
              <span>Members (comma-separated, min 2)</span>
              <input placeholder="Alice, Bob, Charlie" value={membersRaw} onChange={(e) => setMembersRaw(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreate()} />
            </label>
          </div>
          <button className="sw-btn-primary sw-create-submit" onClick={handleCreate}>
            Create Group
          </button>
        </div>
      )}

      {groups.length === 0 ? (
        <p className="note">No groups yet. Create one above to get started.</p>
      ) : (
        <div className="sw-group-grid">
          {groups.map((g) => {
            const totalSpend = g.expenses.reduce((s, e) => s + e.amount, 0)
            return (
              <button key={g.id} className="sw-group-card" onClick={() => onOpen(g.id)}>
                <span className="sw-group-emoji">👥</span>
                <span className="sw-group-name">{g.name}</span>
                <span className="sw-group-members">{g.members.join(', ')}</span>
                <span className="sw-group-stats">
                  {g.expenses.length} expense{g.expenses.length !== 1 ? 's' : ''} · {formatCurrencyINR(totalSpend)}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}

// ── GroupDetail ───────────────────────────────────────────────────────────────
function GroupDetail({ group, onBack, onAddExpense, onDeleteExpense, onUpdateGroup }) {
  const [showForm, setShowForm]   = useState(false)
  const [tab, setTab]             = useState('expenses')
  const [newMember, setNewMember] = useState('')
  const [settled, setSettled]     = useState([])

  const balances     = useMemo(() => computeBalances(group.members, group.expenses), [group.members, group.expenses])
  const transactions = useMemo(() => simplifyDebts(balances), [balances])
  const totalSpend   = group.expenses.reduce((s, e) => s + e.amount, 0)

  const handleAddMember = () => {
    const name = newMember.trim()
    if (!name || group.members.includes(name)) return
    onUpdateGroup({ ...group, members: [...group.members, name] })
    setNewMember('')
  }

  const toggleSettled = (key) =>
    setSettled((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key])

  const pendingCount = transactions.filter((t) => !settled.includes(`${t.from}|${t.to}|${t.amount}`)).length

  return (
    <section className="tool">
      <div className="sw-header">
        <div>
          <button className="sw-back" onClick={onBack}>← All Groups</button>
          <h2>{group.name}</h2>
          <p className="tool-desc">{group.members.join(' · ')}</p>
        </div>
        <button className="sw-btn-primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : '+ Add Expense'}
        </button>
      </div>

      <div className="sw-stats-row">
        <div className="stat"><span>Total Spend</span><strong>{formatCurrencyINR(totalSpend)}</strong></div>
        <div className="stat"><span>Expenses</span><strong>{group.expenses.length}</strong></div>
        <div className="stat"><span>Members</span><strong>{group.members.length}</strong></div>
        <div className="stat"><span>Avg per Head</span><strong>{formatCurrencyINR(group.members.length > 0 ? totalSpend / group.members.length : 0)}</strong></div>
        <div className="stat"><span>Pending Settles</span><strong>{pendingCount}</strong></div>
      </div>

      {showForm && (
        <ExpenseForm
          members={group.members}
          onAdd={(exp) => { onAddExpense(group.id, exp); setShowForm(false) }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="sw-tabs">
        {[
          { key: 'expenses', label: `Expenses (${group.expenses.length})` },
          { key: 'balances', label: 'Balances' },
          { key: 'settle',   label: `Settle Up${pendingCount > 0 ? ` (${pendingCount})` : ''}` },
        ].map(({ key, label }) => (
          <button key={key} className={tab === key ? 'sw-tab active' : 'sw-tab'} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Expenses tab ─────────────────────────────────────────────────── */}
      {tab === 'expenses' && (
        <div className="sw-expense-list">
          {group.expenses.length === 0 ? (
            <p className="note">No expenses yet. Add one using the button above.</p>
          ) : (
            [...group.expenses].reverse().map((exp) => {
              const cat = CATEGORIES.find((c) => c.value === exp.category)?.label ?? '📦'
              return (
                <div key={exp.id} className="sw-expense-item">
                  <span className="sw-exp-cat">{cat.split(' ')[0]}</span>
                  <div className="sw-exp-body">
                    <strong>{exp.title}</strong>
                    <span className="sw-exp-meta">
                      {exp.date} · Paid by <em>{exp.paidBy}</em>
                      {exp.splitType === 'equal' ? ' · Equal split' : exp.splitType === 'percentage' ? ' · % split' : ' · Custom split'}
                    </span>
                    {exp.notes && <span className="sw-exp-notes">💬 {exp.notes}</span>}
                  </div>
                  <div className="sw-exp-right">
                    <strong className="sw-exp-amt">{formatCurrencyINR(exp.amount)}</strong>
                    <button className="sw-delete" title="Remove" onClick={() => onDeleteExpense(group.id, exp.id)}>✕</button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* ── Balances tab ─────────────────────────────────────────────────── */}
      {tab === 'balances' && (
        <div className="sw-balance-section">
          <div className="sw-balance-list">
            {group.members.map((m) => {
              const bal = Math.round((balances[m] ?? 0) * 100) / 100
              return (
                <div key={m} className="sw-balance-row">
                  <span className="sw-bal-name">{m}</span>
                  <div className="sw-bal-bar-wrap">
                    <div
                      className={`sw-bal-bar ${bal >= 0 ? 'pos' : 'neg'}`}
                      style={{ width: `${Math.min(Math.abs(bal) / (totalSpend || 1) * 100, 100)}%` }}
                    />
                  </div>
                  <span className={`sw-bal-amount ${bal >= 0 ? 'sw-pos' : 'sw-neg'}`}>
                    {bal >= 0 ? `+${formatCurrencyINR(bal)}` : `-${formatCurrencyINR(-bal)}`}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="sw-add-member">
            <h4>Add Member to Group</h4>
            <div className="sw-add-member-row">
              <input
                placeholder="New member name…"
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
              />
              <button className="sw-btn-primary" onClick={handleAddMember}>Add</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Settle Up tab ────────────────────────────────────────────────── */}
      {tab === 'settle' && (
        <div className="sw-settle-list">
          {transactions.length === 0 ? (
            <p className="note">🎉 All settled up! No pending payments in this group.</p>
          ) : (
            transactions.map((t) => {
              const key = `${t.from}|${t.to}|${t.amount}`
              const done = settled.includes(key)
              return (
                <div key={key} className={`sw-settle-row ${done ? 'done' : ''}`}>
                  <div className="sw-settle-info">
                    <span className="sw-settle-from">{t.from}</span>
                    <span className="sw-settle-arrow">→</span>
                    <span className="sw-settle-to">{t.to}</span>
                    <span className="sw-settle-amt">{formatCurrencyINR(t.amount)}</span>
                  </div>
                  <button
                    className={done ? 'sw-btn-ghost' : 'sw-btn-primary'}
                    onClick={() => toggleSettled(key)}
                  >
                    {done ? '↩ Undo' : '✓ Settled'}
                  </button>
                </div>
              )
            })
          )}
          {transactions.length > 0 && (
            <p className="sw-settle-hint">
              {transactions.length} transaction{transactions.length > 1 ? 's' : ''} to clear all debts — minimum possible.
            </p>
          )}
        </div>
      )}
    </section>
  )
}

// ── root export ───────────────────────────────────────────────────────────────
export default function SplitWise() {
  const [groups, setGroups] = useState([
    {
      id: genId(),
      name: 'Goa Trip 🏖️',
      members: ['Alice', 'Bob', 'Charlie', 'Diana'],
      expenses: [
        { id: genId(), title: 'Hotel (2 nights)', amount: 12000, paidBy: 'Alice', splitType: 'equal', splits: { Alice: 3000, Bob: 3000, Charlie: 3000, Diana: 3000 }, category: 'rent',          date: '2026-04-10', notes: '' },
        { id: genId(), title: 'Beach Dinner',      amount: 3200,  paidBy: 'Bob',   splitType: 'equal', splits: { Alice: 800,  Bob: 800,  Charlie: 800,  Diana: 800  }, category: 'food',          date: '2026-04-11', notes: 'Seafood place' },
        { id: genId(), title: 'Cab from airport',  amount: 1800,  paidBy: 'Charlie', splitType: 'equal', splits: { Alice: 450, Bob: 450,  Charlie: 450,  Diana: 450  }, category: 'transport',     date: '2026-04-10', notes: '' },
      ],
    },
  ])

  const [activeGroupId, setActiveGroupId] = useState(null)
  const activeGroup = groups.find((g) => g.id === activeGroupId) ?? null

  const handleCreateGroup    = (g) => setGroups((prev) => [...prev, g])
  const handleAddExpense     = (gid, exp) => setGroups((prev) => prev.map((g) => g.id === gid ? { ...g, expenses: [...g.expenses, exp] } : g))
  const handleDeleteExpense  = (gid, eid) => setGroups((prev) => prev.map((g) => g.id === gid ? { ...g, expenses: g.expenses.filter((e) => e.id !== eid) } : g))
  const handleUpdateGroup    = (updated) => setGroups((prev) => prev.map((g) => g.id === updated.id ? updated : g))

  if (activeGroup) {
    return (
      <GroupDetail
        group={activeGroup}
        onBack={() => setActiveGroupId(null)}
        onAddExpense={handleAddExpense}
        onDeleteExpense={handleDeleteExpense}
        onUpdateGroup={handleUpdateGroup}
      />
    )
  }

  return (
    <GroupList
      groups={groups}
      onCreate={handleCreateGroup}
      onOpen={setActiveGroupId}
    />
  )
}
