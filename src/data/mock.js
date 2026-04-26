// ============================================================
// ATIVUS — Mock Data (pt-BR)
// ============================================================

export const EMPLOYEES = [
  { id: 1,  name: 'João Souza',       email: 'joao.souza@empresa.com.br',       role: 'Analista de Vendas',   dept: 'Vendas',     schedule: '08:00–17:00', city: 'Rio de Janeiro', status: 'online',    cpf: '123.456.789-00', admission: '2022-03-01', workload: '44h/semana' },
  { id: 2,  name: 'Maria Lopes',      email: 'maria.lopes@empresa.com.br',      role: 'Coordenadora de RH',   dept: 'RH',         schedule: '09:00–18:00', city: 'São Paulo',      status: 'online',    cpf: '234.567.890-11', admission: '2021-07-15', workload: '40h/semana' },
  { id: 3,  name: 'Lucas Oliveira',   email: 'lucas.oliveira@empresa.com.br',   role: 'Desenvolvedor Sênior', dept: 'TI',         schedule: '09:00–18:00', city: 'São Paulo',      status: 'absent',    cpf: '345.678.901-22', admission: '2020-01-10', workload: '40h/semana' },
  { id: 4,  name: 'Pedro Martins',    email: 'pedro.martins@empresa.com.br',    role: 'Gerente Comercial',    dept: 'Comercial',  schedule: '08:00–17:00', city: 'Belo Horizonte', status: 'overtime',  cpf: '456.789.012-33', admission: '2019-05-20', workload: '44h/semana' },
  { id: 5,  name: 'Ana Paula Costa',  email: 'ana.costa@empresa.com.br',        role: 'Designer UX/UI',       dept: 'Produto',    schedule: '09:00–18:00', city: 'São Paulo',      status: 'online',    cpf: '567.890.123-44', admission: '2023-02-01', workload: '40h/semana' },
  { id: 6,  name: 'Felipe Carvalho',  email: 'felipe.carvalho@empresa.com.br',  role: 'Analista Financeiro',  dept: 'Financeiro', schedule: '08:30–17:30', city: 'São Paulo',      status: 'late',      cpf: '678.901.234-55', admission: '2022-09-12', workload: '44h/semana' },
  { id: 7,  name: 'Juliana Ferreira', email: 'juliana.ferreira@empresa.com.br', role: 'Supervisora de Ops',   dept: 'Operações',  schedule: '07:00–16:00', city: 'Campinas',       status: 'online',    cpf: '789.012.345-66', admission: '2018-11-30', workload: '44h/semana' },
  { id: 8,  name: 'Rodrigo Lima',     email: 'rodrigo.lima@empresa.com.br',     role: 'Estoquista',           dept: 'Logística',  schedule: '06:00–15:00', city: 'Guarulhos',      status: 'online',    cpf: '890.123.456-77', admission: '2023-06-01', workload: '44h/semana' },
  { id: 9,  name: 'Camila Rocha',     email: 'camila.rocha@empresa.com.br',     role: 'Assistente Contábil',  dept: 'Financeiro', schedule: '09:00–18:00', city: 'São Paulo',      status: 'offline',   cpf: '901.234.567-88', admission: '2021-03-22', workload: '40h/semana' },
  { id: 10, name: 'Thiago Nunes',     email: 'thiago.nunes@empresa.com.br',     role: 'Vendedor',             dept: 'Vendas',     schedule: '08:00–17:00', city: 'Recife',         status: 'online',    cpf: '012.345.678-99', admission: '2022-11-01', workload: '44h/semana' },
  { id: 11, name: 'Beatriz Santos',   email: 'beatriz.santos@empresa.com.br',   role: 'Analista de Marketing',dept: 'Marketing',  schedule: '09:00–18:00', city: 'São Paulo',      status: 'online',    cpf: '111.222.333-44', admission: '2023-01-16', workload: '40h/semana' },
  { id: 12, name: 'Gabriel Mendes',   email: 'gabriel.mendes@empresa.com.br',   role: 'Técnico de TI',        dept: 'TI',         schedule: '08:00–17:00', city: 'São Paulo',      status: 'absent',    cpf: '222.333.444-55', admission: '2024-01-08', workload: '44h/semana' },
]

export const DEPARTMENTS = ['Vendas','RH','TI','Comercial','Produto','Financeiro','Operações','Logística','Marketing']

export const STATUS_LABELS = {
  online:  { label: 'Trabalhando',  variant: 'success' },
  late:    { label: 'Atrasado',     variant: 'warning' },
  absent:  { label: 'Falta',        variant: 'error' },
  overtime:{ label: 'H. Extra',     variant: 'info' },
  offline: { label: 'Encerrado',    variant: 'neutral' },
}

