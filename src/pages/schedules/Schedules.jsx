import { useState } from 'react'
import { Plus, Edit2, Trash2, CalendarDays } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { useToast } from '../../components/ui/ToastContainer'
import styles from './Schedules.module.css'

const INITIAL = [
  { id: 1, name: 'Jornada Padrão CLT',   daily: '08h00', weekly: '44h', interval: '01h00', entry: '08:00', exit: '17:00', days: 'Seg–Sex', type: 'commercial', employees: 7 },
  { id: 2, name: 'Turno da Manhã',        daily: '06h00', weekly: '36h', interval: '00h30', entry: '06:00', exit: '12:30', days: 'Seg–Sáb', type: 'shift',      employees: 3 },
  { id: 3, name: 'Turno da Tarde',        daily: '06h00', weekly: '36h', interval: '00h30', entry: '12:30', exit: '19:00', days: 'Seg–Sáb', type: 'shift',      employees: 2 },
  { id: 4, name: 'Administrativo Flex',   daily: '08h00', weekly: '40h', interval: '01h00', entry: '09:00', exit: '18:00', days: 'Seg–Sex', type: 'flex',       employees: 5 },
  { id: 5, name: 'Plantão 12x36',         daily: '12h00', weekly: '42h', interval: '01h00', entry: '07:00', exit: '19:00', days: '12x36',  type: 'shift',      employees: 4 },
]

const TYPE_LABELS = { commercial: 'Comercial', shift: 'Turno', flex: 'Flexível', night: 'Noturno' }
const TYPE_VARIANTS = { commercial: 'blue', shift: 'info', flex: 'success', night: 'neutral' }

const emptyForm = { name: '', daily: '08h00', weekly: '44h', interval: '01h00', entry: '08:00', exit: '17:00', days: 'Seg–Sex', type: 'commercial' }

export default function Schedules() {
  const toast = useToast()
  const [items, setItems]     = useState(INITIAL)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(emptyForm)

  const openNew  = () => { setEditing(null); setForm(emptyForm); setModal(true) }
  const openEdit = (item) => { setEditing(item); setForm({ ...item }); setModal(true) }

  const save = () => {
    if (!form.name) return
    if (editing) {
      setItems(prev => prev.map(i => i.id === editing.id ? { ...i, ...form } : i))
      toast('Jornada atualizada!', 'success')
    } else {
      setItems(prev => [...prev, { ...form, id: Date.now(), employees: 0 }])
      toast('Jornada criada com sucesso!', 'success')
    }
    setModal(false)
  }

  const remove = (id) => {
    setItems(prev => prev.filter(i => i.id !== id))
    toast('Jornada removida.', 'warning')
  }

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Jornadas de Trabalho</h1>
          <p className={styles.sub}>Defina as regras de jornada — carga horária, horários e intervalos</p>
        </div>
        <Button variant="primary" icon={<Plus size={15} />} onClick={openNew}>Nova Jornada</Button>
      </div>

      {/* Info banner */}
      <Card className={styles.infoBanner}>
        <CalendarDays size={18} color="#1565C0" />
        <div>
          <strong>CLT Art. 58:</strong> A duração normal do trabalho, para os empregados em qualquer atividade privada, não excederá
          de <strong>8 horas diárias</strong> e <strong>44 horas semanais</strong>, facultada a compensação de horários e a redução da jornada,
          mediante acordo ou convenção coletiva de trabalho.
        </div>
      </Card>

      {/* Cards grid */}
      <div className={styles.grid}>
        {items.map(item => (
          <Card key={item.id} className={styles.card}>
            <div className={styles.cardTop}>
              <div>
                <div className={styles.cardName}>{item.name}</div>
                <Badge variant={TYPE_VARIANTS[item.type]}>{TYPE_LABELS[item.type]}</Badge>
              </div>
              <div className={styles.cardActions}>
                <button className={styles.iconBtn} onClick={() => openEdit(item)}><Edit2 size={14} /></button>
                <button className={styles.iconBtn} onClick={() => remove(item.id)} style={{ color: '#EF4444' }}><Trash2 size={14} /></button>
              </div>
            </div>

            <div className={styles.cardStats}>
              <div className={styles.stat}><span className={styles.statVal}>{item.daily}</span><span className={styles.statLabel}>Diário</span></div>
              <div className={styles.statDiv} />
              <div className={styles.stat}><span className={styles.statVal}>{item.weekly}</span><span className={styles.statLabel}>Semanal</span></div>
              <div className={styles.statDiv} />
              <div className={styles.stat}><span className={styles.statVal}>{item.interval}</span><span className={styles.statLabel}>Intervalo</span></div>
            </div>

            <div className={styles.cardSchedule}>
              <div className={styles.schedRow}>
                <span className={styles.schedKey}>Horário</span>
                <span className={styles.schedVal}>{item.entry} → {item.exit}</span>
              </div>
              <div className={styles.schedRow}>
                <span className={styles.schedKey}>Dias</span>
                <span className={styles.schedVal}>{item.days}</span>
              </div>
              <div className={styles.schedRow}>
                <span className={styles.schedKey}>Funcionários</span>
                <span className={styles.schedVal}>{item.employees} alocados</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? 'Editar Jornada' : 'Nova Jornada de Trabalho'}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(false)}>Cancelar</Button>
            <Button variant="primary" onClick={save}>{editing ? 'Salvar Alterações' : 'Criar Jornada'}</Button>
          </>
        }
      >
        <div className={styles.formGrid}>
          <div style={{ gridColumn: '1 / -1' }}>
            <Input label="Nome da Jornada" value={form.name} onChange={e => f('name', e.target.value)} placeholder="Ex: Jornada Padrão CLT" required />
          </div>
          <Select label="Tipo" value={form.type} onChange={e => f('type', e.target.value)}
            options={[
              { value: 'commercial', label: 'Comercial' },
              { value: 'shift',      label: 'Turno' },
              { value: 'flex',       label: 'Flexível' },
              { value: 'night',      label: 'Noturno' },
            ]}
          />
          <Select label="Dias da semana" value={form.days} onChange={e => f('days', e.target.value)}
            options={[
              { value: 'Seg–Sex',  label: 'Segunda a Sexta (5x2)' },
              { value: 'Seg–Sáb', label: 'Segunda a Sábado (6x1)' },
              { value: '12x36',   label: 'Plantão 12x36' },
              { value: 'Custom',  label: 'Personalizado' },
            ]}
          />
          <Input label="Entrada" type="time" value={form.entry} onChange={e => f('entry', e.target.value)} />
          <Input label="Saída"   type="time" value={form.exit}  onChange={e => f('exit', e.target.value)} />
          <Input label="Duração diária"  value={form.daily}    onChange={e => f('daily', e.target.value)} placeholder="08h00" />
          <Input label="Duração semanal" value={form.weekly}   onChange={e => f('weekly', e.target.value)} placeholder="44h" />
          <Input label="Intervalo"       value={form.interval} onChange={e => f('interval', e.target.value)} placeholder="01h00" />
        </div>
      </Modal>
    </div>
  )
}
