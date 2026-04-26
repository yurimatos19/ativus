import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Search, Bell, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../ui/Avatar'
import styles from './TopBar.module.css'

const PAGE_NAMES = {
  '/dashboard':       'Painel de Controle',
  '/funcionarios':    'Funcionários',
  '/jornadas':        'Jornadas de Trabalho',
  '/escalas':         'Escalas de Trabalho',
  '/politicas':       'Políticas de Ponto',
  '/registros':       'Registros de Ponto',
  '/espelho':         'Espelho de Ponto',
  '/ajustes':         'Ajustes e Aprovações',
  '/banco-de-horas':  'Banco de Horas',
  '/ocorrencias':     'Ocorrências',
  '/relatorios':      'Relatórios',
  '/arquivos-legais': 'Arquivos Legais',
  '/configuracoes':   'Configurações',
  '/agenda':          'Agenda da Equipe',
}

export default function TopBar() {
  const { user } = useAuth()
  const location = useLocation()
  const [query, setQuery] = useState('')

  // support dynamic routes like /funcionarios/:id
  const basePath = '/' + location.pathname.split('/').filter(Boolean)[0]
  const pageName = PAGE_NAMES[location.pathname] || PAGE_NAMES[basePath] || 'Ativus'

  return (
    <header className={styles.topbar}>
      <div className={styles.breadcrumb}>
        <span className={styles.crumbHome}>Início</span>
        <ChevronRight size={14} className={styles.crumbSep} />
        <span className={styles.crumbCurrent}>{pageName}</span>
      </div>

      <div className={styles.right}>
        <div className={styles.searchWrap}>
          <Search size={14} className={styles.searchIcon} />
          <input
            className={styles.search}
            placeholder="Buscar funcionário, registro..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <button className={styles.notifBtn}>
          <Bell size={18} />
          <span className={styles.notifDot} />
        </button>

        {user && (
          <div className={styles.userChip}>
            <Avatar name={user.name} size="sm" />
            <div className={styles.userMeta}>
              <div className={styles.userName}>{user.name}</div>
              <div className={styles.userRole}>{user.role}</div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
