import { useState } from 'react'
import { CheckCircle, XCircle, Eye } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Select from '../../components/ui/Select'
import { useToast } from '../../components/ui/ToastContainer'
import { EMPLOYEES, ADJUSTMENTS } from '../../data/mock'
import styles from './Adjustments.module.css'

const TYPE_OPTIONS   = [{ value: '', label: 'Todos os tipos' }, ...['Falta','Atraso','H. Extra','Ajuste'].map(v => ({ value: v, label: v }))]
const STATUS_OPTIONS = [
  { value: '', label: 'Todos os status' },
  { value: 'pending',  label: 'Pendente' },
  { value: 'approved', label: 'Aprovado' },
  { value: 'rejected', label: 'Rejeitado' },
]

const STATUS_BADGE = {
  pending:  { label: 'Pendente',  variant: 'warning' },
  approved: { label: 'Aprovado', variant: 'success' },
  rejected: { label: 'Rejeitado',variant: 'error' },
}

export default function Adjustments() {
  const toast = useToast()
  const [adjList, setAdjList] = useState(ADJUSTMENTS)
  const [typeFilter,   setTypeFilter]   = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [detail, setDetail] = useState(null)
  const [comment, setComment] = useState('')

  const filtered = adjList.filter(a => {
    return (!typeFilter || a.type === typeFilter) && (!statusFilter || a.status === statusFilter)
  })

  const pending = adjList.filter(a => a.status === 'pending').length

  const handle = (id, action) => {
    setAdjList(prev => prev.map(a => a.id === id ? { ...a, status: action } : a))
    toast(action === 'approved' ? 'Solicitação aprovada!' : 'Solicitação rejeitada.', action === 'approved' ? 'success' : 'error')
    setDetail(null)
  }

  const urgencyColors = { high: '#EF4444', medium: '#F59E0B', low: '#39B54A' }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Ajustes e Aprovações</h1>
          <p className={styles.sub}>{pending} solicitações pendentes de revisão</p>
        </div>
      </div>

      {/* Summary */}
      <div className={styles.summaryRow}>
        {[
          { label: 'Pendentes',  count: adjList.filter(a=>a.status==='pending').length,  color: '#F59E0B', bg: '#FEF3C7' },
          { label: 'Aprovadas',  count: adjList.filter(a=>a.status==='approved').length, color: '#39B54A', bg: '#DCFCE7' },
          { label: 'Rejeitadas', count: adjList.filter(a=>a.status==='rejected').length, color: '#EF4444', bg: '#FEE2E2' },
          { label: 'Total',      count: adjList.length,                                  color: '#1565C0', bg: '#DBEAFE' },
        ].map(({ label, count, color, bg }) => (
          <Card key={label} className={styles.summaryCard}>
            <div className={styles.summaryNum} style={{ color }}>{count}</div>
            <div className={styles.summaryLabel}>{label}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className={styles.filtersCard}>
        <Select value={typeFilter}   onChange={e => setTypeFilter(e.target.value)}   options={TYPE_OPTIONS} />
        <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} options={STATUS_OPTIONS} />
      </Card>

      {/* List */}
      <Card padding="none">
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Funcionário</th>
              <th>Tipo</th>
              <th>Data</th>
              <th>Justificativa</th>
              <th>Solicitado em</th>
              <th>Urgência</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(adj => {
              const emp = EMPLOYEES.find(e => e.id === adj.employeeId)
              const sb  = STATUS_BADGE[adj.status]
              return (
                <tr key={adj.id} className={styles.row}>
                  <td>
                    <div className={styles.nameCell}>
                      <Avatar name={emp?.name || ''} size="xs" />
                      <span className={styles.empName}>{emp?.name}</span>
                    </div>
                  </td>
                  <td><Badge variant="neutral">{adj.type}</Badge></td>
                  <td className={styles.mono}>{adj.date}</td>
                  <td className={styles.reason}>{adj.reason}</td>
                  <td className={styles.mono}>{adj.requestedAt}</td>
                  <td>
                    <span className={styles.urgencyDot} style={{ background: urgencyColors[adj.urgency] }} />
                    <span className={styles.urgencyLabel}>{adj.urgency === 'high' ? 'Alta' : adj.urgency === 'medium' ? 'Média' : 'Baixa'}</span>
                  </td>
                  <td><Badge variant={sb.variant}>{sb.label}</Badge></td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.iconBtn} title="Ver detalhes" onClick={() => { setDetail(adj); setComment('') }}>
                        <Eye size={14} />
                      </button>
                      {adj.status === 'pending' && (
                        <>
                          <button className={[styles.iconBtn, styles.approve].join(' ')} title="Aprovar" onClick={() => handle(adj.id, 'approved')}>
                            <CheckCircle size={14} />
                          </button>
                          <button className={[styles.iconBtn, styles.reject].join(' ')} title="Rejeitar" onClick={() => handle(adj.id, 'rejected')}>
                            <XCircle size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className={styles.empty}>Nenhuma solicitação encontrada.</div>}
      </Card>

      {/* Detail modal */}
      {detail && (() => {
        const emp = EMPLOYEES.find(e => e.id === detail.employeeId)
        const sb  = STATUS_BADGE[detail.status]
        return (
          <Modal
            open={!!detail}
            onClose={() => setDetail(null)}
            title="Detalhes da Solicitação"
            size="md"
            footer={detail.status === 'pending' ? (
              <>
                <Button variant="ghost" onClick={() => setDetail(null)}>Fechar</Button>
                <Button variant="danger" onClick={() => handle(detail.id, 'rejected')}>Rejeitar</Button>
                <Button variant="primary" onClick={() => handle(detail.id, 'approved')}>Aprovar</Button>
              </>
            ) : (
              <Button variant="ghost" onClick={() => setDetail(null)}>Fechar</Button>
            )}
          >
            <div className={styles.detailBody}>
              <div className={styles.detailRow}>
                <Avatar name={emp?.name || ''} size="md" />
                <div>
                  <div className={styles.detailName}>{emp?.name}</div>
                  <div className={styles.detailRole}>{emp?.role} · {emp?.dept}</div>
                </div>
                <Badge variant={sb.variant}>{sb.label}</Badge>
              </div>
              <div className={styles.detailGrid}>
                <div><span className={styles.dlabel}>Tipo</span><span>{detail.type}</span></div>
                <div><span className={styles.dlabel}>Data</span><span>{detail.date}</span></div>
                <div><span className={styles.dlabel}>Solicitado em</span><span>{detail.requestedAt}</span></div>
                <div><span className={styles.dlabel}>Urgência</span><span>{detail.urgency}</span></div>
              </div>
              <div>
                <div className={styles.dlabel}>Justificativa</div>
                <div className={styles.detailReason}>{detail.reason}</div>
              </div>
              {detail.attachment && (
                <div className={styles.attachment}>
                  📎 Anexo: <span className={styles.attachName}>{detail.attachment}</span>
                </div>
              )}
              {detail.status === 'pending' && (
                <div>
                  <div className={styles.dlabel}>Comentário (opcional)</div>
                  <textarea
                    className={styles.textarea}
                    rows={3}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Adicione um comentário para o funcionário..."
                  />
                </div>
              )}
            </div>
          </Modal>
        )
      })()}
    </div>
  )
}
