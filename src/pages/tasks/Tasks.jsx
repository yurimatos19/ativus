import { useState, useMemo } from 'react'
import {
  Plus, Search, CheckCircle, Circle, Edit2, Trash2,
  ClipboardList, Copy, Repeat2, Users, Building2,
} from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { useToast } from '../../components/ui/ToastContainer'
import { EMPLOYEES, DEPARTMENTS, TASKS, TASK_CATEGORIES } from '../../data/mock'
import styles from './Tasks.module.css'

// ── Constants ──────────────────────────────────────────────────────────────────

const TODAY = new Date().toISOString().split('T')[0]

const WEEK_DAYS = [
  { idx: 0, short: 'Dom', label: 'Domingo' },
  { idx: 1, short: 'Seg', label: 'Segunda' },
  { idx: 2, short: 'Ter', label: 'Terça'  },
  { idx: 3, short: 'Qua', label: 'Quarta'  },
  { idx: 4, short: 'Qui', label: 'Quinta'  },
  { idx: 5, short: 'Sex', label: 'Sexta'   },
  { idx: 6, short: 'Sáb', label: 'Sábado'  },
]

const RECURRENCE_LABELS = {
  diaria:  { label: 'Diária',  color: '#1565C0', bg: '#DBEAFE' },
  semanal: { label: 'Semanal', color: '#7C3AED', bg: '#EDE9FE' },
  mensal:  { label: 'Mensal',  color: '#0369A1', bg: '#E0F2FE' },
}

const PRIORITY_BADGE = {
  high:   { label: 'Alta',  variant: 'error'   },
  medium: { label: 'Média', variant: 'warning' },
  low:    { label: 'Baixa', variant: 'neutral' },
}

const EMP_OPTIONS    = [{ value: '', label: 'Todos os funcionários' }, ...EMPLOYEES.map(e => ({ value: String(e.id), label: e.name }))]
const DEPT_FILTER_OPTIONS = [{ value: '', label: 'Todos os departamentos' }, ...DEPARTMENTS.map(d => ({ value: d, label: d }))]
const CATEGORY_OPTIONS   = [{ value: '', label: 'Todas as categorias' }, ...TASK_CATEGORIES.map(c => ({ value: c, label: c }))]
const STATUS_OPTIONS     = [{ value: '', label: 'Todos os status' }, { value: 'pending', label: 'Pendentes' }, { value: 'done', label: 'Concluídas' }]
const PRIORITY_OPTIONS   = [{ value: '', label: 'Todas as prioridades' }, { value: 'high', label: 'Alta' }, { value: 'medium', label: 'Média' }, { value: 'low', label: 'Baixa' }]
const RECURRENCE_FILTER  = [{ value: '', label: 'Todas' }, { value: 'none', label: 'Única vez' }, { value: 'diaria', label: 'Diária' }, { value: 'semanal', label: 'Semanal' }, { value: 'mensal', label: 'Mensal' }]

const RECURRENCE_SELECT = [
  { value: 'none',    label: 'Única vez (sem recorrência)' },
  { value: 'diaria',  label: 'Diária' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'mensal',  label: 'Mensal' },
]
const PRIORITY_SELECT = [{ value: 'high', label: 'Alta' }, { value: 'medium', label: 'Média' }, { value: 'low', label: 'Baixa' }]
const CATEGORY_SELECT = TASK_CATEGORIES.map(c => ({ value: c, label: c }))
const DEPT_SELECT     = DEPARTMENTS.map(d => ({ value: d, label: d }))
const EMP_FORM_SELECT = [{ value: '', label: 'Selecione...' }, ...EMPLOYEES.map(e => ({ value: String(e.id), label: `${e.name} — ${e.dept}` }))]

// ── Helpers ───────────────────────────────────────────────────────────────────

