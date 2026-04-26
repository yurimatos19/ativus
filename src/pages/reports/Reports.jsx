import { useState } from 'react'
import { Clock, Wallet, UserX, TrendingUp, Download, ChevronRight } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import Input from '../../components/ui/Input'
import { useToast } from '../../components/ui/ToastContainer'
import { EMPLOYEES, DEPARTMENTS } from '../../data/mock'
import styles from './Reports.module.css'

const REPORT_TYPES = [
  { id: 'overtime',    title: 'Horas Extras',     icon: Clock,       color: '#1565C0', bg: '#DBEAFE', desc: 'Total de horas extras por funcionário.' },
  { id: 'bank',        title: 'Banco de Horas',   icon: Wallet,      color: '#39B54A', bg: '#DCFCE7', desc: 'Saldo acumulado no banco de horas.' },
  { id: 'absences',    title: 'Faltas e Atrasos',  icon: UserX,       color: '#EF4444', bg: '#FEE2E2', desc: 'Registros de faltas e atrasos com justificativas.' },
  { id: 'productivity',title: 'Produtividade',    icon: TrendingUp,  color: '#F59E0B', bg: '#FEF3C7', desc: 'Horas trabalhadas vs. esperadas por equipe.' },
]

const MOCK_DATA = {
  overtime:     EMPLOYEES.slice(0,8).map(e => ({ name: e.name.split(' ')[0], value: Math.floor(Math.random()*20+2) })),
  bank:         EMPLOYEES.slice(0,8).map(e => ({ name: e.name.split(' ')[0], value: Math.floor(Math.random()*30-10) })),
  absences:     EMPLOYEES.slice(0,8).map(e => ({ name: e.name.split(' ')[0], value: Math.floor(Math.random()*5) })),
  productivity: DEPARTMENTS.slice(0,6).map(d => ({ name: d, value: Math.floor(Math.random()*15+80) })),
}

const DEPT_OPTIONS = [{ value: '', label: 'Todos' }, ...DEPARTMENTS.map(d => ({ value: d, label: d }))]
const EMP_OPTIONS  = [{ value: '', label: 'Todos' }, ...EMPLOYEES.map(e => ({ value: String(e.id), label: e.name }))]

export default function Reports() {
  const toast = useToast()
  const [selected, setSelected] = useState(null)
  const [dept,     setDept]     = useState('')
  const [empId,    setEmpId]    = useState('')
  const [dateFrom, setDateFrom] = useState('2026-04-01')
  const [dateTo,   setDateTo]   = useState('2026-04-30')

  const chartData = selected ? MOCK_DATA[selected.id] : []

  const handleGenerate = () => {
    const csvHeader = 'Nome,Valor\n'
    const csvBody   = chartData.map(r => `${r.name},${r.value}`).join('\n')
    const blob = new Blob([csvHeader + csvBody], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selected.id}-${dateFrom}-${dateTo}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast('Relatório exportado com sucesso!', 'success')
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Relatórios</h1>
          <p className={styles.sub}>Gere e exporte análises de jornada e produtividade</p>
        </div>
      </div>

      <div className={styles.content}>
        {/* Type list */}
        <div className={styles.typeList}>
          {REPORT_TYPES.map(rt => {
            const Icon = rt.icon
            return (
              <Card
                key={rt.id}
                className={[styles.typeCard, selected?.id === rt.id ? styles.typeSelected : ''].join(' ')}
                onClick={() => setSelected(rt)}
              >
                <div className={styles.typeIcon} style={{ background: rt.bg }}>
                  <Icon size={20} color={rt.color} />
                </div>
                <div className={styles.typeInfo}>
                  <div className={styles.typeTitle}>{rt.title}</div>
                  <div className={styles.typeDesc}>{rt.desc}</div>
                </div>
                <ChevronRight size={16} className={styles.typeChev} />
              </Card>
            )
          })}
        </div>

        {/* Panel */}
        <div className={styles.panel}>
          {!selected ? (
            <div className={styles.emptyPanel}>
              <TrendingUp size={40} color="var(--fg-tertiary)" />
              <p>Selecione um tipo de relatório para continuar</p>
            </div>
          ) : (
            <>
              <Card className={styles.filtersPanel}>
                <div className={styles.panelTitle}>{selected.title} — Filtros</div>
                <div className={styles.filterGrid}>
                  <Input label="De" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                  <Input label="Até" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
                  <Select label="Departamento" value={dept} onChange={e => setDept(e.target.value)} options={DEPT_OPTIONS} />
                  <Select label="Funcionário" value={empId} onChange={e => setEmpId(e.target.value)} options={EMP_OPTIONS} />
                </div>
                <div className={styles.panelActions}>
                  <Button variant="secondary" onClick={() => {}}>Visualizar</Button>
                  <Button variant="primary" icon={<Download size={14} />} onClick={handleGenerate}>
                    Exportar CSV
                  </Button>
                </div>
              </Card>

              <Card>
                <div className={styles.chartTitle}>{selected.title}</div>
                <div className={styles.chartSub}>{dateFrom} → {dateTo}</div>
                <div style={{ marginTop: 16 }}>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={chartData} barSize={22}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }} />
                      <Bar dataKey="value" name={selected.title} fill={selected.color} radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
