import { useState } from 'react'
import { Building2, Clock, Users, Bell, Plug } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { useToast } from '../../components/ui/ToastContainer'
import { useAuth } from '../../context/AuthContext'
import styles from './Settings.module.css'

const TABS = [
  { id: 'empresa',       label: 'Empresa',              icon: Building2 },
  { id: 'escalas',       label: 'Escalas de Trabalho',  icon: Clock },
  { id: 'usuarios',      label: 'Usuários e Acesso',    icon: Users },
  { id: 'notificacoes',  label: 'Notificações',         icon: Bell },
  { id: 'integracoes',   label: 'Integrações',          icon: Plug },
]

function EmpresaTab({ toast, user }) {
  const [form, setForm] = useState({
    name: user?.company || 'Empresa Modelo Ltda',
    cnpj: user?.cnpj   || '12.345.678/0001-90',
    address: 'Av. Paulista, 1000 — São Paulo, SP',
    phone: '(11) 3000-0000',
    email: 'rh@empresa.com.br',
    timezone: 'America/Sao_Paulo',
  })
  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionTitle}>Dados da Empresa</div>
      <div className={styles.formGrid}>
        <Input label="Razão Social" value={form.name}    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        <Input label="CNPJ"        value={form.cnpj}    onChange={e => setForm(f => ({ ...f, cnpj: e.target.value }))} />
        <Input label="Endereço"    value={form.address}  onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
        <Input label="Telefone"    value={form.phone}    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
        <Input label="E-mail RH"   value={form.email}    onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" />
        <Select label="Fuso Horário" value={form.timezone} onChange={e => setForm(f => ({ ...f, timezone: e.target.value }))}
          options={[
            { value: 'America/Sao_Paulo',  label: 'Brasília (GMT-3)' },
            { value: 'America/Manaus',     label: 'Manaus (GMT-4)' },
            { value: 'America/Belem',      label: 'Belém (GMT-3)' },
          ]}
        />
      </div>
      <Button variant="primary" onClick={() => toast('Dados da empresa salvos!', 'success')}>Salvar Alterações</Button>
    </div>
  )
}

