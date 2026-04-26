// ─────────────────────────────────────────────────────────────────────────────
// Ativus — Domain Types
// Replace mock data with real API responses shaped to these types.
// ─────────────────────────────────────────────────────────────────────────────

// ── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'hr' | 'employee'
  companyId: string
  avatarUrl?: string
}

export interface AuthSession {
  user: AuthUser
  token: string
  expiresAt: string // ISO 8601
}

// ── Company ──────────────────────────────────────────────────────────────────

export interface Company {
  id: string
  name: string
  cnpj: string
  address: string
  city: string
  state: string
  logoUrl?: string
  plan: 'starter' | 'small' | 'medium' | 'large' | 'enterprise' | 'variable'
  employeeLimit: number | null // null = unlimited
  createdAt: string
}

// ── Employee ─────────────────────────────────────────────────────────────────

export type EmployeeStatus = 'active' | 'inactive' | 'on_leave' | 'vacation'

export interface Employee {
  id: string
  companyId: string
  name: string
  cpf: string              // format: 000.000.000-00
  email: string
  phone?: string
  role: string             // job title
  department: string
  registration: string     // matrícula
  hireDate: string         // ISO date YYYY-MM-DD
  scheduleId: string       // FK → WorkSchedule
  shiftId?: string         // FK → Shift
  status: EmployeeStatus
  avatarUrl?: string
  bankHoursBalance: number // in decimal hours, can be negative
  createdAt: string
  updatedAt: string
}

// ── Work Schedule (Jornada) ───────────────────────────────────────────────────

export type ScheduleType = 'commercial' | 'shift' | 'flex' | 'night'

export interface WorkSchedule {
  id: string
  companyId: string
  name: string
  type: ScheduleType
  dailyHours: number        // e.g. 8.0
  weeklyHours: number       // e.g. 44.0
  breakMinutes: number      // e.g. 60
  entryTime: string         // HH:MM
  exitTime: string          // HH:MM
  workDays: number[]        // 0=Sun…6=Sat, e.g. [1,2,3,4,5]
  employeeCount: number
  createdAt: string
}

// ── Shift / Scale (Escala) ────────────────────────────────────────────────────

export type ShiftType = '5x2' | '6x1' | '12x36' | 'flex' | 'custom'

export interface Shift {
  id: string
  companyId: string
  name: string
  type: ShiftType
  scheduleId: string        // FK → WorkSchedule
  workDays: number[]
  restDays: number[]
  cycleDays: number         // e.g. 7, 14, 28
  description?: string
  color: string             // hex
  employeeCount: number
  createdAt: string
}

// ── Time Record (Ponto) ───────────────────────────────────────────────────────

export type PunchType = 'entry' | 'lunch_start' | 'lunch_end' | 'exit'
export type RecordStatus = 'pending' | 'approved' | 'adjusted' | 'missing'

export interface PunchRecord {
  id: string
  employeeId: string
  companyId: string
  type: PunchType
  timestamp: string         // ISO 8601 with timezone
  nsr: string               // Número Sequencial de Registro
  method: 'app' | 'web' | 'biometric' | 'manual'
  location?: { lat: number; lng: number; address: string }
  deviceId?: string
  createdAt: string
}

export interface TimeRecord {
  id: string
  employeeId: string
  companyId: string
  date: string              // YYYY-MM-DD
  entry?: string            // HH:MM
  lunchStart?: string
  lunchEnd?: string
  exit?: string
  totalWorked: number       // decimal hours
  extraHours: number        // decimal hours, 0 if none
  lateMinutes: number       // 0 if on time
  status: RecordStatus
  punches: PunchRecord[]
  note?: string
  approvedBy?: string       // employee id
  approvedAt?: string
}

// ── Adjustment Request (Ajuste) ───────────────────────────────────────────────

export type AdjustmentType = 'entry' | 'exit' | 'lunch' | 'full_day' | 'extra_hours'
export type AdjustmentStatus = 'pending' | 'approved' | 'rejected'

export interface AdjustmentRequest {
  id: string
  employeeId: string
  companyId: string
  recordId?: string         // FK → TimeRecord
  type: AdjustmentType
  requestedDate: string     // YYYY-MM-DD
  reason: string
  attachment?: string       // URL to uploaded file
  status: AdjustmentStatus
  reviewedBy?: string
  reviewedAt?: string
  reviewNote?: string
  createdAt: string
}

// ── Bank Hours (Banco de Horas) ───────────────────────────────────────────────

