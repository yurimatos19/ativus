import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Plus, X, Users, Coffee, AlertTriangle, Umbrella, CalendarDays } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Avatar from '../../components/ui/Avatar'
import { useToast } from '../../components/ui/ToastContainer'
import styles from './Agenda.module.css'

// ── Event types ──────────────────────────────────────────────────
const EVENT_TYPES = {
  meeting:   { label: 'Reunião',        color: '#1565C0', bg: '#EFF6FF', icon: Users,        variant: 'blue'    },
  dayoff:    { label: 'Folga',          color: '#16A34A', bg: '#F0FDF4', icon: Coffee,       variant: 'success' },
  absence:   { label: 'Falta/Atestado', color: '#EF4444', bg: '#FEF2F2', icon: AlertTriangle,variant: 'error'   },
  vacation:  { label: 'Férias',         color: '#7B1FA2', bg: '#FAF5FF', icon: Umbrella,     variant: 'neutral' },
  training:  { label: 'Treinamento',    color: '#EA580C', bg: '#FFF7ED', icon: CalendarDays, variant: 'warning' },
}

// ── Mock events ──────────────────────────────────────────────────
const TODAY = new Date()
const Y = TODAY.getFullYear()
const M = TODAY.getMonth()

function d(day, extra = {}) {
  return { date: new Date(Y, M, day), ...extra }
}

const INITIAL_EVENTS = [
  { id: 1,  ...d(2),  type: 'meeting',  title: 'Reunião semanal de RH',          employees: ['Mariana Costa', 'Roberto Lima'], time: '09:00', dept: 'RH' },
  { id: 2,  ...d(3),  type: 'dayoff',   title: 'Folga — Ana Paula Ferreira',      employees: ['Ana Paula Ferreira'],            time: null,    dept: 'Operações' },
  { id: 3,  ...d(5),  type: 'training', title: 'Treinamento de Segurança NR-10',  employees: ['Carlos Alberto Souza', 'Lucas Mendes', 'João Pedro Alves'], time: '14:00', dept: 'Produção' },
  { id: 4,  ...d(8),  type: 'meeting',  title: 'Revisão de metas Q2',             employees: ['Mariana Costa', 'Fernanda Rocha'], time: '10:00', dept: 'Gestão' },
  { id: 5,  ...d(10), type: 'absence',  title: 'Atestado — Camila Santos',        employees: ['Camila Santos'],                 time: null,    dept: 'Administrativo' },
  { id: 6,  ...d(12), type: 'vacation', title: 'Férias — Roberto Lima (início)',  employees: ['Roberto Lima'],                  time: null,    dept: 'Supervisão' },
  { id: 7,  ...d(15), type: 'meeting',  title: '1:1 Gestores',                    employees: ['Fernanda Rocha', 'Mariana Costa'], time: '11:00', dept: 'Gestão' },
  { id: 8,  ...d(16), type: 'training', title: 'Integração novos colaboradores',  employees: ['Mariana Costa'],                 time: '08:00', dept: 'RH' },
  { id: 9,  ...d(TODAY.getDate()), type: 'meeting', title: 'Stand-up diário',     employees: ['Mariana Costa', 'Roberto Lima', 'Ana Paula Ferreira'], time: '08:30', dept: 'Todos' },
  { id: 10, ...d(TODAY.getDate()), type: 'dayoff',  title: 'Folga — Lucas Mendes',employees: ['Lucas Mendes'],                  time: null,    dept: 'Produção' },
  { id: 11, ...d(TODAY.getDate() + 1), type: 'meeting', title: 'Feedback trimestral', employees: ['Fernanda Rocha'],           time: '15:00', dept: 'Gestão' },
  { id: 12, ...d(TODAY.getDate() + 3), type: 'absence', title: 'Falta — João Pedro Alves', employees: ['João Pedro Alves'],   time: null,    dept: 'Técnico' },
  { id: 13, ...d(TODAY.getDate() + 5), type: 'training', title: 'Workshop Produtividade', employees: ['Mariana Costa', 'Camila Santos', 'Ana Paula Ferreira'], time: '13:00', dept: 'RH' },
  { id: 14, ...d(TODAY.getDate() + 7), type: 'vacation', title: 'Férias — Carlos Alberto (início)', employees: ['Carlos Alberto Souza'], time: null, dept: 'Operações' },
]