function nextOccurrence(task) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (task.recurrence === 'diaria') {
    const next = new Date(today)
    next.setDate(today.getDate() + 1)
    return next.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  if (task.recurrence === 'semanal' && task.recurrenceDays?.length) {
    const sorted = [...task.recurrenceDays].sort()
    const todayDow = today.getDay()
    const nextDow  = sorted.find(d => d > todayDow) ?? sorted[0]
    const diff = nextDow > todayDow ? nextDow - todayDow : 7 - todayDow + nextDow
    const next = new Date(today)
    next.setDate(today.getDate() + diff)
    const dayName = WEEK_DAYS.find(d => d.idx === nextDow)?.short
    return `${dayName}, ${next.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}`
  }

  if (task.recurrence === 'mensal' && task.recurrenceDay) {
    const next = new Date(today.getFullYear(), today.getMonth() + (today.getDate() >= task.recurrenceDay ? 1 : 0), task.recurrenceDay)
    return next.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  return null
}

function recurrenceShortLabel(task) {
  if (!task.recurrence) return null
  const base = RECURRENCE_LABELS[task.recurrence].label
  if (task.recurrence === 'semanal' && task.recurrenceDays?.length) {
    const days = task.recurrenceDays.map(d => WEEK_DAYS.find(w => w.idx === d)?.short).join(', ')
    return `${base} · ${days}`
  }
  if (task.recurrence === 'mensal' && task.recurrenceDay) {
    return `${base} · dia ${task.recurrenceDay}`
  }
  return base
}

function emptyForm() {
  return {
    assigneeType:   'employee',
    employeeId:     '',
    department:     DEPARTMENTS[0],
    title:          '',
    date:           TODAY,
    time:           '09:00',
    priority:       'medium',
    category:       TASK_CATEGORIES[0],
    recurrence:     'none',
    recurrenceDays: [],
    recurrenceDay:  1,
    note:           '',
  }
}

// ── Assignee cell ─────────────────────────────────────────────────────────────

function AssigneeCell({ task }) {
  if (task.assigneeType === 'department') {
    const count = EMPLOYEES.filter(e => e.dept === task.department).length
    return (
      <div className={styles.nameCell}>
        <div className={styles.deptIcon}><Building2 size={14} /></div>
        <div>
          <div className={styles.empName}>{task.department}</div>
          <div className={styles.empDept}>{count} funcionários</div>
        </div>
      </div>
    )
  }
  const emp = EMPLOYEES.find(e => e.id === task.employeeId)
  return (
    <div className={styles.nameCell}>
      <Avatar name={emp?.name || ''} size="xs" />
      <div>
        <div className={styles.empName}>{emp?.name}</div>
        <div className={styles.empDept}>{emp?.dept}</div>
      </div>
    </div>
  )
}

// ── Recurrence badge ──────────────────────────────────────────────────────────

function RecurrenceBadge({ task }) {
  if (!task.recurrence) return <span className={styles.noRecurrence}>—</span>
  const { color, bg } = RECURRENCE_LABELS[task.recurrence]
  return (
    <div className={styles.recBadgeWrap}>
      <span className={styles.recBadge} style={{ color, background: bg }}>
        <Repeat2 size={11} /> {RECURRENCE_LABELS[task.recurrence].label}
      </span>
      {task.recurrence === 'semanal' && task.recurrenceDays?.length > 0 && (
        <span className={styles.recDays}>
          {task.recurrenceDays.map(d => WEEK_DAYS.find(w => w.idx === d)?.short).join(' · ')}
        </span>
      )}
      {task.recurrence === 'mensal' && task.recurrenceDay && (
        <span className={styles.recDays}>dia {task.recurrenceDay}</span>
      )}
    </div>
  )
}

// ── Day picker (weekly recurrence) ────────────────────────────────────────────

function DayPicker({ selected, onChange }) {
  const toggle = idx => {
    const next = selected.includes(idx) ? selected.filter(d => d !== idx) : [...selected, idx]
    onChange(next)
  }
  return (
    <div className={styles.dayPicker}>
      {WEEK_DAYS.map(({ idx, short }) => (
        <button
          key={idx}
          type="button"
          className={[styles.dayBtn, selected.includes(idx) ? styles.dayBtnOn : ''].join(' ')}
          onClick={() => toggle(idx)}
        >
          {short}
        </button>
      ))}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Tasks() {
  const toast = useToast()
  const [tasks, setTasks]             = useState(TASKS)
  const [query, setQuery]             = useState('')
  const [empFilter, setEmpFilter]     = useState('')
  const [deptFilter, setDeptFilter]   = useState('')
  const [statusFilter, setStatus]     = useState('')
  const [prioFilter, setPrio]         = useState('')
  const [catFilter, setCat]           = useState('')
  const [recFilter, setRecFilter]     = useState('')
  const [dateFilter, setDate]         = useState('')
  const [modal, setModal]             = useState(null)   // null | 'create' | task (edit)
  const [form, setForm]               = useState(emptyForm())
  const [deleteTarget, setDelete]     = useState(null)

  // ── Filtered list ───────────────────────────────────────────────────────────

  const filtered = useMemo(() => tasks.filter(t => {
    const emp = t.assigneeType === 'employee' ? EMPLOYEES.find(e => e.id === t.employeeId) : null
    const matchQ    = !query       || t.title.toLowerCase().includes(query.toLowerCase()) || emp?.name.toLowerCase().includes(query.toLowerCase()) || t.department?.toLowerCase().includes(query.toLowerCase())
    const matchEmp  = !empFilter   || (t.assigneeType === 'employee' && String(t.employeeId) === empFilter)
    const matchDept = !deptFilter  || (t.assigneeType === 'department' ? t.department === deptFilter : emp?.dept === deptFilter)
    const matchSt   = !statusFilter || (statusFilter === 'done' ? t.done : !t.done)
    const matchPrio = !prioFilter   || t.priority === prioFilter
    const matchCat  = !catFilter    || t.category === catFilter
    const matchRec  = !recFilter    || (recFilter === 'none' ? !t.recurrence : t.recurrence === recFilter)
    const matchDate = !dateFilter   || t.date === dateFilter
    return matchQ && matchEmp && matchDept && matchSt && matchPrio && matchCat && matchRec && matchDate
  }), [tasks, query, empFilter, deptFilter, statusFilter, prioFilter, catFilter, recFilter, dateFilter])

  // ── KPIs ────────────────────────────────────────────────────────────────────

  const total      = tasks.length
  const done       = tasks.filter(t => t.done).length
  const pending    = total - done
  const recurring  = tasks.filter(t => t.recurrence).length
  const highPrio   = tasks.filter(t => t.priority === 'high' && !t.done).length

  // ── Actions ─────────────────────────────────────────────────────────────────

  const toggleDone = id => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t
      const next = { ...t, done: !t.done }
      toast(next.done ? 'Tarefa concluída!' : 'Tarefa reaberta.', next.done ? 'success' : 'warning')
      return next
    }))
  }

  const openCreate = () => { setForm(emptyForm()); setModal('create') }

  const openEdit = task => {
    setForm({
      assigneeType:   task.assigneeType,
      employeeId:     task.employeeId ? String(task.employeeId) : '',
      department:     task.department ?? DEPARTMENTS[0],
      title:          task.title,
      date:           task.date,
      time:           task.time,
      priority:       task.priority,
      category:       task.category,
      recurrence:     task.recurrence ?? 'none',
      recurrenceDays: task.recurrenceDays ?? [],
      recurrenceDay:  task.recurrenceDay ?? 1,
      note:           task.note ?? '',
    })
    setModal(task)
  }

  const duplicate = task => {
    const copy = { ...task, id: Date.now(), done: false, date: TODAY }
    setTasks(prev => [copy, ...prev])
    toast('Tarefa duplicada!', 'success')
  }

  const buildTask = (base = {}) => ({
    ...base,
    id:             base.id ?? Date.now(),
    assigneeType:   form.assigneeType,
    employeeId:     form.assigneeType === 'employee' ? Number(form.employeeId) : null,
    department:     form.assigneeType === 'department' ? form.department : null,
    title:          form.title.trim(),
    date:           form.date,
    time:           form.time,
    priority:       form.priority,
    category:       form.category,
    recurrence:     form.recurrence === 'none' ? null : form.recurrence,
    recurrenceDays: form.recurrence === 'semanal' ? form.recurrenceDays : null,
    recurrenceDay:  form.recurrence === 'mensal'  ? Number(form.recurrenceDay) : null,
    note:           form.note,
    createdBy:      'Mariana Costa',
  })

  const handleSave = () => {
    const empOk   = form.assigneeType === 'department' || form.employeeId
    const weekOk  = form.recurrence !== 'semanal' || form.recurrenceDays.length > 0
    if (!empOk)            { toast('Selecione um funcionário.', 'error'); return }
    if (!form.title.trim()) { toast('Informe o título da tarefa.', 'error'); return }
    if (!form.date)         { toast('Informe a data.', 'error'); return }
    if (!weekOk)            { toast('Selecione ao menos um dia da semana.', 'error'); return }

    if (modal === 'create') {
      setTasks(prev => [buildTask({ done: false }), ...prev])
      toast('Tarefa criada com sucesso!', 'success')
    } else {
      setTasks(prev => prev.map(t => t.id === modal.id ? buildTask({ id: t.id, done: t.done }) : t))
      toast('Tarefa atualizada!', 'success')
    }
    setModal(null)
  }

  const confirmDelete = () => {
    setTasks(prev => prev.filter(t => t.id !== deleteTarget.id))
    toast('Tarefa removida.', 'error')
    setDelete(null)
  }

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }))
  const setVal = (key, val) => setForm(f => ({ ...f, [key]: val }))

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Tarefas dos Funcionários</h1>
          <p className={styles.sub}>{pending} pendente{pending !== 1 ? 's' : ''} · {recurring} recorrente{recurring !== 1 ? 's' : ''} cadastrada{recurring !== 1 ? 's' : ''}</p>
        </div>
        <Button variant="primary" icon={<Plus size={15} />} onClick={openCreate}>
          Nova Tarefa
        </Button>
      </div>

      {/* KPIs */}
      <div className={styles.kpiRow}>
        {[
          { label: 'Total',           value: total,    color: '#1565C0', bg: '#DBEAFE' },
          { label: 'Pendentes',       value: pending,  color: '#F59E0B', bg: '#FEF3C7' },
          { label: 'Concluídas',      value: done,     color: '#39B54A', bg: '#DCFCE7' },
          { label: 'Recorrentes',     value: recurring,color: '#7C3AED', bg: '#EDE9FE' },
          { label: 'Alta Prioridade', value: highPrio, color: '#EF4444', bg: '#FEE2E2' },
        ].map(({ label, value, color, bg }) => (
          <Card key={label} className={styles.kpiCard}>
            <div className={styles.kpiValue} style={{ color }}>{value}</div>
            <div className={styles.kpiLabel}>{label}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className={styles.filters}>
        <div className={styles.searchWrap}>
          <Search size={14} className={styles.searchIcon} />
          <input
            className={styles.search}
            placeholder="Buscar tarefa, funcionário ou departamento..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <Select value={empFilter}    onChange={e => setEmpFilter(e.target.value)}    options={EMP_OPTIONS} />
        <Select value={deptFilter}   onChange={e => setDeptFilter(e.target.value)}   options={DEPT_FILTER_OPTIONS} />
        <Select value={catFilter}    onChange={e => setCat(e.target.value)}          options={CATEGORY_OPTIONS} />
        <Select value={statusFilter} onChange={e => setStatus(e.target.value)}       options={STATUS_OPTIONS} />
        <Select value={prioFilter}   onChange={e => setPrio(e.target.value)}         options={PRIORITY_OPTIONS} />
        <Select value={recFilter}    onChange={e => setRecFilter(e.target.value)}    options={RECURRENCE_FILTER} />
        <Input  type="date" value={dateFilter} onChange={e => setDate(e.target.value)} />
      </Card>

      {/* Table */}
      <Card padding="none">
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: 40 }}></th>
              <th>Destinatário</th>
              <th>Tarefa</th>
              <th>Categoria</th>
              <th>Horário</th>
              <th>Data</th>
              <th>Recorrência</th>
              <th>Próx. ocorrência</th>
              <th>Prioridade</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(task => {
              const pb      = PRIORITY_BADGE[task.priority]
              const isToday = task.date === TODAY
              const nextOcc = nextOccurrence(task)

              return (
                <tr key={task.id} className={[styles.row, task.done ? styles.rowDone : ''].join(' ')}>
                  <td>
                    <button
                      className={[styles.checkBtn, task.done ? styles.checkBtnDone : ''].join(' ')}
                      onClick={() => toggleDone(task.id)}
                      title={task.done ? 'Reabrir' : 'Concluir'}
                    >
                      {task.done ? <CheckCircle size={18} /> : <Circle size={18} />}
                    </button>
                  </td>

                  <td><AssigneeCell task={task} /></td>

                  <td>
                    <div className={[styles.taskTitle, task.done ? styles.taskTitleDone : ''].join(' ')}>
                      {task.title}
                    </div>
                    {task.note && <div className={styles.taskNote}>{task.note}</div>}
                  </td>

                  <td>
                    <span className={styles.categoryChip}>{task.category}</span>
                  </td>

                  <td className={styles.mono}>{task.time}</td>

                  <td>
                    <span className={[styles.dateLabel, isToday ? styles.dateLabelToday : ''].join(' ')}>
                      {isToday ? 'Hoje' : new Date(task.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    </span>
                  </td>

                  <td><RecurrenceBadge task={task} /></td>

                  <td className={styles.nextOcc}>
                    {nextOcc ? <span className={styles.nextOccVal}>{nextOcc}</span> : <span className={styles.noRecurrence}>—</span>}
                  </td>

                  <td><Badge variant={pb.variant}>{pb.label}</Badge></td>

                  <td>
                    {task.done
                      ? <Badge variant="success">Concluída</Badge>
                      : <Badge variant="warning">Pendente</Badge>}
                  </td>

                  <td>
                    <div className={styles.actions}>
                      <button className={styles.iconBtn} title="Editar" onClick={() => openEdit(task)}>
                        <Edit2 size={13} />
                      </button>
                      <button className={styles.iconBtn} title="Duplicar" onClick={() => duplicate(task)}>
                        <Copy size={13} />
                      </button>
                      <button className={[styles.iconBtn, styles.deleteBtn].join(' ')} title="Excluir" onClick={() => setDelete(task)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className={styles.empty}>
            <ClipboardList size={32} color="var(--fg-tertiary)" />
            <p>Nenhuma tarefa encontrada com os filtros aplicados.</p>
          </div>
        )}
      </Card>

      {/* ── Create / Edit Modal ───────────────────────────────────────────────── */}
      {modal !== null && (
        <Modal
          open
          onClose={() => setModal(null)}
          title={modal === 'create' ? 'Nova Tarefa' : 'Editar Tarefa'}
          size="lg"
          footer={
            <>
              <Button variant="ghost" onClick={() => setModal(null)}>Cancelar</Button>
              <Button variant="primary" onClick={handleSave}>
                {modal === 'create' ? 'Criar Tarefa' : 'Salvar Alterações'}
              </Button>
            </>
          }
        >
          <div className={styles.formGrid}>

            {/* ── Destinatário ─────────────────────────────────────── */}
            <div className={styles.formFull}>
              <div className={styles.fieldLabel}>Destinatário</div>
              <div className={styles.assigneeToggle}>
                <button
                  type="button"
                  className={[styles.toggleBtn, form.assigneeType === 'employee' ? styles.toggleBtnOn : ''].join(' ')}
                  onClick={() => setVal('assigneeType', 'employee')}
                >
                  <Users size={14} /> Funcionário
                </button>
                <button
                  type="button"
                  className={[styles.toggleBtn, form.assigneeType === 'department' ? styles.toggleBtnOn : ''].join(' ')}
                  onClick={() => setVal('assigneeType', 'department')}
                >
                  <Building2 size={14} /> Departamento inteiro
                </button>
              </div>
            </div>

            {form.assigneeType === 'employee' ? (
              <div className={styles.formFull}>
                <Select
                  label="Funcionário *"
                  value={form.employeeId}
                  onChange={set('employeeId')}
                  options={EMP_FORM_SELECT}
                />
              </div>
            ) : (
              <div className={styles.formFull}>
                <Select
                  label="Departamento *"
                  value={form.department}
                  onChange={set('department')}
                  options={DEPT_SELECT}
                />
                <p className={styles.deptHint}>
                  A tarefa será atribuída a todos os {EMPLOYEES.filter(e => e.dept === form.department).length} funcionários do departamento.
                </p>
              </div>
            )}

            {/* Separador */}
            <div className={styles.formFull}><div className={styles.divider} /></div>

            {/* ── Tarefa ───────────────────────────────────────────── */}
            <div className={styles.formFull}>
              <Input
                label="Título da Tarefa *"
                placeholder="Descreva o que o funcionário deve fazer..."
                value={form.title}
                onChange={set('title')}
              />
            </div>

            <Select label="Categoria" value={form.category} onChange={set('category')} options={CATEGORY_SELECT} />
            <Select label="Prioridade" value={form.priority} onChange={set('priority')} options={PRIORITY_SELECT} />

            <Input label="Data *"    type="date" value={form.date} onChange={set('date')} />
            <Input label="Horário"   type="time" value={form.time} onChange={set('time')} />

            {/* Separador */}
            <div className={styles.formFull}><div className={styles.divider} /></div>

            {/* ── Recorrência ──────────────────────────────────────── */}
            <div className={styles.formFull}>
              <Select
                label="Recorrência"
                value={form.recurrence}
                onChange={set('recurrence')}
                options={RECURRENCE_SELECT}
              />
            </div>

            {form.recurrence === 'semanal' && (
              <div className={styles.formFull}>
                <div className={styles.fieldLabel}>Dias da semana *</div>
                <DayPicker
                  selected={form.recurrenceDays}
                  onChange={days => setVal('recurrenceDays', days)}
                />
              </div>
            )}

            {form.recurrence === 'mensal' && (
              <div className={styles.formFull}>
                <Input
                  label="Dia do mês *"
                  type="number"
                  value={form.recurrenceDay}
                  onChange={e => setVal('recurrenceDay', Math.min(31, Math.max(1, Number(e.target.value))))}
                />
                <p className={styles.deptHint}>A tarefa será gerada todo mês no dia {form.recurrenceDay}.</p>
              </div>
            )}

            {form.recurrence === 'diaria' && (
              <div className={styles.formFull}>
                <p className={styles.recurrenceInfo}>
                  <Repeat2 size={13} /> Esta tarefa será repetida automaticamente todos os dias úteis.
                </p>
              </div>
            )}

            {/* Separador */}
            <div className={styles.formFull}><div className={styles.divider} /></div>

            {/* Observação */}
            <div className={styles.formFull}>
              <label className={styles.fieldLabel}>Observação (opcional)</label>
              <textarea
                className={styles.textarea}
                rows={3}
                placeholder="Informações adicionais para o funcionário..."
                value={form.note}
                onChange={set('note')}
              />
            </div>
          </div>
        </Modal>
      )}

      {/* ── Delete modal ─────────────────────────────────────────────────────── */}
      {deleteTarget && (
        <Modal
          open
          onClose={() => setDelete(null)}
          title="Excluir Tarefa"
          size="sm"
          footer={
            <>
              <Button variant="ghost" onClick={() => setDelete(null)}>Cancelar</Button>
              <Button variant="danger" onClick={confirmDelete}>Excluir</Button>
            </>
          }
        >
          <p className={styles.deleteMsg}>
            Tem certeza que deseja excluir a tarefa <strong>"{deleteTarget.title}"</strong>?
            {deleteTarget.recurrence && (
              <><br /><span className={styles.deleteWarn}>Esta é uma tarefa {RECURRENCE_LABELS[deleteTarget.recurrence].label.toLowerCase()} — todas as ocorrências serão removidas.</span></>
            )}
          </p>
        </Modal>
      )}
    </div>
  )
}
