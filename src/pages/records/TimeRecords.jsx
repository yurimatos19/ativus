import { useState } from 'react'
import { Search, Plus, Edit2, MessageSquare, CheckCircle } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { useToast } from '../../components/ui/ToastContainer'
import { EMPLOYEES, TIME_RECORDS } from '../../data/mock'
import styles from './TimeRecords.module.css'

export default function TimeRecords() {
  const toast = useToast()
  const [dateFrom, setDateFrom] = useState('2026-04-01')
  const [dateTo,   setDateTo]   = useState('2026-04-24')
  const [query,    setQuery]    = useState('')
  const [editModal, setEditModal] = useState(null)

  const filtered = TIME_RECORDS.filter(r => {
    const emp = EMPLOYEES.find(e => e.id === r.employeeId)
    const matchDate = r.date >= dateFrom && r.date <= dateTo
    const matchQ = !query || emp?.name.toLowerCase().includes(query.toLowerCase())
    return matchDate && matchQ
  }).slice(0, 40)

  const statusInfo = {
    normal:   { label: 'Normal',   variant: 'success' },
    late:     { label: 'Atraso',   variant: 'warning' },
    overtime: { label: 'H. Extra', variant: 'info' },
    absent:   { label: 'Falta',    variant: 'error' },
  }

  const handleSaveEdit = () => {
    toast('Registro atualizado com sucesso!', 'success')
    setEditModal(null)
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Registros de Ponto</h1>
          <p className={styles.sub}>{filtered.length} registros encontrados</p>
        </div>
        <Button variant="primary" icon={<Plus size={15} />} onClick={() => toast('Funcionalidade em breve!', 'warning')}>
          Novo Registro
        </Button>
      </div>

      {/* Filters */}
      <Card className={styles.filters}>
        <div className={styles.filtersRow}>
          <div className={styles.searchWrap}>
            <Search size={14} className={styles.searchIcon} />
            <input
              className={styles.search}
              placeholder="Buscar funcionário..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <div className={styles.dateRange}>
            <Input label="De" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            <Input label="Até" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Funcionário</th>
                <th>Data</th>
                <th>Entrada</th>
                <th>Intervalo</th>
                <th>Saída</th>
                <th>Total</th>
                <th>Saldo</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const emp = EMPLOYEES.find(e => e.id === r.employeeId)
                const si = statusInfo[r.status] || { label: r.status, variant: 'neutral' }
                const dateObj = new Date(r.date + 'T00:00:00')
                const dateLabel = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', weekday: 'short' })
                return (
                  <tr key={r.id} className={styles.row}>
                    <td>
                      <div className={styles.nameCell}>
                        <Avatar name={emp?.name || ''} size="xs" />
                        <span className={styles.empName}>{emp?.name}</span>
                      </div>
                    </td>
                    <td className={styles.mono}>{dateLabel}</td>
                    <td className={styles.mono}>{r.entry || '—'}</td>
                    <td className={styles.mono}>{r.breakStart ? `${r.breakStart}–${r.breakEnd}` : '—'}</td>
                    <td className={styles.mono}>{r.exit || '—'}</td>
                    <td className={styles.mono}>{r.total}</td>
                    <td className={styles.mono} style={{ color: r.balance?.startsWith('+') ? '#15803D' : r.balance === '—' ? undefined : '#991B1B' }}>
                      {r.balance || '—'}
                    </td>
                    <td><Badge variant={si.variant}>{si.label}</Badge></td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.actionBtn} title="Editar" onClick={() => setEditModal(r)}>
                          <Edit2 size={13} />
                        </button>
                        {r.status === 'absent' && (
                          <button className={styles.actionBtn} title="Justificar" onClick={() => toast('Solicitação de justificativa enviada.', 'success')}>
                            <MessageSquare size={13} />
                          </button>
                        )}
                        {r.status === 'overtime' && (
                          <button className={styles.actionBtn} title="Aprovar H. Extra" style={{ color: '#39B54A' }} onClick={() => toast('Hora extra aprovada!', 'success')}>
                            <CheckCircle size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit modal */}
      {editModal && (
        <Modal
          open={!!editModal}
          onClose={() => setEditModal(null)}
          title="Editar Registro de Ponto"
          size="sm"
          footer={
            <>
              <Button variant="ghost" onClick={() => setEditModal(null)}>Cancelar</Button>
              <Button variant="primary" onClick={handleSaveEdit}>Salvar Alterações</Button>
            </>
          }
        >
          <div className={styles.editGrid}>
            <Input label="Entrada"    type="time" defaultValue={editModal.entry || ''} />
            <Input label="Intervalo início" type="time" defaultValue={editModal.breakStart || ''} />
            <Input label="Intervalo fim"    type="time" defaultValue={editModal.breakEnd  || ''} />
            <Input label="Saída"     type="time" defaultValue={editModal.exit  || ''} />
            <div style={{ gridColumn: '1 / -1' }}>
              <Input label="Motivo da alteração" placeholder="Descreva o motivo..." />
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
