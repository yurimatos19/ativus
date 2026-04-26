import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Filter } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { useToast } from '../../components/ui/ToastContainer'
import { EMPLOYEES, DEPARTMENTS, STATUS_LABELS } from '../../data/mock'
import styles from './Employees.module.css'

const DEPT_OPTIONS = [{ value: '', label: 'Todos' }, ...DEPARTMENTS.map(d => ({ value: d, label: d }))]
const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'online',   label: 'Trabalhando' },
  { value: 'late',     label: 'Atrasado' },
  { value: 'absent',   label: 'Falta' },
  { value: 'offline',  label: 'Encerrado' },
]

export default function Employees() {
  const navigate = useNavigate()
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [dept, setDept] = useState('')
  const [status, setStatus] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', cpf: '', role: '', dept: '', schedule: '', workload: '' })

  const filtered = EMPLOYEES.filter(e => {
    const matchQ = !query || e.name.toLowerCase().includes(query.toLowerCase()) || e.role.toLowerCase().includes(query.toLowerCase())
    const matchD = !dept   || e.dept === dept
    const matchS = !status || e.status === status
    return matchQ && matchD && matchS
  })

  const handleSave = () => {
    toast('Funcionário cadastrado com sucesso!', 'success')
    setShowModal(false)
    setForm({ name: '', email: '', cpf: '', role: '', dept: '', schedule: '', workload: '' })
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Funcionários</h1>
          <p className={styles.sub}>{EMPLOYEES.length} colaboradores cadastrados</p>
        </div>
        <Button variant="primary" icon={<Plus size={15} />} onClick={() => setShowModal(true)}>
          Novo Funcionário
        </Button>
      </div>

      {/* Filters */}
      <Card className={styles.filtersCard}>
        <div className={styles.filters}>
          <div className={styles.searchWrap}>
            <Search size={14} className={styles.searchIcon} />
            <input
              className={styles.search}
              placeholder="Buscar por nome ou cargo..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <Select
            value={dept}
            onChange={e => setDept(e.target.value)}
            options={DEPT_OPTIONS}
            placeholder="Departamento"
          />
          <Select
            value={status}
            onChange={e => setStatus(e.target.value)}
            options={STATUS_OPTIONS}
            placeholder="Status"
          />
          <Button variant="subtle" size="sm" icon={<Filter size={13} />}>Filtros</Button>
        </div>
        <div className={styles.count}>{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</div>
      </Card>

      {/* Table */}
      <Card padding="none">
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Funcionário</th>
              <th>Cargo</th>
              <th>Departamento</th>
              <th>Jornada</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(emp => {
              const s = STATUS_LABELS[emp.status]
              return (
                <tr key={emp.id} className={styles.row} onClick={() => navigate(`/funcionarios/${emp.id}`)}>
                  <td>
                    <div className={styles.nameCell}>
                      <Avatar name={emp.name} size="sm" />
                      <div>
                        <div className={styles.empName}>{emp.name}</div>
                        <div className={styles.empEmail}>{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className={styles.role}>{emp.role}</td>
                  <td><Badge variant="neutral">{emp.dept}</Badge></td>
                  <td className={styles.schedule}>{emp.schedule}</td>
                  <td><Badge variant={s.variant} dot>{s.label}</Badge></td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className={styles.actions}>
                      <button className={styles.actionBtn} onClick={() => navigate(`/funcionarios/${emp.id}`)}>Ver</button>
                      <button className={styles.actionBtn} onClick={() => navigate(`/espelho?emp=${emp.id}`)}>Espelho</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className={styles.empty}>Nenhum funcionário encontrado.</div>
        )}
      </Card>

      {/* Modal novo funcionário */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Novo Funcionário"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSave}>Cadastrar Funcionário</Button>
          </>
        }
      >
        <div className={styles.formGrid}>
          <Input label="Nome completo" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="João da Silva" required />
          <Input label="CPF" value={form.cpf} onChange={e => setForm(f => ({ ...f, cpf: e.target.value }))} placeholder="000.000.000-00" />
          <Input label="E-mail corporativo" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="joao@empresa.com.br" type="email" />
          <Input label="Cargo" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="Analista de Vendas" />
          <Select label="Departamento" value={form.dept} onChange={e => setForm(f => ({ ...f, dept: e.target.value }))} options={DEPARTMENTS.map(d => ({ value: d, label: d }))} placeholder="Selecione..." />
          <Input label="Jornada (ex: 08:00–17:00)" value={form.schedule} onChange={e => setForm(f => ({ ...f, schedule: e.target.value }))} placeholder="08:00–17:00" />
          <Input label="Carga horária semanal" value={form.workload} onChange={e => setForm(f => ({ ...f, workload: e.target.value }))} placeholder="44h/semana" />
          <Input label="Data de admissão" type="date" value={form.admission} onChange={e => setForm(f => ({ ...f, admission: e.target.value }))} />
        </div>
      </Modal>
    </div>
  )
}
