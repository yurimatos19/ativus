import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, MapPin, Calendar, Briefcase, Clock } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import { EMPLOYEES, TIME_RECORDS, STATUS_LABELS } from '../../data/mock'
import styles from './EmployeeDetail.module.css'

export default function EmployeeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const emp = EMPLOYEES.find(e => e.id === Number(id))

  if (!emp) return (
    <div className={styles.notFound}>
      <p>Funcionário não encontrado.</p>
      <Button variant="ghost" onClick={() => navigate('/funcionarios')}>Voltar</Button>
    </div>
  )

  const records = TIME_RECORDS.filter(r => r.employeeId === emp.id).slice(-10).reverse()
  const s = STATUS_LABELS[emp.status]

  const infoItems = [
    { icon: Mail,      label: 'E-mail',    value: emp.email },
    { icon: MapPin,    label: 'Cidade',    value: emp.city },
    { icon: Calendar,  label: 'Admissão',  value: new Date(emp.admission + 'T00:00:00').toLocaleDateString('pt-BR') },
    { icon: Briefcase, label: 'Jornada',   value: emp.schedule },
    { icon: Clock,     label: 'Carga',     value: emp.workload },
  ]

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate('/funcionarios')}>
        <ArrowLeft size={16} /> Funcionários
      </button>

      <div className={styles.top}>
        {/* Profile card */}
        <Card className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <Avatar name={emp.name} size="xl" />
            <div>
              <h1 className={styles.name}>{emp.name}</h1>
              <p className={styles.role}>{emp.role}</p>
              <Badge variant={s.variant} dot>{s.label}</Badge>
            </div>
          </div>
          <div className={styles.infos}>
            {infoItems.map(({ icon: Icon, label, value }) => (
              <div key={label} className={styles.infoRow}>
                <Icon size={14} className={styles.infoIcon} />
                <span className={styles.infoLabel}>{label}</span>
                <span className={styles.infoValue}>{value}</span>
              </div>
            ))}
          </div>
          <div className={styles.deptChip}>
            <Badge variant="blue">{emp.dept}</Badge>
            <span className={styles.cpf}>CPF: {emp.cpf}</span>
          </div>
        </Card>

        {/* Stats */}
        <div className={styles.statsCol}>
          <Card className={styles.statCard}>
            <div className={styles.statLabel}>Horas este mês</div>
            <div className={styles.statVal}>176h</div>
            <Badge variant="success">+4h saldo</Badge>
          </Card>
          <Card className={styles.statCard}>
            <div className={styles.statLabel}>Faltas no mês</div>
            <div className={styles.statVal} style={{ color: '#EF4444' }}>1</div>
            <Badge variant="warning">Justificada</Badge>
          </Card>
          <Card className={styles.statCard}>
            <div className={styles.statLabel}>Pontualidade</div>
            <div className={styles.statVal} style={{ color: '#39B54A' }}>91%</div>
            <Badge variant="success">Excelente</Badge>
          </Card>
        </div>
      </div>

      {/* Records table */}
      <Card padding="none">
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>Últimos Registros de Ponto</span>
          <Button variant="ghost" size="sm" onClick={() => navigate(`/espelho?emp=${emp.id}`)}>
            Ver Espelho Completo
          </Button>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Data</th><th>Entrada</th><th>Intervalo</th><th>Saída</th><th>Total</th><th>Saldo</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => {
              const dateObj = new Date(r.date + 'T00:00:00')
              const dateLabel = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', weekday: 'short' })
              const badgeVariant = r.status === 'normal' ? 'success' : r.status === 'late' ? 'warning' : r.status === 'overtime' ? 'info' : 'error'
              const badgeLabel  = r.status === 'normal' ? 'Normal' : r.status === 'late' ? 'Atraso' : r.status === 'overtime' ? 'H. Extra' : 'Falta'
              return (
                <tr key={r.id}>
                  <td className={styles.mono}>{dateLabel}</td>
                  <td className={styles.mono}>{r.entry || '—'}</td>
                  <td className={styles.mono}>{r.breakStart && r.breakEnd ? `${r.breakStart}–${r.breakEnd}` : '—'}</td>
                  <td className={styles.mono}>{r.exit || '—'}</td>
                  <td className={styles.mono}>{r.total}</td>
                  <td className={styles.mono} style={{ color: r.balance?.startsWith('+') ? '#15803D' : '#991B1B' }}>{r.balance || '—'}</td>
                  <td><Badge variant={badgeVariant}>{badgeLabel}</Badge></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