const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS_PT = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

const emptyForm = { title: '', type: 'meeting', time: '', dept: 'Todos', employees: '' }

export default function Agenda() {
  const toast = useToast()
  const [year, setYear]           = useState(TODAY.getFullYear())
  const [month, setMonth]         = useState(TODAY.getMonth())
  const [events, setEvents]       = useState(INITIAL_EVENTS)
  const [selectedDay, setSelectedDay] = useState(null)
  const [filterType, setFilterType]   = useState('all')
  const [newModal, setNewModal]   = useState(false)
  const [form, setForm]           = useState(emptyForm)

  // navigation
  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  // calendar grid
  const { cells, totalWeeks } = useMemo(() => {
    const first = new Date(year, month, 1)
    const last  = new Date(year, month + 1, 0)
    const startPad = first.getDay()
    const cells = []
    for (let i = 0; i < startPad; i++) {
      const d = new Date(year, month, -startPad + i + 1)
      cells.push({ date: d, inMonth: false })
    }
    for (let d = 1; d <= last.getDate(); d++) {
      cells.push({ date: new Date(year, month, d), inMonth: true })
    }
    const endPad = 6 - last.getDay()
    for (let i = 1; i <= endPad; i++) {
      cells.push({ date: new Date(year, month + 1, i), inMonth: false })
    }
    return { cells, totalWeeks: Math.ceil(cells.length / 7) }
  }, [year, month])

  const filteredEvents = events.filter(e =>
    filterType === 'all' || e.type === filterType
  )

  const eventsOnDay = (date) =>
    filteredEvents.filter(e => isSameDay(e.date, date))

  const selectedEvents = selectedDay
    ? events.filter(e => isSameDay(e.date, selectedDay))
    : []

  const upcomingEvents = filteredEvents
    .filter(e => e.date >= new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate()))
    .sort((a, b) => a.date - b.date)
    .slice(0, 6)

  const save = () => {
    if (!form.title) return
    const [dy, dm, dd] = [selectedDay ? selectedDay.getFullYear() : year,
                          selectedDay ? selectedDay.getMonth()    : month,
                          selectedDay ? selectedDay.getDate()     : TODAY.getDate()]
    setEvents(prev => [...prev, {
      id: Date.now(),
      date: new Date(dy, dm, dd),
      type: form.type,
      title: form.title,
      time: form.time || null,
      dept: form.dept,
      employees: form.employees ? form.employees.split(',').map(s => s.trim()) : [],
    }])
    toast('Evento adicionado à agenda!', 'success')
    setNewModal(false)
    setForm(emptyForm)
  }

  const removeEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id))
    toast('Evento removido.', 'warning')
  }

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Agenda da Equipe</h1>
          <p className={styles.sub}>Reuniões, folgas, férias e eventos — tudo em um lugar</p>
        </div>
        <Button variant="primary" icon={<Plus size={15} />} onClick={() => { setForm(emptyForm); setNewModal(true) }}>
          Novo Evento
        </Button>
      </div>

      {/* Filter pills */}
      <div className={styles.filterRow}>
        <button
          className={[styles.filterPill, filterType === 'all' ? styles.filterActive : ''].join(' ')}
          style={filterType === 'all' ? { borderColor: '#64748B', color: '#1A2340', background: '#F1F5F9' } : {}}
          onClick={() => setFilterType('all')}
        >
          Todos
        </button>
        {Object.entries(EVENT_TYPES).map(([k, meta]) => {
          const Icon = meta.icon
          return (
            <button
              key={k}
              className={[styles.filterPill, filterType === k ? styles.filterActive : ''].join(' ')}
              style={filterType === k ? { borderColor: meta.color, color: meta.color, background: meta.bg } : {}}
              onClick={() => setFilterType(prev => prev === k ? 'all' : k)}
            >
              <Icon size={12} />
              {meta.label}
            </button>
          )
        })}
      </div>

      <div className={styles.layout}>
        {/* ── Calendar ── */}
        <Card className={styles.calendarCard}>
          {/* Month nav */}
          <div className={styles.monthNav}>
            <button className={styles.navBtn} onClick={prevMonth}><ChevronLeft size={18} /></button>
            <div className={styles.monthLabel}>
              {MONTHS_PT[month]} {year}
            </div>
            <button className={styles.navBtn} onClick={nextMonth}><ChevronRight size={18} /></button>
          </div>

          {/* Day headers */}
          <div className={styles.dayHeaders}>
            {DAYS_OF_WEEK.map(d => (
              <div key={d} className={[styles.dayHeader, d === 'Dom' || d === 'Sáb' ? styles.weekend : ''].join(' ')}>
                {d}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className={styles.grid} style={{ '--weeks': totalWeeks }}>
            {cells.map((cell, i) => {
              const dayEvents = eventsOnDay(cell.date)
              const isToday   = isSameDay(cell.date, TODAY)
              const isSel     = selectedDay && isSameDay(cell.date, selectedDay)
              const isWeekend = cell.date.getDay() === 0 || cell.date.getDay() === 6

              return (
                <div
                  key={i}
                  className={[
                    styles.cell,
                    !cell.inMonth ? styles.cellOtherMonth : '',
                    isToday  ? styles.cellToday  : '',
                    isSel    ? styles.cellSelected : '',
                    isWeekend && cell.inMonth ? styles.cellWeekend : '',
                  ].join(' ')}
                  onClick={() => setSelectedDay(isSel ? null : cell.date)}
                >
                  <div className={[styles.cellNum, isToday ? styles.cellNumToday : ''].join(' ')}>
                    {cell.date.getDate()}
                  </div>
                  <div className={styles.cellEvents}>
                    {dayEvents.slice(0, 2).map(ev => {
                      const meta = EVENT_TYPES[ev.type]
                      return (
                        <div
                          key={ev.id}
                          className={styles.eventChip}
                          style={{ background: meta.bg, color: meta.color, borderLeft: `3px solid ${meta.color}` }}
                          title={ev.title}
                        >
                          {ev.time ? `${ev.time} ` : ''}{ev.title}
                        </div>
                      )
                    })}
                    {dayEvents.length > 2 && (
                      <div className={styles.moreChip}>+{dayEvents.length - 2}</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* ── Side panel ── */}
        <div className={styles.sidePanel}>
          {/* Selected day detail */}
          {selectedDay ? (
            <Card className={styles.dayDetail}>
              <div className={styles.dayDetailHeader}>
                <div>
                  <div className={styles.dayDetailDate}>
                    {selectedDay.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </div>
                  <div className={styles.dayDetailCount}>
                    {selectedEvents.length} evento{selectedEvents.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Button
                    variant="outline"
                    icon={<Plus size={13} />}
                    onClick={() => { setForm(emptyForm); setNewModal(true) }}
                  >
                    Adicionar
                  </Button>
                  <button className={styles.closeBtn} onClick={() => setSelectedDay(null)}><X size={14} /></button>
                </div>
              </div>

              {selectedEvents.length === 0 ? (
                <div className={styles.emptyDay}>
                  <CalendarDays size={28} color="#CBD5E1" />
                  <span>Nenhum evento neste dia</span>
                  <Button variant="outline" icon={<Plus size={13} />} onClick={() => { setForm(emptyForm); setNewModal(true) }}>
                    Criar evento
                  </Button>
                </div>
              ) : selectedEvents.map(ev => {
                const meta = EVENT_TYPES[ev.type]
                const Icon = meta.icon
                return (
                  <div key={ev.id} className={styles.eventCard} style={{ borderLeft: `4px solid ${meta.color}` }}>
                    <div className={styles.eventCardTop}>
                      <div className={styles.eventCardIcon} style={{ background: meta.bg, color: meta.color }}>
                        <Icon size={14} />
                      </div>
                      <div className={styles.eventCardInfo}>
                        <div className={styles.eventCardTitle}>{ev.title}</div>
                        <div className={styles.eventCardMeta}>
                          {ev.time && <span>🕐 {ev.time}</span>}
                          <span>📁 {ev.dept}</span>
                        </div>
                      </div>
                      <button className={styles.removeBtn} onClick={() => removeEvent(ev.id)}><X size={12} /></button>
                    </div>
                    {ev.employees.length > 0 && (
                      <div className={styles.eventEmployees}>
                        {ev.employees.slice(0, 3).map(name => (
                          <Avatar key={name} name={name} size="xs" />
                        ))}
                        {ev.employees.length > 3 && (
                          <span className={styles.moreEmployees}>+{ev.employees.length - 3}</span>
                        )}
                        <span className={styles.employeeNames}>
                          {ev.employees.slice(0, 2).map(n => n.split(' ')[0]).join(', ')}
                          {ev.employees.length > 2 ? ` +${ev.employees.length - 2}` : ''}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </Card>
          ) : (
            /* Upcoming events */
            <Card className={styles.upcomingCard}>
              <div className={styles.upcomingTitle}>Próximos eventos</div>
              {upcomingEvents.length === 0 ? (
                <div className={styles.emptyDay}>
                  <CalendarDays size={28} color="#CBD5E1" />
                  <span>Nenhum evento próximo</span>
                </div>
              ) : upcomingEvents.map(ev => {
                const meta = EVENT_TYPES[ev.type]
                const Icon = meta.icon
                const isToday = isSameDay(ev.date, TODAY)
                return (
                  <div
                    key={ev.id}
                    className={styles.upcomingItem}
                    onClick={() => setSelectedDay(ev.date)}
                  >
                    <div className={styles.upcomingDate}>
                      <div className={styles.upcomingDay}>{ev.date.getDate()}</div>
                      <div className={styles.upcomingMonth}>
                        {isToday ? 'Hoje' : MONTHS_PT[ev.date.getMonth()].slice(0, 3)}
                      </div>
                    </div>
                    <div className={styles.upcomingIcon} style={{ background: meta.bg, color: meta.color }}>
                      <Icon size={13} />
                    </div>
                    <div className={styles.upcomingInfo}>
                      <div className={styles.upcomingName}>{ev.title}</div>
                      <div className={styles.upcomingMeta}>
                        {ev.time && <span>{ev.time} · </span>}
                        <span>{ev.employees.length} pessoa{ev.employees.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    {isToday && <span className={styles.todayTag}>Hoje</span>}
                  </div>
                )
              })}
            </Card>
          )}

          {/* Legend */}
          <Card className={styles.legend}>
            <div className={styles.legendTitle}>Legenda</div>
            {Object.entries(EVENT_TYPES).map(([k, meta]) => {
              const Icon = meta.icon
              return (
                <div key={k} className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ background: meta.color }} />
                  <Icon size={12} color={meta.color} />
                  <span>{meta.label}</span>
                </div>
              )
            })}
          </Card>
        </div>
      </div>

      {/* New event modal */}
      <Modal
        open={newModal}
        onClose={() => setNewModal(false)}
        title={selectedDay
          ? `Novo evento — ${selectedDay.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}`
          : 'Novo Evento'}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setNewModal(false)}>Cancelar</Button>
            <Button variant="primary" onClick={save}>Adicionar</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input
            label="Título do evento"
            value={form.title}
            onChange={e => f('title', e.target.value)}
            placeholder="Ex: Reunião semanal de RH"
            required
          />
          <Select
            label="Tipo"
            value={form.type}
            onChange={e => f('type', e.target.value)}
            options={Object.entries(EVENT_TYPES).map(([k, m]) => ({ value: k, label: m.label }))}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input
              label="Horário (opcional)"
              type="time"
              value={form.time}
              onChange={e => f('time', e.target.value)}
            />
            <Input
              label="Departamento"
              value={form.dept}
              onChange={e => f('dept', e.target.value)}
              placeholder="Ex: RH"
            />
          </div>
          <Input
            label="Participantes (separados por vírgula)"
            value={form.employees}
            onChange={e => f('employees', e.target.value)}
            placeholder="Ex: Mariana Costa, Roberto Lima"
          />
        </div>
      </Modal>
    </div>
  )
}
