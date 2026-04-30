import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/ui/ToastContainer'
import AppShell from './components/layout/AppShell'

// Pages
import LandingPage    from './pages/landing/LandingPage'
import Login          from './pages/auth/Login'
import Dashboard      from './pages/dashboard/Dashboard'
import Employees      from './pages/employees/Employees'
import EmployeeDetail from './pages/employees/EmployeeDetail'
import TimeRecords    from './pages/records/TimeRecords'
import TimeMirror     from './pages/mirror/TimeMirror'
import Adjustments    from './pages/adjustments/Adjustments'
import Reports        from './pages/reports/Reports'
import LegalFiles     from './pages/legal/LegalFiles'
import Settings       from './pages/settings/Settings'
import MobileApp      from './pages/mobile/MobileApp'
import Schedules      from './pages/schedules/Schedules'
import Shifts         from './pages/shifts/Shifts'
import Policies       from './pages/policies/Policies'
import BankHours      from './pages/bankhours/BankHours'
import Occurrences    from './pages/occurrences/Occurrences'
import Agenda         from './pages/agenda/Agenda'
import Tasks          from './pages/tasks/Tasks'

// Mobile wrapper page (shows the phone emulator centered)
function MobilePreviewPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0B2354 0%, #1042A0 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      gap: '24px',
    }}>
      <div style={{ textAlign: 'center', color: '#fff' }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 28, marginBottom: 4 }}>
          Ativus — App Mobile
        </div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
          Simulador do App do Funcionário
        </div>
      </div>
      <MobileApp />
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>
        Experiência real em iOS e Android · Ativus v2.4
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/"      element={<LandingPage />} />
            <Route path="/login" element={<Login />} />

            {/* Mobile preview — standalone (no app shell) */}
            <Route path="/app-mobile" element={<MobilePreviewPage />} />

            {/* Protected — inside app shell (auth guard is in AppShell) */}
            <Route element={<AppShell />}>
              <Route path="/dashboard"       element={<Dashboard />} />
              <Route path="/funcionarios"    element={<Employees />} />
              <Route path="/funcionarios/:id" element={<EmployeeDetail />} />
              <Route path="/registros"       element={<TimeRecords />} />
              <Route path="/espelho"         element={<TimeMirror />} />
              <Route path="/ajustes"         element={<Adjustments />} />
              <Route path="/relatorios"      element={<Reports />} />
              <Route path="/arquivos-legais" element={<LegalFiles />} />
              <Route path="/configuracoes"   element={<Settings />} />
              <Route path="/jornadas"        element={<Schedules />} />
              <Route path="/escalas"         element={<Shifts />} />
              <Route path="/politicas"       element={<Policies />} />
              <Route path="/banco-de-horas"  element={<BankHours />} />
              <Route path="/ocorrencias"     element={<Occurrences />} />
              <Route path="/agenda"          element={<Agenda />} />
              <Route path="/tarefas"         element={<Tasks />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
