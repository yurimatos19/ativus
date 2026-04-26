import { useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import styles from './AppShell.module.css'

export default function AppShell() {
  const { isAuthenticated } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <div className={styles.shell}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div className={styles.main}>
        <TopBar />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
