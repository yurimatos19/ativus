import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Users, Clock, AlertTriangle, UserX, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import { EMPLOYEES, KPI_DATA, ATTENDANCE_WEEK, HOURS_MONTH, ADJUSTMENTS, STATUS_LABELS } from '../../data/mock'
import styles from './Dashboard.module.css'

const KPI_CARDS = [
  { key: 'online',    label: 'Online Agora',         value: `${KPI_DATA.onlineNow}/${KPI_DATA.totalEmployees}`, icon: Users,         color: '#39B54A', bg: '#DCFCE7', sub: 'funcionários trabalhando' },
  { key: 'overtime',  label: 'Horas Extras no Mês',  value: `${KPI_DATA.overtimeHoursMonth}h`,                 icon: TrendingUp,    color: '#1565C0', bg: '#DBEAFE', sub: 'banco de horas acumulado' },
  { key: 'lates',     label: 'Atrasos Hoje',          value: KPI_DATA.latesToday,                               icon: AlertTriangle, color: '#F59E0B', bg: '#FEF3C7', sub: 'aguardando justificativa' },
  { key: 'absences',  label: 'Faltas Hoje',           value: KPI_DATA.absencesToday,                            icon: UserX,         color: '#EF4444', bg: '#FEE2E2', sub: 'sem justificativa' },
]

const onlineEmployees = EMPLOYEES.filter(e => e.status === 'online' || e.status === 'overtime').slice(0, 6)
const pendingAdj = ADJUSTMENTS.filter(a => a.status === 'pending').slice(0, 4)

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Painel de Controle</h1>
          <p className={styles.sub}>Visão geral em tempo real · Quinta, 24 de abril de 2026</p>
        </div>
        <Button variant="primary" icon={<Clock size={15} />} onClick={() => navigate('/registros')}>
          Ver Registros
        </Button>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        {KPI_CARDS.map(({ key, label, value, icon: Icon, color, bg, sub }) => (
          <Card key={key} className={styles.kpiCard}>
            <div className={styles.kpiTop}>
              <div className={styles.kpiIconWrap} style={{ background: bg }}>
                <Icon size={20} color={color} />
              </div>
              <span className={styles.kpiValue} style={{ color }}>{value}</span>
            </div>
            <div className={styles.kpiLabel}>{label}</div>
            <div className={styles.kpiSub}>{sub}</div>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className={styles.chartsRow}>
        <Card className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <div className={styles.chartTitle}>Presença Diária</div>
              <div className={styles.chartSub}>Últimos 5 dias úteis</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ATTENDANCE_WEEK} barSize={20} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} width={24} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="present" name="Presentes" fill="#39B54A" radius={[4,4,0,0]} />
              <Bar dataKey="absent"  name="Ausentes"  fill="#FEE2E2" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <div className={styles.chartTitle}>Horas Trabalhadas</div>
              <div className={styles.chartSub}>vs. Meta semanal (44h)</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={HOURS_MONTH}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} width={30} domain={[38, 50]} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Line dataKey="worked" name="Trabalhadas" stroke="#1565C0" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line dataKey="target" name="Meta"        stroke="#39B54A" strokeWidth={1.5} strokeDasharray="5 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom row */}
      <div className={styles.bottomRow}>
        {/* Online employees */}
        <Card className={styles.onlineCard} padding="none">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <span className={styles.greenDot} />
              Funcionários Online
            </div>
            <button className={styles.seeAll} onClick={() => navigate('/funcionarios')}>
              Ver todos <ArrowRight size={13} />
            </button>
          </div>
          <div className={styles.empList}>
            {onlineEmployees.map(emp => {
              const s = STATUS_LABELS[emp.status]
              return (
                <div key={emp.id} className={styles.empRow}>
                  <Avatar name={emp.name} size="sm" />
                  <div className={styles.empInfo}>
                    <div className={styles.empName}>{emp.name}</div>
                    <div className={styles.empRole}>{emp.role} · {emp.city}</div>
                  </div>
                  <Badge variant={s.variant}>{s.label}</Badge>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Pending adjustments */}
        <Card className={styles.pendingCard} padding="none">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              Pendências de Aprovação
              <Badge variant="warning">{pendingAdj.length}</Badge>
            </div>
            <button className={styles.seeAll} onClick={() => navigate('/ajustes')}>
              Ver todas <ArrowRight size={13} />
            </button>
          </div>
          <div className={styles.adjList}>
            {pendingAdj.map(adj => {
              const emp = EMPLOYEES.find(e => e.id === adj.employeeId)
              return (
                <div key={adj.id} className={styles.adjRow}>
                  <Avatar name={emp?.name || ''} size="sm" />
                  <div className={styles.adjInfo}>
                    <div className={styles.adjName}>{emp?.name}</div>
                    <div className={styles.adjMeta}>{adj.type} · {adj.date}</div>
                    <div className={styles.adjReason}>{adj.reason}</div>
                  </div>
                  <div className={styles.adjActions}>
                    <button className={styles.approveBtn}><CheckCircle size={16} /></button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
