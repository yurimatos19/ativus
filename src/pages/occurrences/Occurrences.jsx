import { useState } from 'react'
import { Plus, Filter, Eye, CheckCircle, XCircle, AlertTriangle, FileText, Clock, Coffee, Umbrella } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Avatar from '../../components/ui/Avatar'
import { useToast } from '../../components/ui/ToastContainer'
import styles from './Occurrences.module.css'

const TYPE_META = {
  absence:    { label: 'Falta',           icon: XCircle,      variant: 'error',   color: '#EF4444' },
  late:       { label: 'Atraso',          icon: Clock,        variant: 'warning', color: '#F59E0B' },
  medical:    { label: 'Atestado',        icon: FileText,     variant: 'info',    color: '#1565C0' },
  dayoff:     { label: 'Folga',           icon: Coffee,       variant: 'success', color: '#39B54A' },
  vacation:   { label: 'Férias',          icon: Umbrella,     variant: 'neutral', color: '#7B1FA2' },
  incident:   { label: 'Incidente',       icon: AlertTriangle,variant: 'error',   color: '#E65100' },
}

const STATUS_META = {
  pending:  { label: 'Pendente',  variant: 'warning' },
  approved: { label: 'Aprovado',  variant: 'success' },
  rejected: { label: 'Rejeitado', variant: 'error' },
}

const INITIAL = [
  { id: 1, employee: 'Carlos Alberto Souza', role: 'Operador',    type: 'absence',  date: '2026-04-22', status: 'pending',  reason: 'Não compareceu sem justificativa', days: 1  },
  { id: 2, employee: 'Ana Paula Ferreira',   role: 'Auxiliar',    type: 'medical',  date: '2026-04-20', status: 'approved', reason: 'Atestado médico 2 dias — gripe',   days: 2  },
  { id: 3, employee: 'Roberto Lima',         role: 'Supervisor',  type: 'late',     date: '2026-04-23', status: 'pending',  reason: 'Atraso de 47 minutos',            days: null },
  { id: 4, employee: 'Fernanda Rocha',       role: 'Coordenador', type: 'dayoff',   date: '2026-04-25', status: 'approved', reason: 'Folga compensatória aprovada',     days: 1  },
  { id: 5, employee: 'Lucas Mendes',         role: 'Operador',    type: 'absence',  date: '2026-04-18', status: 'rejected', reason: 'Falta sem comunicação prévia',     days: 1  },
  { id: 6, employee: 'Camila Santos',        role: 'Assistente',  type: 'medical',  date: '2026-04-15', status: 'approved', reason: 'Consulta médica especialista',     days: 1  },
  { id: 7, employee: 'João Pedro Alves',     role: 'Técnico',     type: 'incident', date: '2026-04-10', status: 'pending',  reason: 'Saída antecipada sem autorização', days: null },
  { id: 8, employee: 'Mariana Costa',        role: 'Analista RH', type: 'vacation', date: '2026-04-01', status: 'approved', reason: 'Férias anuais — 30 dias',          days: 30 },
]

const emptyForm = { employee: '', type: 'absence', date: '', reason: '', days: '', status: 'pending' }