function EscalasTab({ toast }) {
  const schedules = [
    { id: 1, name: 'Padrão 44h',    entry: '08:00', exit: '17:00', break: '60min', days: 'Seg–Sex' },
    { id: 2, name: 'Turno manhã',   entry: '06:00', exit: '14:00', break: '30min', days: 'Seg–Sáb' },
    { id: 3, name: 'Administrativo',entry: '09:00', exit: '18:00', break: '60min', days: 'Seg–Sex' },
  ]
  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>Escalas Cadastradas</div>
        <Button variant="secondary" size="sm">+ Nova Escala</Button>
      </div>
      <div className={styles.scheduleList}>
        {schedules.map(s => (
          <div key={s.id} className={styles.scheduleRow}>
            <div className={styles.schName}>{s.name}</div>
            <div className={styles.schMeta}>{s.days} · {s.entry}–{s.exit} · Intervalo: {s.break}</div>
            <div className={styles.schActions}>
              <button className={styles.linkBtn} onClick={() => toast('Editar escala em breve!', 'warning')}>Editar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function UsuariosTab({ toast }) {
  const users = [
    { name: 'Mariana Costa',  email: 'mariana@empresa.com.br', role: 'Administrador', status: 'active' },
    { name: 'Carlos Almeida', email: 'carlos@empresa.com.br',  role: 'Gestor RH',     status: 'active' },
    { name: 'Fernanda Lima',  email: 'fernanda@empresa.com.br',role: 'Visualizador',  status: 'inactive' },
  ]
  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>Usuários do Sistema</div>
        <Button variant="secondary" size="sm" onClick={() => toast('Convite enviado!', 'success')}>+ Convidar Usuário</Button>
      </div>
      <div className={styles.userList}>
        {users.map(u => (
          <div key={u.email} className={styles.userRow}>
            <div className={styles.userAvatar}>{u.name.split(' ').map(p=>p[0]).join('').slice(0,2)}</div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{u.name}</div>
              <div className={styles.userEmail}>{u.email}</div>
            </div>
            <span className={[styles.roleBadge, u.role === 'Administrador' ? styles.admin : ''].join(' ')}>{u.role}</span>
            <span className={[styles.statusDot, u.status === 'active' ? styles.active : styles.inactive].join(' ')} />
          </div>
        ))}
      </div>
    </div>
  )
}

function NotifTab({ toast }) {
  const [n, setN] = useState({ lates: true, absences: true, overtime: false, pending: true, digest: true })
  const items = [
    { key: 'lates',    label: 'Alertas de Atraso',          desc: 'Notificar quando funcionário chegar atrasado' },
    { key: 'absences', label: 'Alertas de Falta',           desc: 'Notificar quando funcionário não registrar entrada' },
    { key: 'overtime', label: 'Alertas de Hora Extra',      desc: 'Notificar quando hora extra for registrada' },
    { key: 'pending',  label: 'Solicitações Pendentes',     desc: 'Lembrete de ajustes aguardando aprovação' },
    { key: 'digest',   label: 'Resumo Diário',              desc: 'Receber resumo do dia às 18h por e-mail' },
  ]
  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionTitle}>Preferências de Notificação</div>
      <div className={styles.notifList}>
        {items.map(item => (
          <div key={item.key} className={styles.notifRow}>
            <div>
              <div className={styles.notifLabel}>{item.label}</div>
              <div className={styles.notifDesc}>{item.desc}</div>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={n[item.key]}
                onChange={e => setN(prev => ({ ...prev, [item.key]: e.target.checked }))}
                style={{ display: 'none' }}
              />
              <span className={[styles.toggleTrack, n[item.key] ? styles.toggleOn : ''].join(' ')}>
                <span className={styles.toggleThumb} />
              </span>
            </label>
          </div>
        ))}
      </div>
      <Button variant="primary" onClick={() => toast('Notificações salvas!', 'success')}>Salvar Preferências</Button>
    </div>
  )
}

function IntegracoesTab({ toast }) {
  const integrations = [
    { name: 'Folha de Pagamento',  provider: 'Folhamatic',   connected: true },
    { name: 'ERP',                 provider: 'TOTVS Protheus',connected: false },
    { name: 'Google Workspace',    provider: 'Google',        connected: true },
    { name: 'Slack',               provider: 'Slack',         connected: false },
  ]
  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionTitle}>Integrações Disponíveis</div>
      <div className={styles.integList}>
        {integrations.map(i => (
          <div key={i.name} className={styles.integRow}>
            <div>
              <div className={styles.integName}>{i.name}</div>
              <div className={styles.integProvider}>{i.provider}</div>
            </div>
            <Button
              variant={i.connected ? 'ghost' : 'secondary'}
              size="sm"
              onClick={() => toast(i.connected ? `${i.name} desconectado.` : `${i.name} conectado!`, i.connected ? 'warning' : 'success')}
            >
              {i.connected ? 'Desconectar' : 'Conectar'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Settings() {
  const toast = useToast()
  const { user } = useAuth()
  const [tab, setTab] = useState('empresa')

  const tabComponents = {
    empresa:      <EmpresaTab toast={toast} user={user} />,
    escalas:      <EscalasTab toast={toast} />,
    usuarios:     <UsuariosTab toast={toast} />,
    notificacoes: <NotifTab toast={toast} />,
    integracoes:  <IntegracoesTab toast={toast} />,
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Configurações</h1>
        <p className={styles.sub}>Gerencie as configurações da sua empresa no Ativus</p>
      </div>

      <div className={styles.layout}>
        <Card className={styles.tabList} padding="sm">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={[styles.tabBtn, tab === id ? styles.tabActive : ''].join(' ')}
              onClick={() => setTab(id)}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </Card>
        <Card className={styles.tabPanel}>
          {tabComponents[tab]}
        </Card>
      </div>
    </div>
  )
}
