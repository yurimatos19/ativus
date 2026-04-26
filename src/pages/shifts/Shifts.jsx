import { useState } from 'react'
import { Plus, Edit2, Trash2, Calendar, Users, Clock } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { useToast } from '../../components/ui/ToastContainer'
import styles from './Shifts.module.css'

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const DAY_FULL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

const INITIAL = [
  {
    id: 1, name: 'Escala 5x2 Comercial', type: '5x2', employees: 7,
    workDays: [1,2,3,4,5], restDays: [0,6],
    schedule: 'Jornada Padrão CLT', cycle: '1 semana',
    description: 'Segunda a sexta, descanso sábado e domingo',
    color: '#1565C0',
  },
  {
    id: 2, name: 'Escala 6x1 Operacional', type: '6x1', employees: 5,
    workDays: [1,2,3,4,5,6], restDays: [0],
    schedule: 'Turno da Manhã', cycle: '1 semana',
    description: 'Segunda a sábado, descanso rotativo aos domingos',
    color: '#7B1FA2',
  },
  {
    id: 3, name: 'Plantão 12x36', type: '12x36', employees: 4,
    workDays: [1,3,5], restDays: [0,2,4,6],
    schedule: 'Plantão 12x36', cycle: '2 semanas',
    description: '12 horas de trabalho, 36 horas de descanso alternadas',
    color: '#E65100',
  },
  {
    id: 4, name: 'Escala Administrativa Flex', type: 'flex', employees: 3,
    workDays: [1,2,3,4,5], restDays: [0,6],
    schedule: 'Administrativo Flex', cycle: '1 semana',
    description: 'Horário flexível com banco de horas semanal',
    color: '#2E7D32',
  },
]

const TYPE_LABELS = { '5x2': '5×2', '6x1': '6×1', '12x36': '12×36', flex: 'Flexível', custom: 'Personalizada' }
const TYPE_VARIANTS = { '5x2': 'blue', '6x1': 'info', '12x36': 'warning', flex: 'success', custom: 'neutral' }

const emptyForm = {
  name: '', type: '5x2', schedule: 'Jornada Padrão CLT', cycle: '1 semana', description: '', color: '#1565C0',
}

