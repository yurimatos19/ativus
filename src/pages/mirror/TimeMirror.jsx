import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Printer, Download } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import { EMPLOYEES, TIME_RECORDS } from '../../data/mock'
import styles from './TimeMirror.module.css'

export default function TimeMirror() {
  const [params] = useSearchParams()
  const [empId,  setEmpId]  = useState(params.get('emp') || '1')
  const [month,  setMonth]  = useState('2026-04')

  const emp = EMPLOYEES.find(e => e.id === Number(empId))
  const records = TIME_RECORDS
    .filter(r => r.employeeId === Number(empId) && r.date.startsWith(month))
    .sort((a, b) => a.date.localeCompare(b.date))

  const EMP_OPTIONS = EMPLOYEES.map(e => ({ value: String(e.id), label: e.name }))

  // Totals
  const worked  = records.filter(r => r.total !== '—').reduce((acc, r) => {
    const [h, m] = r.total.replace('h', ':').split(':').map(Number)
    return acc + h * 60 + (m || 0)
  }, 0)
  const absences = records.filter(r => r.status === 'absent').length
  const lates    = records.filter(r => r.status === 'late').length
  const extras   = records.filter(r => r.status === 'overtime').length
  const fmtMin   = m => `${Math.floor(m / 60)}h${String(m % 60).padStart(2, '0')}`

  const statusInfo = {
    normal:   { label: 'Normal',   variant: 'success' },
    late:     { label: 'Atraso',   variant: 'warning' },
    overtime: { label: 'H. Extra', variant: 'info' },
    absent:   { label: 'Falta',    variant: 'error' },
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Espelho de Ponto</h1>
          <p className={styles.sub}>Documento oficial de jornada — CLT Art. 74</p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="ghost" size="sm" icon={<Printer size={14} />} onClick={() => window.print()} className="no-print">
            Imprimir
          </Button>
          <Button variant="secondary" size="sm" icon={<Download size={14} />} className="no-print">
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Selectors */}
      <Card className={`${styles.selectors} no-print`}>
        <Select
          label="Funcionário"
          value={empId}
          onChange={e => setEmpId(e.target.value)}
          options={EMP_OPTIONS}
        />
        <Select
          label="Mês/Ano"
          value={month}
          onChange={e => setMonth(e.target.value)}
          options={[
            { value: '2026-04', label: 'Abril 2026' },
            { value: '2026-03', label: 'Março 2026' },
            { value: '2026-02', label: 'Fevereiro 2026' },
          ]}
        />
      </Card>

      {/* Mirror document */}
      <Card className={styles.doc}>
        {/* Document header */}
        <div className={styles.docHeader}>
          <div className={styles.docLogo}>
            <div className={styles.docLogoIcon}>
              <img src="/assets/logo.png" alt="Ativus" className={styles.docLogoImg} />
            </div>
            <span className={styles.docLogoText}>Ativus</span>
          </div>
          <div className={styles.docTitle}>
            <strong>ESPELHO DE PONTO</strong>
            <div className={styles.docSubtitle}>Controle de Frequência — CLT Art. 74, §2º</div>
          </div>
        </div>

        <div className={styles.empHeader}>
          <div className={styles.empMeta}>
            <span><strong>Funcionário:</strong> {emp?.name || '—'}</span>
            <span><strong>Cargo:</strong> {emp?.role || '—'}</span>
            <span><strong>CPF:</strong> {emp?.cpf || '—'}</span>
          </div>
          <div className={styles.empMeta}>
            <span><strong>Departamento:</strong> {emp?.dept || '—'}</span>
            <span><strong>Jornada:</strong> {emp?.schedule || '—'}</span>
            <span><strong>Período:</strong> {month.replace('-', '/')}</span>
          </div>
        </div>

        {/* Table */}
        <table className={styles.mirrorTable}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Dia</th>
              <th>Entrada</th>
              <th>Int. Início</th>
              <th>Int. Fim</th>
              <th>Saída</th>
              <th>Total</th>
              <th>Saldo</th>
              <th>Ocorrência</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => {
              const dateObj = new Date(r.date + 'T00:00:00')
              const day = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
              const weekday = dateObj.toLocaleDateString('pt-BR', { weekday: 'short' })
              const si = statusInfo[r.status] || { label: '—', variant: 'neutral' }
              return (
                <tr key={r.id} className={r.status === 'absent' ? styles.absentRow : ''}>
                  <td className={styles.mono}>{day}</td>
                  <td className={styles.weekday}>{weekday.replace('.', '')}</td>
                  <td className={styles.mono}>{r.entry || '—'}</td>
                  <td className={styles.mono}>{r.breakStart || '—'}</td>
                  <td className={styles.mono}>{r.breakEnd   || '—'}</td>
                  <td className={styles.mono}>{r.exit || '—'}</td>
                  <td className={styles.mono}>{r.total}</td>
                  <td className={styles.mono} style={{ color: r.balance?.startsWith('+') ? '#15803D' : '#991B1B' }}>{r.balance || '—'}</td>
                  <td><Badge variant={si.variant}>{si.label}</Badge></td>
                </tr>
              )
            })}
            {records.length === 0 && (
              <tr><td colSpan={9} className={styles.empty}>Nenhum registro para este período.</td></tr>
            )}
          </tbody>
        </table>

        {/* Totals */}
        <div className={styles.totals}>
          <div className={styles.totalItem}><span>Horas Trabalhadas</span><strong>{fmtMin(worked)}</strong></div>
          <div className={styles.totalItem}><span>Faltas</span><strong style={{ color: '#991B1B' }}>{absences} dia{absences !== 1 ? 's' : ''}</strong></div>
          <div className={styles.totalItem}><span>Atrasos</span><strong style={{ color: '#92400E' }}>{lates}</strong></div>
          <div className={styles.totalItem}><span>H. Extras</span><strong style={{ color: '#1D4ED8' }}>{extras}</strong></div>
          <div className={styles.totalItem}><span>Banco de Horas</span><strong style={{ color: '#15803D' }}>+{fmtMin(Math.max(0, worked - records.filter(r => r.total !== '—').length * 480))}</strong></div>
        </div>

        {/* Signature */}
        <div className={styles.signature}>
          <div className={styles.sigLine}>
            <div className={styles.sigBlock}><div className={styles.sigUnderline}/><span>Assinatura do Funcionário</span></div>
            <div className={styles.sigBlock}><div className={styles.sigUnderline}/><span>Assinatura do Gestor</span></div>
            <div className={styles.sigBlock}><div className={styles.sigUnderline}/><span>Data e Carimbo</span></div>
          </div>
          <p className={styles.sigNote}>Documento gerado eletronicamente pelo sistema Ativus · {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </Card>
    </div>
  )
}
