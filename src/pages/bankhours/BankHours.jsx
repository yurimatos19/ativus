import { useState } from 'react'
import { TrendingUp, TrendingDown, Plus, Minus, Download, Filter } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Avatar from '../../components/ui/Avatar'
import { useToast } from '../../components/ui/ToastContainer'
import styles from './BankHours.module.css'

const EMPLOYEES = [
  { id: 1, name: 'Carlos Alberto Souza',  role: 'Operador',    balance: 18.5,  accumulated: 32.0, compensated: 13.5 },
  { id: 2, name: 'Mariana Costa',         role: 'Analista RH', balance: -4.0,  accumulated: 8.0,  compensated: 12.0 },
  { id: 3, name: 'Roberto Lima',          role: 'Supervisor',  balance: 42.5,  accumulated: 50.0, compensated: 7.5  },
  { id: 4, name: 'Ana Paula Ferreira',    role: 'Auxiliar',    balance: 6.25,  accumulated: 10.0, compensated: 3.75 },
  { id: 5, name: 'João Pedro Alves',      role: 'Técnico',     balance: 0,     accumulated: 0,    compensated: 0    },
  { id: 6, name: 'Fernanda Rocha',        role: 'Coordenador', balance: -12.0, accumulated: 4.0,  compensated: 16.0 },
  { id: 7, name: 'Lucas Mendes',          role: 'Operador',    balance: 28.0,  accumulated: 28.0, compensated: 0    },
  { id: 8, name: 'Camila Santos',         role: 'Assistente',  balance: 3.5,   accumulated: 15.0, compensated: 11.5 },
]

const HISTORY = [
  { id: 1, employee: 'Carlos Alberto Souza', type: 'credit', hours: 2.5, date: '2026-04-22', reason: 'Hora extra aprovada', approver: 'Mariana Costa' },
  { id: 2, employee: 'Mariana Costa',        type: 'debit',  hours: 4.0, date: '2026-04-20', reason: 'Compensação solicitada', approver: 'Admin' },
  { id: 3, employee: 'Roberto Lima',         type: 'credit', hours: 8.0, date: '2026-04-19', reason: 'Hora extra fim de semana', approver: 'Admin' },
  { id: 4, employee: 'Fernanda Rocha',       type: 'debit',  hours: 4.0, date: '2026-04-18', reason: 'Falta não justificada', approver: 'Sistema' },
  { id: 5, employee: 'Lucas Mendes',         type: 'credit', hours: 6.0, date: '2026-04-17', reason: 'Hora extra aprovada', approver: 'Mariana Costa' },
]

function fmtH(h) {
  const abs = Math.abs(h)
  const hh = Math.floor(abs)
  const mm = Math.round((abs - hh) * 60).toString().padStart(2, '0')
  return `${h < 0 ? '-' : ''}${hh}h${mm}`
}