export type BankTransactionType = 'credit' | 'debit'

export interface BankHoursTransaction {
  id: string
  employeeId: string
  companyId: string
  type: BankTransactionType
  hours: number             // always positive, sign determined by type
  reason: string
  date: string              // YYYY-MM-DD
  approvedBy: string
  recordId?: string         // FK → TimeRecord, if auto-generated
  createdAt: string
}

export interface BankHoursSummary {
  employeeId: string
  balance: number           // can be negative
  accumulated: number       // total credits all time
  compensated: number       // total debits all time
  lastUpdated: string
}

// ── Occurrence (Ocorrência) ───────────────────────────────────────────────────

export type OccurrenceType = 'absence' | 'late' | 'medical' | 'dayoff' | 'vacation' | 'incident'
export type OccurrenceStatus = 'pending' | 'approved' | 'rejected'

export interface Occurrence {
  id: string
  employeeId: string
  companyId: string
  type: OccurrenceType
  date: string              // YYYY-MM-DD
  days?: number             // number of days affected
  reason: string
  attachmentUrl?: string    // medical cert, etc.
  status: OccurrenceStatus
  reviewedBy?: string
  reviewedAt?: string
  createdAt: string
}

// ── Policy (Política de Ponto) ────────────────────────────────────────────────

export interface TolerancePolicy {
  entryBeforeMin: number
  entryAfterMin: number
  exitBeforeMin: number
  exitAfterMin: number
  breakReductionMin: number
  breakExcessMin: number
  considerLate: boolean
  lateThresholdMin: number
}

export interface OvertimePolicy {
  dailyLimitHours: number
  weeklyLimitHours: number
  monthlyLimitHours: number
  rate50: boolean
  rate100ThresholdHours: number
  sundayRate: number        // percentage e.g. 100
  holidayRate: number
  autoApprove: boolean
  autoApproveMaxMin: number
}

export interface AbsencePolicy {
  justifyDeadlineHours: number
  medicalCertDeadlineHours: number
  discountMode: 'proportional' | 'full_day' | 'dsr'
  allowHalfDay: boolean
  allowPartialJustify: boolean
  consecutiveAbsenceTrigger: number
  consecutiveAction: 'notify' | 'block' | 'hr'
}

export interface BankPolicy {
  enabled: boolean
  maxPositiveHours: number
  maxNegativeHours: number
  expiryMonths: number
  compensationChoice: 'employee_choose' | 'manager_choose' | 'auto'
  payoutOnTermination: boolean
  approvalRequired: boolean
}

export interface Policy {
  id: string
  companyId: string
  tolerance: TolerancePolicy
  overtime: OvertimePolicy
  absence: AbsencePolicy
  bank: BankPolicy
  updatedAt: string
  updatedBy: string
}

// ── Agenda Event ──────────────────────────────────────────────────────────────

export type EventType = 'meeting' | 'dayoff' | 'absence' | 'vacation' | 'training'

export interface AgendaEvent {
  id: string
  companyId: string
  title: string
  type: EventType
  date: string              // YYYY-MM-DD
  time?: string             // HH:MM, optional for all-day events
  department?: string
  employeeIds: string[]     // FK[] → Employee
  createdBy: string
  createdAt: string
}

// ── Report ────────────────────────────────────────────────────────────────────

export type ReportType = 'extra_hours' | 'bank_hours' | 'absences' | 'productivity' | 'mirror'

export interface ReportFilter {
  type: ReportType
  startDate: string         // YYYY-MM-DD
  endDate: string           // YYYY-MM-DD
  departmentId?: string
  employeeId?: string
}

export interface ReportRow {
  employeeId: string
  employeeName: string
  department: string
  [key: string]: string | number // dynamic columns per report type
}

// ── Legal Files ───────────────────────────────────────────────────────────────

export type LegalFileType = 'AFD' | 'AFDT' | 'ACJEF'

export interface LegalFileRequest {
  companyId: string
  type: LegalFileType
  cnpj: string
  startDate: string
  endDate: string
  operationType: '1' | '2' | '3' | '4' // Portaria MTE 1.510/2009
}

export interface LegalFileResponse {
  fileUrl: string           // signed URL for download
  generatedAt: string
  recordCount: number
  fileSizeBytes: number
}

// ── Pagination ────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

// ── API Error ─────────────────────────────────────────────────────────────────

export interface ApiError {
  code: string              // e.g. "EMPLOYEE_NOT_FOUND"
  message: string
  details?: Record<string, string>
}
