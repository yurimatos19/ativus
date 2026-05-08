import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Clock, FileText, BarChart2,
  Settings, LogOut, FileBadge, CheckSquare, ChevronRight,
  Smartphone, CalendarDays, Repeat2, ShieldCheck, Wallet, AlertTriangle, CalendarRange, ClipboardList,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../ui/Avatar'
import styles from './Sidebar.module.css'

const NAV_GROUPS = [
  {
    label: 'Principal',
    items: [
      { to: '/dashboard',       icon: LayoutDashboard, label: 'Painel de Controle' },
    ],
  },
  {
    label: 'Cadastros',
    items: [
      { to: '/funcionarios',    icon: Users,           label: 'Funcionários' },
      { to: '/jornadas',        icon: CalendarDays,    label: 'Jornadas' },
      { to: '/escalas',         icon: Repeat2,         label: 'Escalas' },
      { to: '/politicas',       icon: ShieldCheck,     label: 'Políticas de Ponto' },
    ],
  },
  {
    label: 'Controle',
    items: [
      { to: '/agenda',          icon: CalendarRange,   label: 'Agenda' },
      { to: '/tarefas',         icon: ClipboardList,   label: 'Tarefas' },
      { to: '/registros',       icon: Clock,           label: 'Registros de Ponto' },
      { to: '/espelho',         icon: FileText,        label: 'Espelho de Ponto' },
      { to: '/ajustes',         icon: CheckSquare,     label: 'Ajustes' },
      { to: '/banco-de-horas',  icon: Wallet,          label: 'Banco de Horas' },
      { to: '/ocorrencias',     icon: AlertTriangle,   label: 'Ocorrências' },
    ],
  },
  {
    label: 'Relatórios',
    items: [
      { to: '/relatorios',      icon: BarChart2,       label: 'Relatórios' },
      { to: '/arquivos-legais', icon: FileBadge,       label: 'Arquivos Legais' },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { to: '/configuracoes',   icon: Settings,        label: 'Configurações' },
      { to: '/app-mobile',      icon: Smartphone,      label: 'App Mobile' },
    ],
  },
]

function useClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return time
}

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const now = useClock()

  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside className={[styles.sidebar, collapsed ? styles.collapsed : ''].join(' ')}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIconWrap}>
          <img src="/assets/logo.png" alt="Ativus" className={styles.logoImg} />
        </div>
        {!collapsed && (
          <div>
            <div className={styles.logoText}>Ativus</div>
            <div className={styles.logoSub}>Do ponto à produtividade</div>
          </div>
        )}
        <button className={styles.collapseBtn} onClick={onToggle} title={collapsed ? 'Expandir' : 'Recolher'}>
          <ChevronRight size={14} className={collapsed ? '' : styles.rotated} />
        </button>
      </div>

      {/* Clock */}
      {!collapsed && (
        <div className={styles.clock}>
          <div className={styles.clockLabel}>Horário atual</div>
          <div className={styles.clockTime}>{timeStr}</div>
          <div className={styles.clockDate}>{dateStr}</div>
        </div>
      )}

      {/* Nav */}
      <nav className={styles.nav}>
        {NAV_GROUPS.map(group => (
          <div key={group.label} className={styles.navGroup}>
            {!collapsed && (
              <div className={styles.navGroupLabel}>{group.label}</div>
            )}
            {group.items.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                target={to === '/app-mobile' ? '_blank' : undefined}
                className={({ isActive }) =>
                  [styles.navItem, isActive ? styles.active : ''].join(' ')
                }
                title={collapsed ? label : undefined}
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span className={styles.activeBar} />}
                    <Icon size={15} className={styles.navIcon} />
                    {!collapsed && <span className={styles.navLabel}>{label}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User area */}
      <div className={styles.user}>
        {user && (
          <>
            <Avatar name={user.name} size="sm" />
            {!collapsed && (
              <div className={styles.userInfo}>
                <div className={styles.userName}>{user.name}</div>
                <div className={styles.userRole}>{user.role}</div>
              </div>
            )}
            <button className={styles.logoutBtn} onClick={handleLogout} title="Sair">
              <LogOut size={14} />
            </button>
          </>
        )}
      </div>
    </aside>
  )
}