export default function Occurrences() {
  const toast = useToast()
  const [items, setItems] = useState(INITIAL)
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [modal, setModal] = useState(false)
  const [detailModal, setDetailModal] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const filtered = items.filter(i => {
    if (filterType !== 'all' && i.type !== filterType) return false
    if (filterStatus !== 'all' && i.status !== filterStatus) return false
    return true
  })

  const counts = Object.fromEntries(
    Object.keys(TYPE_META).map(k => [k, items.filter(i => i.type === k).length])
  )

  const approve = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'approved' } : i))
    toast('Ocorrência aprovada.', 'success')
    setDetailModal(null)
  }

  const reject = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'rejected' } : i))
    toast('Ocorrência rejeitada.', 'warning')
    setDetailModal(null)
  }

  const save = () => {
    if (!form.employee || !form.date || !form.reason) return
    setItems(prev => [...prev, { ...form, id: Date.now(), days: form.days ? +form.days : null }])
    toast('Ocorrência registrada!', 'success')
    setModal(false)
  }

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Ocorrências</h1>
          <p className={styles.sub}>Gerencie faltas, atestados, atrasos e folgas dos funcionários</p>
        </div>
        <Button variant="primary" icon={<Plus size={15} />} onClick={() => { setForm(emptyForm); setModal(true) }}>
          Nova Ocorrência
        </Button>
      </div>

      {/* Type pills */}
      <div className={styles.typePills}>
        {Object.entries(TYPE_META).map(([k, meta]) => {
          const Icon = meta.icon
          return (
            <button
              key={k}
              className={[styles.typePill, filterType === k ? styles.pillActive : ''].join(' ')}
              style={filterType === k ? { borderColor: meta.color, color: meta.color, background: meta.color + '15' } : {}}
              onClick={() => setFilterType(prev => prev === k ? 'all' : k)}
            >
              <Icon size={13} />
              {meta.label} <span className={styles.pillCount}>{counts[k]}</span>
            </button>
          )
        })}
      </div>

      {/* Status filter */}
      <div className={styles.statusFilter}>
        {[
          { val: 'all', label: 'Todas' },
          { val: 'pending', label: `Pendentes (${items.filter(i => i.status === 'pending').length})` },
          { val: 'approved', label: 'Aprovadas' },
          { val: 'rejected', label: 'Rejeitadas' },
        ].map(opt => (
          <button
            key={opt.val}
            className={[styles.statusBtn, filterStatus === opt.val ? styles.statusActive : ''].join(' ')}
            onClick={() => setFilterStatus(opt.val)}
          >
            {opt.label}
          </button>
        ))}
        <span className={styles.resultCount}>{filtered.length} ocorrência{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <Card>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Funcionário</th>
              <th>Tipo</th>
              <th>Data</th>
              <th>Dias</th>
              <th>Motivo</th>
              <th>Status</th>
              <th className={styles.actCol}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className={styles.empty}>Nenhuma ocorrência encontrada.</td></tr>
            ) : filtered.map(item => {
              const meta = TYPE_META[item.type]
              const Icon = meta.icon
              return (
                <tr key={item.id}>
                  <td>
                    <div className={styles.empCell}>
                      <Avatar name={item.employee} size="xs" />
                      <div>
                        <div className={styles.empName}>{item.employee}</div>
                        <div className={styles.empRole}>{item.role}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.typeCell}>
                      <Icon size={13} color={meta.color} />
                      <span style={{ color: meta.color, fontWeight: 600, fontSize: 12 }}>{meta.label}</span>
                    </div>
                  </td>
                  <td className={styles.mono}>{item.date}</td>
                  <td className={styles.mono}>{item.days != null ? `${item.days}d` : '—'}</td>
                  <td className={styles.reasonCell}>{item.reason}</td>
                  <td><Badge variant={STATUS_META[item.status].variant}>{STATUS_META[item.status].label}</Badge></td>
                  <td className={styles.actCol}>
                    <div className={styles.actions}>
                      <button className={styles.iconBtn} onClick={() => setDetailModal(item)} title="Ver detalhes"><Eye size={14} /></button>
                      {item.status === 'pending' && (
                        <>
                          <button className={styles.iconBtn} style={{ color: '#16A34A' }} onClick={() => approve(item.id)} title="Aprovar"><CheckCircle size={14} /></button>
                          <button className={styles.iconBtn} style={{ color: '#EF4444' }} onClick={() => reject(item.id)} title="Rejeitar"><XCircle size={14} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>

      {/* Detail modal */}
      {detailModal && (
        <Modal
          open={true}
          onClose={() => setDetailModal(null)}
          title="Detalhes da Ocorrência"
          size="sm"
          footer={
            <>
              <Button variant="ghost" onClick={() => setDetailModal(null)}>Fechar</Button>
              {detailModal.status === 'pending' && (
                <>
                  <Button variant="outline" onClick={() => reject(detailModal.id)}>Rejeitar</Button>
                  <Button variant="primary" onClick={() => approve(detailModal.id)}>Aprovar</Button>
                </>
              )}
            </>
          }
        >
          <div className={styles.detailGrid}>
            {[
              { label: 'Funcionário', val: detailModal.employee },
              { label: 'Cargo',       val: detailModal.role },
              { label: 'Tipo',        val: TYPE_META[detailModal.type].label },
              { label: 'Data',        val: detailModal.date },
              { label: 'Dias',        val: detailModal.days != null ? `${detailModal.days} dia(s)` : '—' },
              { label: 'Status',      val: STATUS_META[detailModal.status].label },
            ].map(row => (
              <div key={row.label} className={styles.detailRow}>
                <span className={styles.detailKey}>{row.label}</span>
                <span className={styles.detailVal}>{row.val}</span>
              </div>
            ))}
            <div className={styles.detailFull}>
              <span className={styles.detailKey}>Motivo / Observação</span>
              <p className={styles.detailReason}>{detailModal.reason}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* New occurrence modal */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Registrar Ocorrência"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(false)}>Cancelar</Button>
            <Button variant="primary" onClick={save}>Registrar</Button>
          </>
        }
      >
        <div className={styles.formGrid}>
          <div style={{ gridColumn: '1 / -1' }}>
            <Input label="Funcionário" value={form.employee} onChange={e => f('employee', e.target.value)} placeholder="Nome do funcionário" required />
          </div>
          <Select label="Tipo" value={form.type} onChange={e => f('type', e.target.value)}
            options={Object.entries(TYPE_META).map(([k, m]) => ({ value: k, label: m.label }))}
          />
          <Input label="Data" type="date" value={form.date} onChange={e => f('date', e.target.value)} />
          <Input label="Duração (dias)" type="number" value={form.days} onChange={e => f('days', e.target.value)} placeholder="Ex: 2" />
          <Select label="Status inicial" value={form.status} onChange={e => f('status', e.target.value)}
            options={[
              { value: 'pending',  label: 'Pendente' },
              { value: 'approved', label: 'Já aprovado' },
            ]}
          />
          <div style={{ gridColumn: '1 / -1' }}>
            <Input label="Motivo / Observação" value={form.reason} onChange={e => f('reason', e.target.value)} placeholder="Descreva o motivo da ocorrência" required />
          </div>
        </div>
      </Modal>
    </div>
  )
}