export default function BankHours() {
  const toast = useToast()
  const [employees, setEmployees] = useState(EMPLOYEES)
  const [filter, setFilter] = useState('all')
  const [modal, setModal] = useState(false)
  const [selEmp, setSelEmp] = useState(null)
  const [adjForm, setAdjForm] = useState({ type: 'credit', hours: '', reason: '' })

  const filtered = employees.filter(e => {
    if (filter === 'positive') return e.balance > 0
    if (filter === 'negative') return e.balance < 0
    if (filter === 'zero') return e.balance === 0
    return true
  })

  const totalPos = employees.filter(e => e.balance > 0).reduce((s, e) => s + e.balance, 0)
  const totalNeg = employees.filter(e => e.balance < 0).reduce((s, e) => s + e.balance, 0)

  const openAdj = (emp) => {
    setSelEmp(emp)
    setAdjForm({ type: 'credit', hours: '', reason: '' })
    setModal(true)
  }

  const saveAdj = () => {
    if (!adjForm.hours || !adjForm.reason) return
    const delta = adjForm.type === 'credit' ? +adjForm.hours : -adjForm.hours
    setEmployees(prev => prev.map(e => e.id === selEmp.id
      ? { ...e, balance: +(e.balance + delta).toFixed(2), accumulated: adjForm.type === 'credit' ? +(e.accumulated + +adjForm.hours).toFixed(2) : e.accumulated, compensated: adjForm.type === 'debit' ? +(e.compensated + +adjForm.hours).toFixed(2) : e.compensated }
      : e
    ))
    toast(`Ajuste lançado para ${selEmp.name}`, 'success')
    setModal(false)
  }

  const exportCSV = () => {
    const rows = ['Funcionário,Saldo,Acumulado,Compensado']
    employees.forEach(e => rows.push(`"${e.name}",${fmtH(e.balance)},${fmtH(e.accumulated)},${fmtH(e.compensated)}`))
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'banco_horas.csv'; a.click()
    toast('Relatório exportado!', 'success')
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Banco de Horas</h1>
          <p className={styles.sub}>Controle o saldo de horas extras e compensações de cada funcionário</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="outline" icon={<Download size={14} />} onClick={exportCSV}>Exportar</Button>
        </div>
      </div>

      {/* KPI strip */}
      <div className={styles.kpiBar}>
        <Card className={styles.kpiCard}>
          <TrendingUp size={18} color="#39B54A" />
          <div>
            <div className={styles.kpiVal} style={{ color: '#39B54A' }}>{fmtH(totalPos)}</div>
            <div className={styles.kpiLabel}>Total créditos ativos</div>
          </div>
        </Card>
        <Card className={styles.kpiCard}>
          <TrendingDown size={18} color="#EF4444" />
          <div>
            <div className={styles.kpiVal} style={{ color: '#EF4444' }}>{fmtH(totalNeg)}</div>
            <div className={styles.kpiLabel}>Total débitos pendentes</div>
          </div>
        </Card>
        <Card className={styles.kpiCard}>
          <Plus size={18} color="#1565C0" />
          <div>
            <div className={styles.kpiVal}>{employees.filter(e => e.balance > 0).length}</div>
            <div className={styles.kpiLabel}>Funcionários com saldo +</div>
          </div>
        </Card>
        <Card className={styles.kpiCard}>
          <Minus size={18} color="#E65100" />
          <div>
            <div className={styles.kpiVal}>{employees.filter(e => e.balance < 0).length}</div>
            <div className={styles.kpiLabel}>Funcionários com saldo −</div>
          </div>
        </Card>
      </div>

      {/* Filter */}
      <div className={styles.filterRow}>
        {[
          { val: 'all', label: `Todos (${employees.length})` },
          { val: 'positive', label: `Saldo positivo (${employees.filter(e => e.balance > 0).length})` },
          { val: 'negative', label: `Saldo negativo (${employees.filter(e => e.balance < 0).length})` },
          { val: 'zero', label: `Zerado (${employees.filter(e => e.balance === 0).length})` },
        ].map(opt => (
          <button
            key={opt.val}
            className={[styles.filterBtn, filter === opt.val ? styles.filterActive : ''].join(' ')}
            onClick={() => setFilter(opt.val)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Funcionário</th>
              <th className={styles.numCol}>Acumulado</th>
              <th className={styles.numCol}>Compensado</th>
              <th className={styles.numCol}>Saldo atual</th>
              <th className={styles.numCol}>Status</th>
              <th className={styles.actCol}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(emp => (
              <tr key={emp.id}>
                <td>
                  <div className={styles.empCell}>
                    <Avatar name={emp.name} size="xs" />
                    <div>
                      <div className={styles.empName}>{emp.name}</div>
                      <div className={styles.empRole}>{emp.role}</div>
                    </div>
                  </div>
                </td>
                <td className={styles.numCol}>
                  <span className={styles.mono}>{fmtH(emp.accumulated)}</span>
                </td>
                <td className={styles.numCol}>
                  <span className={styles.mono}>{fmtH(emp.compensated)}</span>
                </td>
                <td className={styles.numCol}>
                  <span className={[styles.mono, styles.balance, emp.balance > 0 ? styles.pos : emp.balance < 0 ? styles.neg : ''].join(' ')}>
                    {fmtH(emp.balance)}
                  </span>
                </td>
                <td className={styles.numCol}>
                  {emp.balance > 40
                    ? <Badge variant="warning">Crítico</Badge>
                    : emp.balance < -10
                    ? <Badge variant="error">Negativo alto</Badge>
                    : emp.balance < 0
                    ? <Badge variant="neutral">Negativo</Badge>
                    : emp.balance === 0
                    ? <Badge variant="neutral">Zerado</Badge>
                    : <Badge variant="success">OK</Badge>
                  }
                </td>
                <td className={styles.actCol}>
                  <button className={styles.adjBtn} onClick={() => openAdj(emp)}>Ajuste</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Recent history */}
      <div>
        <div className={styles.histTitle}>Lançamentos Recentes</div>
        <Card>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Funcionário</th>
                <th>Tipo</th>
                <th className={styles.numCol}>Horas</th>
                <th>Data</th>
                <th>Motivo</th>
                <th>Aprovador</th>
              </tr>
            </thead>
            <tbody>
              {HISTORY.map(h => (
                <tr key={h.id}>
                  <td className={styles.empName}>{h.employee}</td>
                  <td>
                    <Badge variant={h.type === 'credit' ? 'success' : 'error'}>
                      {h.type === 'credit' ? 'Crédito' : 'Débito'}
                    </Badge>
                  </td>
                  <td className={styles.numCol}>
                    <span className={[styles.mono, h.type === 'credit' ? styles.pos : styles.neg].join(' ')}>
                      {h.type === 'credit' ? '+' : '-'}{fmtH(h.hours)}
                    </span>
                  </td>
                  <td className={styles.mono}>{h.date}</td>
                  <td className={styles.empRole}>{h.reason}</td>
                  <td className={styles.empRole}>{h.approver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={`Ajuste de Banco de Horas — ${selEmp?.name}`}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(false)}>Cancelar</Button>
            <Button variant="primary" onClick={saveAdj}>Lançar Ajuste</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Select
            label="Tipo de lançamento"
            value={adjForm.type}
            onChange={e => setAdjForm(p => ({ ...p, type: e.target.value }))}
            options={[
              { value: 'credit', label: 'Crédito (+) — horas extras' },
              { value: 'debit',  label: 'Débito (−) — compensação / falta' },
            ]}
          />
          <Input
            label="Quantidade de horas"
            type="number"
            step="0.25"
            min="0.25"
            value={adjForm.hours}
            onChange={e => setAdjForm(p => ({ ...p, hours: e.target.value }))}
            placeholder="Ex: 2.5"
          />
          <Input
            label="Motivo"
            value={adjForm.reason}
            onChange={e => setAdjForm(p => ({ ...p, reason: e.target.value }))}
            placeholder="Descreva o motivo do ajuste"
            required
          />
        </div>
      </Modal>
    </div>
  )
}