// Generate 30 days of time records for an employee
function genRecords(employeeId, daysBack = 30) {
  const records = []
  const now = new Date()
  for (let i = daysBack; i >= 1; i--) {
    const date = new Date(now)
    date.setDate(now.getDate() - i)
    const dow = date.getDay()
    if (dow === 0 || dow === 6) continue // skip weekends

    const roll = Math.random()
    if (roll < 0.05) {
      records.push({ id: `${employeeId}-${i}`, employeeId, date: date.toISOString().split('T')[0], entry: null, breakStart: null, breakEnd: null, exit: null, status: 'absent', total: '—', balance: '-08h00' })
      continue
    }
    const late = roll > 0.85
    const extra = roll > 0.9
    const entryMin = late ? (8*60 + Math.floor(Math.random()*25 + 10)) : (8*60 + Math.floor(Math.random()*10 - 5))
    const exitMin  = extra ? (17*60 + Math.floor(Math.random()*90 + 30)) : (17*60 + Math.floor(Math.random()*20))
    const fmt = m => `${String(Math.floor(Math.abs(m)/60)).padStart(2,'0')}:${String(Math.abs(m)%60).padStart(2,'0')}`
    const totalMin = exitMin - entryMin - 60
    const balMin = totalMin - 480
    records.push({
      id: `${employeeId}-${i}`,
      employeeId,
      date: date.toISOString().split('T')[0],
      entry: fmt(entryMin),
      breakStart: '12:00',
      breakEnd: '13:00',
      exit: fmt(exitMin),
      status: late ? 'late' : extra ? 'overtime' : 'normal',
      total: `${Math.floor(totalMin/60)}h${String(totalMin%60).padStart(2,'0')}`,
      balance: `${balMin >= 0 ? '+' : '-'}${Math.floor(Math.abs(balMin)/60)}h${String(Math.abs(balMin)%60).padStart(2,'0')}`,
    })
  }
  return records
}

export const TIME_RECORDS = EMPLOYEES.flatMap(e => genRecords(e.id))

export const ADJUSTMENTS = [
  { id: 1,  employeeId: 3,  type: 'Falta',    date: '2026-04-22', reason: 'Atestado médico — gripe com febre', requestedAt: '2026-04-22 18:30', status: 'pending',  urgency: 'high',   attachment: 'atestado.pdf' },
  { id: 2,  employeeId: 6,  type: 'Atraso',   date: '2026-04-23', reason: 'Problema no transporte público — metrô parado', requestedAt: '2026-04-23 09:45', status: 'pending',  urgency: 'medium', attachment: null },
  { id: 3,  employeeId: 4,  type: 'H. Extra', date: '2026-04-21', reason: 'Reunião estratégica com cliente nacional', requestedAt: '2026-04-21 20:00', status: 'pending',  urgency: 'low',    attachment: null },
  { id: 4,  employeeId: 12, type: 'Falta',    date: '2026-04-24', reason: 'Emergência familiar', requestedAt: '2026-04-24 07:00', status: 'pending',  urgency: 'high',   attachment: null },
  { id: 5,  employeeId: 1,  type: 'Ajuste',   date: '2026-04-18', reason: 'Saída registrada errada — sistema lento', requestedAt: '2026-04-18 19:10', status: 'approved', urgency: 'low',    attachment: null },
  { id: 6,  employeeId: 2,  type: 'Atraso',   date: '2026-04-15', reason: 'Consulta médica agendada antes do trabalho', requestedAt: '2026-04-15 10:00', status: 'approved', urgency: 'low',    attachment: 'comprovante.pdf' },
  { id: 7,  employeeId: 9,  type: 'Falta',    date: '2026-04-10', reason: 'Licença maternidade — pré-parto', requestedAt: '2026-04-10 08:00', status: 'rejected', urgency: 'medium', attachment: null },
  { id: 8,  employeeId: 5,  type: 'H. Extra', date: '2026-04-20', reason: 'Entrega de projeto — prazo apertado', requestedAt: '2026-04-20 22:30', status: 'pending',  urgency: 'medium', attachment: null },
]

export const KPI_DATA = {
  onlineNow: 8,
  totalEmployees: 12,
  overtimeHoursMonth: 47,
  latesToday: 2,
  absencesToday: 2,
  pendingAdjustments: 4,
  bankHours: '+12h30',
  punctualityRate: 87,
}

export const ATTENDANCE_WEEK = [
  { day: 'Seg', present: 10, absent: 2 },
  { day: 'Ter', present: 11, absent: 1 },
  { day: 'Qua', present: 9,  absent: 3 },
  { day: 'Qui', present: 12, absent: 0 },
  { day: 'Sex', present: 10, absent: 2 },
]

export const HOURS_MONTH = [
  { week: 'S1', worked: 44, target: 44 },
  { week: 'S2', worked: 47, target: 44 },
  { week: 'S3', worked: 42, target: 44 },
  { week: 'S4', worked: 45, target: 44 },
]

export const REPORTS = [
  { id: 'overtime',    title: 'Horas Extras',      icon: 'Clock',      desc: 'Total de horas extras por funcionário no período selecionado.' },
  { id: 'bank',        title: 'Banco de Horas',    icon: 'Wallet',     desc: 'Saldo acumulado de banco de horas por colaborador.' },
  { id: 'absences',    title: 'Faltas e Atrasos',  icon: 'UserX',      desc: 'Registros de faltas, atrasos e justificativas.' },
  { id: 'productivity',title: 'Produtividade',     icon: 'TrendingUp', desc: 'Horas trabalhadas vs. horas esperadas por equipe.' },
]
