// ─────────────────────────────────────────────────────────────────────────────
// Ativus — API Service Layer
//
// All functions currently return mock data.
// To connect to the real backend, set VITE_API_URL in .env and
// swap each function body from the mock import to the fetch call below it.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  AuthSession, Employee, WorkSchedule, Shift, TimeRecord,
  AdjustmentRequest, BankHoursSummary, BankHoursTransaction,
  Occurrence, Policy, AgendaEvent, ReportFilter, ReportRow,
  LegalFileRequest, LegalFileResponse, PaginatedResponse,
} from '../types'

const BASE = import.meta.env.VITE_API_URL ?? 'https://api.ativus.com.br/v1'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('ativus_token')
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  })
  if (!res.ok) throw await res.json()
  return res.json()
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    request<AuthSession>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    request<void>('/auth/logout', { method: 'POST' }),

  me: () =>
    request<AuthSession['user']>('/auth/me'),

  uploadAvatar: (file: File) => {
    const fd = new FormData()
    fd.append('avatar', file)
    return request<{ avatarUrl: string }>('/auth/avatar', { method: 'POST', body: fd })
  },
}

// ── Employees ─────────────────────────────────────────────────────────────────

export const employeesApi = {
  list: (params?: { page?: number; perPage?: number; search?: string; department?: string; status?: string }) =>
    request<PaginatedResponse<Employee>>('/employees?' + new URLSearchParams(params as Record<string, string>)),

  get: (id: string) =>
    request<Employee>(`/employees/${id}`),

  create: (data: Partial<Employee>) =>
    request<Employee>('/employees', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Employee>) =>
    request<Employee>(`/employees/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  delete: (id: string) =>
    request<void>(`/employees/${id}`, { method: 'DELETE' }),

  uploadAvatar: (id: string, file: File) => {
    const fd = new FormData()
    fd.append('avatar', file)
    return request<{ avatarUrl: string }>(`/employees/${id}/avatar`, { method: 'POST', body: fd })
  },
}

// ── Work Schedules (Jornadas) ─────────────────────────────────────────────────

export const schedulesApi = {
  list: () =>
    request<WorkSchedule[]>('/schedules'),

  get: (id: string) =>
    request<WorkSchedule>(`/schedules/${id}`),

  create: (data: Partial<WorkSchedule>) =>
    request<WorkSchedule>('/schedules', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<WorkSchedule>) =>
    request<WorkSchedule>(`/schedules/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  delete: (id: string) =>
    request<void>(`/schedules/${id}`, { method: 'DELETE' }),
}

// ── Shifts (Escalas) ──────────────────────────────────────────────────────────

export const shiftsApi = {
  list: () =>
    request<Shift[]>('/shifts'),

  create: (data: Partial<Shift>) =>
    request<Shift>('/shifts', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Shift>) =>
    request<Shift>(`/shifts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  delete: (id: string) =>
    request<void>(`/shifts/${id}`, { method: 'DELETE' }),
}

// ── Time Records (Registros de Ponto) ─────────────────────────────────────────

export const recordsApi = {
  list: (params: { startDate: string; endDate: string; employeeId?: string; status?: string }) =>
    request<PaginatedResponse<TimeRecord>>('/records?' + new URLSearchParams(params)),

  get: (id: string) =>
    request<TimeRecord>(`/records/${id}`),

  punch: (type: 'entry' | 'lunch_start' | 'lunch_end' | 'exit', location?: { lat: number; lng: number }) =>
    request<{ nsr: string; timestamp: string }>('/records/punch', {
      method: 'POST',
      body: JSON.stringify({ type, location }),
    }),

  update: (id: string, data: Partial<TimeRecord>) =>
    request<TimeRecord>(`/records/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  approve: (id: string) =>
    request<TimeRecord>(`/records/${id}/approve`, { method: 'POST' }),
}

// ── Adjustments ───────────────────────────────────────────────────────────────

export const adjustmentsApi = {
  list: (params?: { status?: string; type?: string }) =>
    request<PaginatedResponse<AdjustmentRequest>>('/adjustments?' + new URLSearchParams(params as Record<string, string>)),

  create: (data: Partial<AdjustmentRequest>) =>
    request<AdjustmentRequest>('/adjustments', { method: 'POST', body: JSON.stringify(data) }),

  approve: (id: string, note?: string) =>
    request<AdjustmentRequest>(`/adjustments/${id}/approve`, { method: 'POST', body: JSON.stringify({ note }) }),

  reject: (id: string, note?: string) =>
    request<AdjustmentRequest>(`/adjustments/${id}/reject`, { method: 'POST', body: JSON.stringify({ note }) }),
}

// ── Bank Hours ────────────────────────────────────────────────────────────────

export const bankHoursApi = {
  summaries: () =>
    request<BankHoursSummary[]>('/bank-hours/summaries'),

  transactions: (employeeId?: string) =>
    request<BankHoursTransaction[]>('/bank-hours/transactions' + (employeeId ? `?employeeId=${employeeId}` : '')),

  adjust: (data: { employeeId: string; type: 'credit' | 'debit'; hours: number; reason: string }) =>
    request<BankHoursTransaction>('/bank-hours/adjust', { method: 'POST', body: JSON.stringify(data) }),
}

// ── Occurrences ───────────────────────────────────────────────────────────────

export const occurrencesApi = {
  list: (params?: { type?: string; status?: string }) =>
    request<PaginatedResponse<Occurrence>>('/occurrences?' + new URLSearchParams(params as Record<string, string>)),

  create: (data: Partial<Occurrence>) =>
    request<Occurrence>('/occurrences', { method: 'POST', body: JSON.stringify(data) }),

  approve: (id: string) =>
    request<Occurrence>(`/occurrences/${id}/approve`, { method: 'POST' }),

  reject: (id: string) =>
    request<Occurrence>(`/occurrences/${id}/reject`, { method: 'POST' }),
}

// ── Policy ────────────────────────────────────────────────────────────────────

export const policyApi = {
  get: () =>
    request<Policy>('/policy'),

  update: (data: Partial<Policy>) =>
    request<Policy>('/policy', { method: 'PATCH', body: JSON.stringify(data) }),
}

// ── Agenda ────────────────────────────────────────────────────────────────────

export const agendaApi = {
  list: (params?: { month?: number; year?: number; type?: string }) =>
    request<AgendaEvent[]>('/agenda?' + new URLSearchParams(params as Record<string, string>)),

  create: (data: Partial<AgendaEvent>) =>
    request<AgendaEvent>('/agenda', { method: 'POST', body: JSON.stringify(data) }),

  delete: (id: string) =>
    request<void>(`/agenda/${id}`, { method: 'DELETE' }),
}

// ── Reports ───────────────────────────────────────────────────────────────────

export const reportsApi = {
  generate: (filter: ReportFilter) =>
    request<ReportRow[]>('/reports', { method: 'POST', body: JSON.stringify(filter) }),

  exportCsv: (filter: ReportFilter) =>
    fetch(`${BASE}/reports/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('ativus_token')}` },
      body: JSON.stringify({ ...filter, format: 'csv' }),
    }).then(r => r.blob()),
}

// ── Legal Files ───────────────────────────────────────────────────────────────

export const legalApi = {
  generate: (data: LegalFileRequest) =>
    request<LegalFileResponse>('/legal/generate', { method: 'POST', body: JSON.stringify(data) }),
}
