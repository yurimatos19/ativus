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

// recurrence: null | 'diaria' | 'semanal' | 'mensal'
// recurrenceDays: [1,3,5] = Seg,Qua,Sex (semanal only)
// recurrenceDay: 1-31 (mensal only)
// assigneeType: 'employee' | 'department'
// category: string
export const TASK_CATEGORIES = ['Administrativo','Comercial','Operacional','Segurança','Treinamento','Financeiro','TI','Marketing','RH','Logística']

export const TASKS = [
  // ── Recorrentes diárias ─────────────────────────────────────────────────────
  { id: 1,  assigneeType: 'employee',   employeeId: 1,  department: null,       title: 'Atualizar CRM com atividades do dia',               date: '2026-04-30', time: '17:30', priority: 'high',   category: 'Comercial',     recurrence: 'diaria',  recurrenceDays: null, recurrenceDay: null, done: false, createdBy: 'Mariana Costa' },
  { id: 2,  assigneeType: 'employee',   employeeId: 7,  department: null,       title: 'Verificar escala da equipe e confirmar presenças',   date: '2026-04-30', time: '07:30', priority: 'high',   category: 'Operacional',   recurrence: 'diaria',  recurrenceDays: null, recurrenceDay: null, done: true,  createdBy: 'Mariana Costa' },
  { id: 3,  assigneeType: 'employee',   employeeId: 8,  department: null,       title: 'Conferir e assinar romaneio de entrada de materiais', date: '2026-04-30', time: '08:00', priority: 'medium', category: 'Logística',     recurrence: 'diaria',  recurrenceDays: null, recurrenceDay: null, done: true,  createdBy: 'Mariana Costa' },
  { id: 4,  assigneeType: 'department', employeeId: null, department: 'Vendas', title: 'Registrar ligações do dia no sistema',                date: '2026-04-30', time: '18:00', priority: 'medium', category: 'Comercial',     recurrence: 'diaria',  recurrenceDays: null, recurrenceDay: null, done: false, createdBy: 'Mariana Costa' },

  // ── Recorrentes semanais ────────────────────────────────────────────────────
  { id: 5,  assigneeType: 'employee',   employeeId: 2,  department: null,       title: 'Enviar relatório de frequência para contabilidade',  date: '2026-04-30', time: '09:00', priority: 'high',   category: 'RH',            recurrence: 'semanal', recurrenceDays: [3],     recurrenceDay: null, done: false, createdBy: 'Mariana Costa' },
  { id: 6,  assigneeType: 'employee',   employeeId: 4,  department: null,       title: 'Reunião de pipeline com a equipe comercial',         date: '2026-04-30', time: '14:00', priority: 'high',   category: 'Comercial',     recurrence: 'semanal', recurrenceDays: [1,4],   recurrenceDay: null, done: false, createdBy: 'Mariana Costa' },
  { id: 7,  assigneeType: 'employee',   employeeId: 3,  department: null,       title: 'Code review dos PRs abertos no repositório',         date: '2026-04-30', time: '10:00', priority: 'medium', category: 'TI',            recurrence: 'semanal', recurrenceDays: [1,3,5], recurrenceDay: null, done: false, createdBy: 'Mariana Costa' },
  { id: 8,  assigneeType: 'department', employeeId: null, department: 'RH',     title: 'Reunião semanal do time de RH',                      date: '2026-04-30', time: '11:00', priority: 'medium', category: 'RH',            recurrence: 'semanal', recurrenceDays: [5],     recurrenceDay: null, done: false, createdBy: 'Mariana Costa' },
  { id: 9,  assigneeType: 'employee',   employeeId: 11, department: null,       title: 'Publicar conteúdo semanal nas redes sociais',        date: '2026-04-30', time: '10:00', priority: 'medium', category: 'Marketing',     recurrence: 'semanal', recurrenceDays: [1,4],   recurrenceDay: null, done: true,  createdBy: 'Mariana Costa' },

  // ── Recorrentes mensais ─────────────────────────────────────────────────────
  { id: 10, assigneeType: 'employee',   employeeId: 6,  department: null,       title: 'Conciliar extratos bancários do mês anterior',       date: '2026-04-30', time: '09:00', priority: 'high',   category: 'Financeiro',    recurrence: 'mensal',  recurrenceDays: null, recurrenceDay: 5,  done: false, createdBy: 'Mariana Costa' },
  { id: 11, assigneeType: 'employee',   employeeId: 2,  department: null,       title: 'Fechar folha de ponto mensal e enviar para DP',      date: '2026-04-30', time: '12:00', priority: 'high',   category: 'RH',            recurrence: 'mensal',  recurrenceDays: null, recurrenceDay: 1,  done: false, createdBy: 'Mariana Costa' },
  { id: 12, assigneeType: 'department', employeeId: null, department: 'TI',     title: 'Treinamento de segurança digital obrigatório',        date: '2026-04-30', time: '15:00', priority: 'high',   category: 'Segurança',     recurrence: 'mensal',  recurrenceDays: null, recurrenceDay: 15, done: false, createdBy: 'Mariana Costa' },
  { id: 13, assigneeType: 'employee',   employeeId: 9,  department: null,       title: 'Fechar balancete contábil e enviar para revisão',    date: '2026-04-30', time: '10:00', priority: 'high',   category: 'Financeiro',    recurrence: 'mensal',  recurrenceDays: null, recurrenceDay: 3,  done: false, createdBy: 'Mariana Costa' },

  // ── Únicas (pontuais) ──────────────────────────────────────────────────────
  { id: 14, assigneeType: 'employee',   employeeId: 1,  department: null,       title: 'Ligar para cliente ABC — proposta Q2',               date: '2026-04-30', time: '09:00', priority: 'high',   category: 'Comercial',     recurrence: null, recurrenceDays: null, recurrenceDay: null, done: true,  createdBy: 'Mariana Costa' },
  { id: 15, assigneeType: 'employee',   employeeId: 1,  department: null,       title: 'Enviar proposta comercial revisada — Empresa XYZ',   date: '2026-04-30', time: '10:30', priority: 'high',   category: 'Comercial',     recurrence: null, recurrenceDays: null, recurrenceDay: null, done: false, createdBy: 'Mariana Costa' },
  { id: 16, assigneeType: 'employee',   employeeId: 2,  department: null,       title: 'Onboarding do novo funcionário Gabriel Mendes',      date: '2026-04-30', time: '09:00', priority: 'high',   category: 'RH',            recurrence: null, recurrenceDays: null, recurrenceDay: null, done: false, createdBy: 'Mariana Costa' },
  { id: 17, assigneeType: 'employee',   employeeId: 5,  department: null,       title: 'Entregar protótipos do app para aprovação da diretoria', date: '2026-04-30', time: '11:00', priority: 'high', category: 'TI',           recurrence: null, recurrenceDays: null, recurrenceDay: null, done: true,  createdBy: 'Mariana Costa' },
  { id: 18, assigneeType: 'employee',   employeeId: 5,  department: null,       title: 'Sessão de testes de usabilidade com usuários reais',  date: '2026-04-30', time: '14:00', priority: 'medium', category: 'TI',            recurrence: null, recurrenceDays: null, recurrenceDay: null, done: false, createdBy: 'Mariana Costa' },
  { id: 19, assigneeType: 'employee',   employeeId: 4,  department: null,       title: 'Apresentação de resultados Q1 para diretoria',       date: '2026-04-30', time: '10:00', priority: 'high',   category: 'Administrativo',recurrence: null, recurrenceDays: null, recurrenceDay: null, done: false, createdBy: 'Mariana Costa' },
  { id: 20, assigneeType: 'employee',   employeeId: 10, department: null,       title: 'Visita técnica ao cliente em Recife Centro',         date: '2026-04-30', time: '09:00', priority: 'high',   category: 'Comercial',     recurrence: null, recurrenceDays: null, recurrenceDay: null, done: false, createdBy: 'Mariana Costa' },
  { id: 21, assigneeType: 'employee',   employeeId: 12, department: null,       title: 'Instalar atualização de segurança nos servidores',   date: '2026-05-02', time: '08:00', priority: 'high',   category: 'Segurança',     recurrence: null, recurrenceDays: null, recurrenceDay: null, done: false, createdBy: 'Mariana Costa' },
  { id: 22, assigneeType: 'department', employeeId: null, department: 'Operações', title: 'Treinamento de CIPA e segurança no trabalho',     date: '2026-05-05', time: '13:00', priority: 'high',   category: 'Segurança',     recurrence: null, recurrenceDays: null, recurrenceDay: null, done: false, createdBy: 'Mariana Costa' },
  { id: 23, assigneeType: 'employee',   employeeId: 11, department: null,       title: 'Análise de métricas da campanha de abril',           date: '2026-05-02', time: '15:00', priority: 'low',    category: 'Marketing',     recurrence: null, recurrenceDays: null, recurrenceDay: null, done: false, createdBy: 'Mariana Costa' },
]

export const REPORTS = [
  { id: 'overtime',    title: 'Horas Extras',      icon: 'Clock',      desc: 'Total de horas extras por funcionário no período selecionado.' },
  { id: 'bank',        title: 'Banco de Horas',    icon: 'Wallet',     desc: 'Saldo acumulado de banco de horas por colaborador.' },
  { id: 'absences',    title: 'Faltas e Atrasos',  icon: 'UserX',      desc: 'Registros de faltas, atrasos e justificativas.' },
  { id: 'productivity',title: 'Produtividade',     icon: 'TrendingUp', desc: 'Horas trabalhadas vs. horas esperadas por equipe.' },
]