export default function Shifts() {
  const toast = useToast()
  const [items, setItems] = useState(INITIAL)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [workDaysSel, setWorkDaysSel] = useState([1,2,3,4,5])

  const openNew = () => {
    setEditing(null)
    setForm(emptyForm)
    setWorkDaysSel([1,2,3,4,5])
    setModal(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setForm({ name: item.name, type: item.type, schedule: item.schedule, cycle: item.cycle, description: item.description, color: item.color })
    setWorkDaysSel(item.workDays)
    setModal(true)
  }

  const toggleDay = (d) => {
    setWorkDaysSel(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort())
  }

  const save = () => {
    if (!form.name) return
    const restDays = [0,1,2,3,4,5,6].filter(d => !workDaysSel.includes(d))
    if (editing) {
      setItems(prev => prev.map(i => i.id === editing.id ? { ...i, ...form, workDays: workDaysSel, restDays } : i))
      toast('Escala atualizada!', 'success')
    } else {
      setItems(prev => [...prev, { ...form, id: Date.now(), workDays: workDaysSel, restDays, employees: 0 }])
      toast('Escala criada com sucesso!', 'success')
    }
    setModal(false)
  }

  const remove = (id) => {
    setItems(prev => prev.filter(i => i.id !== id))
    toast('Escala removida.', 'warning')
  }

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Escalas de Trabalho</h1>
          <p className={styles.sub}>Configure os ciclos de trabalho e descanso dos funcionários</p>
        </div>
        <Button variant="primary" icon={<Plus size={15} />} onClick={openNew}>Nova Escala</Button>
      </div>

      {/* Summary bar */}
      <div className={styles.summaryBar}>
        {[
          { label: 'Escalas ativas', val: items.length },
          { label: 'Funcionários cobertos', val: items.reduce((s, i) => s + i.employees, 0) },
          { label: 'Tipos de ciclo', val: new Set(items.map(i => i.type)).size },
        ].map(s => (
          <Card key={s.label} className={styles.summaryCard}>
            <span className={styles.summaryVal}>{s.val}</span>
            <span className={styles.summaryLabel}>{s.label}</span>
          </Card>
        ))}
      </div>

      {/* Cards */}
      <div className={styles.grid}>
        {items.map(item => (
          <Card key={item.id} className={styles.card}>
            <div className={styles.cardAccent} style={{ background: item.color }} />

            <div className={styles.cardHeader}>
              <div>
                <div className={styles.cardName}>{item.name}</div>
                <div className={styles.cardDesc}>{item.description}</div>
              </div>
              <div className={styles.cardActions}>
                <Badge variant={TYPE_VARIANTS[item.type]}>{TYPE_LABELS[item.type]}</Badge>
                <button className={styles.iconBtn} onClick={() => openEdit(item)}><Edit2 size={13} /></button>
                <button className={styles.iconBtn} onClick={() => remove(item.id)} style={{ color: '#EF4444' }}><Trash2 size={13} /></button>
              </div>
            </div>

            {/* Day grid */}
            <div className={styles.dayGrid}>
              {DAYS.map((day, i) => (
                <div
                  key={day}
                  className={[styles.dayCell, item.workDays.includes(i) ? styles.workDay : styles.restDay].join(' ')}
                >
                  {day}
                </div>
              ))}
            </div>

            <div className={styles.cardMeta}>
              <span className={styles.metaItem}><Calendar size={12} /> Ciclo: {item.cycle}</span>
              <span className={styles.metaItem}><Clock size={12} /> {item.schedule}</span>
              <span className={styles.metaItem}><Users size={12} /> {item.employees} func.</span>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? 'Editar Escala' : 'Nova Escala de Trabalho'}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(false)}>Cancelar</Button>
            <Button variant="primary" onClick={save}>{editing ? 'Salvar Alterações' : 'Criar Escala'}</Button>
          </>
        }
      >
        <div className={styles.formGrid}>
          <div style={{ gridColumn: '1 / -1' }}>
            <Input label="Nome da Escala" value={form.name} onChange={e => f('name', e.target.value)} placeholder="Ex: Escala 5x2 Comercial" required />
          </div>
          <Select label="Tipo" value={form.type} onChange={e => f('type', e.target.value)}
            options={[
              { value: '5x2', label: '5×2 — 5 dias trabalho / 2 descanso' },
              { value: '6x1', label: '6×1 — 6 dias trabalho / 1 descanso' },
              { value: '12x36', label: '12×36 — 12h trabalho / 36h descanso' },
              { value: 'flex', label: 'Flexível — banco de horas' },
              { value: 'custom', label: 'Personalizada' },
            ]}
          />
          <Select label="Jornada vinculada" value={form.schedule} onChange={e => f('schedule', e.target.value)}
            options={[
              { value: 'Jornada Padrão CLT', label: 'Jornada Padrão CLT' },
              { value: 'Turno da Manhã', label: 'Turno da Manhã' },
              { value: 'Turno da Tarde', label: 'Turno da Tarde' },
              { value: 'Administrativo Flex', label: 'Administrativo Flex' },
              { value: 'Plantão 12x36', label: 'Plantão 12×36' },
            ]}
          />
          <Select label="Ciclo" value={form.cycle} onChange={e => f('cycle', e.target.value)}
            options={[
              { value: '1 semana', label: '1 semana' },
              { value: '2 semanas', label: '2 semanas' },
              { value: '4 semanas', label: '4 semanas (mensal)' },
            ]}
          />
          <div style={{ gridColumn: '1 / -1' }}>
            <label className={styles.dayLabel}>Dias de trabalho</label>
            <div className={styles.dayPicker}>
              {DAYS.map((day, i) => (
                <button
                  key={day}
                  type="button"
                  className={[styles.dayPickerCell, workDaysSel.includes(i) ? styles.dayPickerActive : ''].join(' ')}
                  onClick={() => toggleDay(i)}
                  title={DAY_FULL[i]}
                >
                  {day}
                </button>
              ))}
            </div>
            <div className={styles.daySummary}>
              {workDaysSel.length} dias de trabalho · {7 - workDaysSel.length} dias de descanso
            </div>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <Input label="Descrição" value={form.description} onChange={e => f('description', e.target.value)} placeholder="Breve descrição da escala" />
          </div>
        </div>
      </Modal>
    </div>
  )
}
