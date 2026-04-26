import { useState, useEffect, useMemo } from 'react'
import {
  Home, CheckSquare, Clock, User, LogIn, LogOut,
  CheckCircle, AlertCircle, ChevronRight, BarChart2,
  Calendar, Bell, ArrowLeft, Plus, Minus, Coffee, Share2, FileText,
} from 'lucide-react'
import styles from './MobileApp.module.css'

// ── Mock data ─────────────────────────────────────────────────
const USER = { name: 'João Souza', role: 'Analista de Vendas', dept: 'Vendas', avatar: 'JS' }

const TASKS_DATA = [
  { id: 1, title: 'Ligar para cliente ABC',            done: true,  time: '09:00' },
  { id: 2, title: 'Enviar proposta comercial',          done: true,  time: '10:30' },
  { id: 3, title: 'Reunião semanal de vendas',          done: false, time: '14:00' },
  { id: 4, title: 'Atualizar CRM com visitas do dia',   done: false, time: '16:00' },
  { id: 5, title: 'Revisar metas do mês',               done: false, time: '17:00' },
]

function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return now
}

// ── Sub-screens ───────────────────────────────────────────────

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('joao.souza@empresa.com.br')
  const [pass,  setPass]  = useState('senha123')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    onLogin()
  }

  return (
    <div className={styles.screen}>
      <div className={styles.loginHero}>
        <div className={styles.loginLogo}>
          <img src="/assets/logo.png" alt="Ativus" className={styles.loginLogoImg} />
        </div>
        <div className={styles.loginLogoText}>Ativus</div>
        <div className={styles.loginSub}>Controle de Ponto</div>
      </div>

      <div className={styles.loginForm}>
        <h2 className={styles.loginTitle}>Olá, funcionário!</h2>
        <p className={styles.loginDesc}>Entre com sua conta para registrar seu ponto.</p>

        <div className={styles.mField}>
          <label className={styles.mLabel}>E-mail</label>
          <input className={styles.mInput} type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className={styles.mField}>
          <label className={styles.mLabel}>Senha</label>
          <input className={styles.mInput} type="password" value={pass} onChange={e => setPass(e.target.value)} />
        </div>

        <button className={styles.mBtnPrimary} onClick={handleLogin} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <p className={styles.loginHint}>Versão Funcionário · Ativus v2.4</p>
      </div>
    </div>
  )
}

// 4-punch sequence
const PUNCH_STEPS = [
  { key: 'entry',        label: 'Registrar Entrada',      sub: 'Início da jornada',          icon: LogIn,  color: '#39B54A', btnClass: 'punchBtnIn'     },
  { key: 'lunch_start',  label: 'Saída para Almoço',      sub: 'Início do intervalo',        icon: Coffee, color: '#F59E0B', btnClass: 'punchBtnLunch'  },
  { key: 'lunch_end',    label: 'Retorno do Almoço',      sub: 'Fim do intervalo',           icon: LogIn,  color: '#1565C0', btnClass: 'punchBtnReturn' },
  { key: 'exit',         label: 'Registrar Saída',        sub: 'Fim da jornada de trabalho', icon: LogOut, color: '#EF4444', btnClass: 'punchBtnOut'    },
]

function ComprovantScreen({ punch, onClose, onRequest }) {
  return (
    <div className={styles.screen} style={{ padding: 0 }}>
      <div className={styles.comprovante}>
        <div className={styles.comprovanteCheck}>
          <CheckCircle size={48} color="#39B54A" />
        </div>
        <div className={styles.comprovanteTitle}>Ponto Registrado!</div>
        <div className={styles.comprovanteType}>{punch.stepLabel}</div>

        <div className={styles.comprovanteCard}>
          {[
            { label: 'Funcionário', val: USER.name },
            { label: 'Matrícula',   val: '0042' },
            { label: 'Data',        val: punch.date },
            { label: 'Horário',     val: punch.time },
            { label: 'Localização', val: 'Sede — São Paulo, SP' },
            { label: 'Dispositivo', val: 'App Mobile v2.4' },
            { label: 'NSR',         val: punch.nsr },
          ].map(row => (
            <div key={row.label} className={styles.compRow}>
              <span className={styles.compKey}>{row.label}</span>
              <span className={styles.compVal}>{row.val}</span>
            </div>
          ))}
        </div>

        <div className={styles.compActions}>
          <button className={styles.compShareBtn}>
            <Share2 size={15} /> Compartilhar
          </button>
          <button className={styles.compReqBtn} onClick={onRequest}>
            <AlertCircle size={15} /> Solicitar Correção
          </button>
        </div>

        <button className={styles.mBtnPrimary} style={{ marginTop: 8 }} onClick={onClose}>
          Continuar
        </button>
      </div>
    </div>
  )
}

function HomeScreen({ onNav }) {
  const now = useClock()
  const [punchStep, setPunchStep]       = useState(0)   // 0–3: which punch, 4 = all done
  const [punches, setPunches]           = useState([])
  const [loading, setLoading]           = useState(false)
  const [comprovante, setComprovante]   = useState(null) // show comprovante screen
  const [showCorrReq, setShowCorrReq]   = useState(false)

  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

  const step = PUNCH_STEPS[punchStep] || null

  const handlePunch = async () => {
    if (!step || loading) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    const entry = {
      key: step.key,
      stepLabel: step.label,
      time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      nsr: String(Math.floor(Math.random() * 900000 + 100000)),
    }
    setPunches(prev => [...prev, entry])
    setComprovante(entry)
    setPunchStep(prev => prev + 1)
  }

  if (comprovante && !showCorrReq) {
    return (
      <ComprovantScreen
        punch={comprovante}
        onClose={() => setComprovante(null)}
        onRequest={() => setShowCorrReq(true)}
      />
    )
  }

  if (showCorrReq) {
    return <CorrectionRequestScreen onClose={() => { setShowCorrReq(false); setComprovante(null) }} punch={comprovante} />
  }

  const StepIcon = step ? step.icon : CheckCircle

  return (
    <div className={styles.screen}>
      <div className={styles.homeHeader}>
        <div className={styles.homeGreeting}>
          <span className={styles.homeHi}>Bom dia,</span>
          <span className={styles.homeName}>{USER.name.split(' ')[0]}!</span>
        </div>
        <div className={styles.homeAvatar}>{USER.avatar}</div>
      </div>

      <div className={styles.clockBlock}>
        <div className={styles.clockLabel}>Horário atual</div>
        <div className={styles.clockTime}>{timeStr}</div>
        <div className={styles.clockDate}>{dateStr}</div>
      </div>

      {/* Progress dots */}
      <div className={styles.punchProgress}>
        {PUNCH_STEPS.map((s, i) => (
          <div key={s.key} className={styles.punchProgressItem}>
            <div className={[
              styles.punchDot,
              i < punchStep ? styles.punchDotDone : i === punchStep ? styles.punchDotActive : styles.punchDotPending
            ].join(' ')}>
              {i < punchStep ? <CheckCircle size={10} /> : i + 1}
            </div>
            <div className={styles.punchDotLabel}>{i === 0 ? 'Entrada' : i === 1 ? 'Almoço' : i === 2 ? 'Volta' : 'Saída'}</div>
          </div>
        ))}
      </div>

      <div className={styles.punchArea}>
        {punchStep < 4 ? (
          <>
            <button
              className={[styles.punchBtn, styles[step.btnClass], loading ? styles.punchLoading : ''].join(' ')}
              onClick={handlePunch}
              style={loading ? {} : { '--punch-color': step.color }}
            >
              {loading ? (
                <div className={styles.punchSpinner} />
              ) : (
                <><StepIcon size={28} /><span>{step.label}</span></>
              )}
            </button>
            <p className={styles.punchHint}>{step.sub}</p>
            {punches.length > 0 && (
              <p className={styles.lastPunch}>
                Último: {punches[punches.length - 1].stepLabel} às {punches[punches.length - 1].time}
              </p>
            )}
          </>
        ) : (
          <div className={styles.allDoneBlock}>
            <CheckCircle size={40} color="#39B54A" />
            <div className={styles.allDoneTitle}>Jornada completa!</div>
            <div className={styles.allDoneTime}>Todos os pontos registrados</div>
          </div>
        )}
      </div>

      <div className={styles.homeCards}>
        <div className={styles.homeCard} onClick={() => onNav('tasks')}>
          <CheckSquare size={18} color="#39B54A" />
          <div className={styles.homeCardInfo}>
            <div className={styles.homeCardLabel}>Tarefas do Dia</div>
            <div className={styles.homeCardVal}>2/5 concluídas</div>
          </div>
          <ChevronRight size={14} color="#94A3B8" />
        </div>
        <div className={styles.homeCard} onClick={() => onNav('hours')}>
          <Clock size={18} color="#1565C0" />
          <div className={styles.homeCardInfo}>
            <div className={styles.homeCardLabel}>Minhas Horas</div>
            <div className={styles.homeCardVal}>{punches.length > 0 ? `${punches.length} registro(s)` : '— hoje'}</div>
          </div>
          <ChevronRight size={14} color="#94A3B8" />
        </div>
        <div className={styles.homeCard} onClick={() => onNav('schedule')}>
          <Calendar size={18} color="#F59E0B" />
          <div className={styles.homeCardInfo}>
            <div className={styles.homeCardLabel}>Minha Escala</div>
            <div className={styles.homeCardVal}>08:00 – 17:00</div>
          </div>
          <ChevronRight size={14} color="#94A3B8" />
        </div>
      </div>
    </div>
  )
}

function CorrectionRequestScreen({ onClose, punch }) {
  const [reason, setReason] = useState('')
  const [sent, setSent] = useState(false)

  const submit = async () => {
    if (!reason) return
    await new Promise(r => setTimeout(r, 600))
    setSent(true)
  }

  if (sent) {
    return (
      <div className={styles.screen} style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 16 }}>
        <CheckCircle size={48} color="#39B54A" />
        <div className={styles.comprovanteTitle}>Solicitação Enviada!</div>
        <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>
          Seu pedido de correção foi enviado ao gestor e será analisado em até 48 horas.
        </p>
        <button className={styles.mBtnPrimary} onClick={onClose}>Voltar</button>
      </div>
    )
  }

  return (
    <div className={styles.screen}>
      <div className={styles.pageTitle}>Solicitar Correção</div>
      <p style={{ fontSize: 12, color: '#64748B', marginBottom: 12, lineHeight: 1.5 }}>
        Informe o motivo da solicitação de correção para <strong>{punch?.stepLabel}</strong> registrado às <strong>{punch?.time}</strong>.
      </p>
      <div className={styles.mField}>
        <label className={styles.mLabel}>Tipo de problema</label>
        <select className={styles.mInput}>
          <option>Horário incorreto</option>
          <option>Registro duplicado</option>
          <option>Esqueci de bater</option>
          <option>Problema técnico</option>
          <option>Outro</option>
        </select>
      </div>
      <div className={styles.mField}>
        <label className={styles.mLabel}>Justificativa *</label>
        <textarea
          className={styles.mTextarea}
          rows={4}
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Descreva detalhadamente o motivo da correção..."
        />
      </div>
      <div className={styles.newReqBtns}>
        <button className={styles.mBtnGhost} onClick={onClose}>Cancelar</button>
        <button className={styles.mBtnPrimary} onClick={submit} disabled={!reason}>Enviar</button>
      </div>
    </div>
  )
}

function TasksScreen() {
  const [tasks, setTasks]       = useState(TASKS_DATA)
  const [adding, setAdding]     = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newTime, setNewTime]   = useState('')

  const done  = tasks.filter(t => t.done).length
  const total = tasks.length
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0

  const toggle = id => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))

  const removeTask = id => setTasks(prev => prev.filter(t => t.id !== id))

  const addTask = () => {
    if (!newTitle.trim()) return
    setTasks(prev => [...prev, {
      id: Date.now(),
      title: newTitle.trim(),
      time: newTime || '--:--',
      done: false,
    }])
    setNewTitle('')
    setNewTime('')
    setAdding(false)
  }

  const cancelAdd = () => {
    setNewTitle('')
    setNewTime('')
    setAdding(false)
  }

  return (
    <div className={styles.screen}>
      <div className={styles.pageTitle}>Tarefas do Dia</div>

      <div className={styles.progressCard}>
        <div className={styles.progressTop}>
          <span className={styles.progressLabel}>{done} de {total} concluídas</span>
          <span className={styles.progressPct}>{pct}%</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className={styles.taskList}>
        {tasks.map(t => (
          <div
            key={t.id}
            className={[styles.taskRow, t.done ? styles.taskDone : ''].join(' ')}
          >
            <div
              className={[styles.taskCheck, t.done ? styles.taskCheckDone : ''].join(' ')}
              onClick={() => toggle(t.id)}
            >
              {t.done && <CheckCircle size={14} />}
            </div>
            <div className={styles.taskInfo} onClick={() => toggle(t.id)}>
              <div className={styles.taskTitle}>{t.title}</div>
              <div className={styles.taskTime}>{t.time}</div>
            </div>
            <button
              className={styles.taskRemoveBtn}
              onClick={() => removeTask(t.id)}
              title="Remover"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {adding ? (
        <div className={styles.addTaskCard}>
          <div className={styles.addTaskTitle}>Nova Tarefa</div>
          <input
            className={styles.mInput}
            placeholder="Descrição da tarefa..."
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            autoFocus
          />
          <input
            className={styles.mInput}
            type="time"
            value={newTime}
            onChange={e => setNewTime(e.target.value)}
          />
          <div className={styles.newReqBtns}>
            <button className={styles.mBtnGhost} onClick={cancelAdd}>Cancelar</button>
            <button
              className={styles.mBtnPrimary}
              onClick={addTask}
              disabled={!newTitle.trim()}
            >
              Adicionar
            </button>
          </div>
        </div>
      ) : (
        <button className={styles.mBtnSecondary} onClick={() => setAdding(true)}>
          <Plus size={15} /> Nova Tarefa
        </button>
      )}
    </div>
  )
}

function HoursScreen() {
  const days = [
    { day: 'Seg', worked: '08h22', status: 'normal' },
    { day: 'Ter', worked: '08h05', status: 'normal' },
    { day: 'Qua', worked: '09h44', status: 'overtime' },
    { day: 'Qui', worked: '07h58', status: 'normal' },
    { day: 'Sex', worked: '04h30', status: 'partial' },
  ]

  return (
    <div className={styles.screen}>
      <div className={styles.pageTitle}>Minhas Horas</div>

      <div className={styles.hoursGrid}>
        <div className={styles.hoursCard}>
          <div className={styles.hoursVal}>38h39</div>
          <div className={styles.hoursLabel}>Esta semana</div>
        </div>
        <div className={styles.hoursCard}>
          <div className={styles.hoursVal} style={{ color: '#39B54A' }}>+4h22</div>
          <div className={styles.hoursLabel}>Banco de horas</div>
        </div>
        <div className={styles.hoursCard}>
          <div className={styles.hoursVal}>176h</div>
          <div className={styles.hoursLabel}>Mês atual</div>
        </div>
        <div className={styles.hoursCard}>
          <div className={styles.hoursVal}>91%</div>
          <div className={styles.hoursLabel}>Pontualidade</div>
        </div>
      </div>

      <div className={styles.dayList}>
        <div className={styles.dayListTitle}>Registros da Semana</div>
        {days.map(d => (
          <div key={d.day} className={styles.dayRow}>
            <span className={styles.dayName}>{d.day}</span>
            <div className={styles.dayBar}>
              <div
                className={[styles.dayBarFill, d.status === 'overtime' ? styles.dayBarExtra : d.status === 'partial' ? styles.dayBarPartial : styles.dayBarNormal].join(' ')}
                style={{ width: `${Math.min(100, (parseInt(d.worked) / 9) * 100)}%` }}
              />
            </div>
            <span className={[styles.dayHours, d.status === 'overtime' ? styles.hoursExtra : ''].join(' ')}>{d.worked}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ScheduleScreen() {
  const now = useClock()
  const todayIdx = now.getDay() === 0 ? 6 : now.getDay() - 1 // Mon=0..Sun=6

  // generate this week Mon→Sun with mock punch data
  const weekDays = useMemo(() => {
    const monday = new Date(now)
    monday.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1))
    return ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].map((label, i) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      const isWeekend = i >= 5
      const isPast    = d < new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const isToday   = i === todayIdx

      let status = 'rest'
      let entry  = null, exit = null, total = null

      if (!isWeekend) {
        if (isPast) {
          const lates  = [1] // Tue late
          const absents= []
          if (absents.includes(i)) {
            status = 'absent'
          } else if (lates.includes(i)) {
            status = 'late'
            entry = '08:23'; exit = '17:02'; total = '07h51'
          } else {
            status = 'ok'
            const entries = ['08:01','07:58','08:02','07:55']
            const exits   = ['17:00','17:03','17:01','17:00']
            entry = entries[i % entries.length]
            exit  = exits[i % exits.length]
            total = '08h00'
          }
        } else if (isToday) {
          status = 'today'
          entry = '08:01'; exit = null; total = null
        } else {
          status = 'future'
        }
      }

      return { label, date: d.getDate(), status, entry, exit, total, isToday, isWeekend }
    })
  }, [now, todayIdx])

  const schedule = [
    { label: 'Entrada',          value: '08:00' },
    { label: 'Intervalo início', value: '12:00' },
    { label: 'Intervalo fim',    value: '13:00' },
    { label: 'Saída',            value: '17:00' },
    { label: 'Carga semanal',    value: '44h/sem' },
    { label: 'Modalidade',       value: 'Presencial' },
  ]

  const STATUS_STYLE = {
    ok:     { dot: '#39B54A', label: 'Pontual'  },
    late:   { dot: '#F59E0B', label: 'Atraso'   },
    absent: { dot: '#EF4444', label: 'Falta'    },
    today:  { dot: '#1565C0', label: 'Hoje'     },
    future: { dot: '#E2E8F0', label: '—'        },
    rest:   { dot: '#E2E8F0', label: 'Folga'    },
  }

  return (
    <div className={styles.screen}>
      <div className={styles.pageTitle}>Minha Escala</div>

      {/* Week strip with real punch status */}
      <div className={styles.weekStrip}>
        {weekDays.map((day, i) => {
          const s = STATUS_STYLE[day.status]
          return (
            <div
              key={i}
              className={[
                styles.weekDay,
                day.isToday   ? styles.weekDayToday   : '',
                day.isWeekend ? styles.weekDayWeekend : '',
              ].join(' ')}
            >
              <div className={styles.weekDayLabel}>{day.label}</div>
              <div className={[styles.weekDayNum, day.isToday ? styles.weekDayNumToday : ''].join(' ')}>
                {day.date}
              </div>
              <div className={styles.weekDayDot} style={{ background: s.dot }} />
              <div className={styles.weekDayStatus} style={{ color: s.dot }}>{s.label}</div>
            </div>
          )
        })}
      </div>

      {/* Today's punches */}
      <div className={styles.todayPunches}>
        <div className={styles.todayPunchesTitle}>Registros de hoje</div>
        {[
          { label: 'Entrada',          time: '08:01', done: true  },
          { label: 'Saída Almoço',     time: null,    done: false },
          { label: 'Retorno Almoço',   time: null,    done: false },
          { label: 'Saída',            time: null,    done: false },
        ].map((p, i) => (
          <div key={i} className={styles.punchRecord}>
            <div className={[styles.punchRecordDot, p.done ? styles.punchRecordDotDone : ''].join(' ')} />
            <span className={styles.punchRecordLabel}>{p.label}</span>
            <span className={[styles.punchRecordTime, !p.done ? styles.punchRecordPending : ''].join(' ')}>
              {p.time || '—'}
            </span>
          </div>
        ))}
      </div>

      {/* Schedule details */}
      <div className={styles.scheduleCard}>
        <div className={styles.scheduleTitle}>Escala Padrão 44h</div>
        <div className={styles.scheduleDays}>Segunda a Sexta-feira</div>
        {schedule.map(s => (
          <div key={s.label} className={styles.scheduleRow}>
            <span className={styles.schLabel}>{s.label}</span>
            <span className={styles.schValue}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProfileScreen({ onLogout }) {
  const [photo, setPhoto] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const reader = new FileReader()
    reader.onload = async (ev) => {
      await new Promise(r => setTimeout(r, 700))
      setPhoto(ev.target.result)
      setUploading(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className={styles.screen}>
      <div className={styles.profileTop}>
        {/* Avatar with photo upload */}
        <div className={styles.profileAvatarWrap}>
          {photo ? (
            <img src={photo} alt="Foto" className={styles.profileAvatarImg} />
          ) : (
            <div className={styles.profileAvatarLg}>{USER.avatar}</div>
          )}
          <label className={styles.profilePhotoBtn} title="Trocar foto">
            {uploading ? (
              <div className={styles.uploadSpinner} />
            ) : (
              <span className={styles.cameraIcon}>📷</span>
            )}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhoto}
            />
          </label>
        </div>

        {saved && (
          <div className={styles.photoSavedBanner}>
            <CheckCircle size={13} /> Foto atualizada!
          </div>
        )}

        <div className={styles.profileName}>{USER.name}</div>
        <div className={styles.profileRole}>{USER.role}</div>
        <div className={styles.profileDept}>{USER.dept}</div>
      </div>

      <div className={styles.profileList}>
        {[
          { label: 'E-mail',    value: 'joao.souza@empresa.com.br' },
          { label: 'CPF',       value: '123.456.789-00' },
          { label: 'Matrícula', value: '0042' },
          { label: 'Admissão',  value: '01/03/2022' },
          { label: 'Jornada',   value: '08:00 – 17:00' },
        ].map(item => (
          <div key={item.label} className={styles.profileRow}>
            <span className={styles.profileLabel}>{item.label}</span>
            <span className={styles.profileVal}>{item.value}</span>
          </div>
        ))}
      </div>

      <button className={styles.logoutBtn} onClick={onLogout}>
        <LogOut size={16} /> Sair da conta
      </button>
    </div>
  )
}

function RequestsScreen() {
  const [requests, setRequests] = useState([
    { id: 1, type: 'Falta',    date: '2026-04-15', status: 'approved', reason: 'Consulta médica' },
    { id: 2, type: 'Atraso',   date: '2026-04-20', status: 'pending',  reason: 'Problema no metrô' },
    { id: 3, type: 'H. Extra', date: '2026-04-22', status: 'pending',  reason: 'Projeto urgente' },
  ])
  const [showNew, setShowNew] = useState(false)
  const [newType, setNewType] = useState('Falta')
  const [newReason, setNewReason] = useState('')

  const statusColors = { approved: '#39B54A', pending: '#F59E0B', rejected: '#EF4444' }
  const statusLabels = { approved: 'Aprovado', pending: 'Pendente', rejected: 'Rejeitado' }

  const submit = () => {
    if (!newReason) return
    setRequests(prev => [...prev, {
      id: Date.now(), type: newType, date: new Date().toISOString().slice(0,10),
      status: 'pending', reason: newReason,
    }])
    setNewReason('')
    setShowNew(false)
  }

  return (
    <div className={styles.screen}>
      <div className={styles.pageTitle}>Solicitações</div>

      {showNew ? (
        <div className={styles.newReqCard}>
          <div className={styles.newReqTitle}>Nova Solicitação</div>
          <div className={styles.mField}>
            <label className={styles.mLabel}>Tipo</label>
            <select className={styles.mInput} value={newType} onChange={e => setNewType(e.target.value)}>
              {['Falta','Atraso','H. Extra','Ajuste'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className={styles.mField}>
            <label className={styles.mLabel}>Justificativa</label>
            <textarea className={styles.mTextarea} rows={3} value={newReason} onChange={e => setNewReason(e.target.value)} placeholder="Descreva o motivo..." />
          </div>
          <div className={styles.newReqBtns}>
            <button className={styles.mBtnGhost} onClick={() => setShowNew(false)}>Cancelar</button>
            <button className={styles.mBtnPrimary} onClick={submit}>Enviar</button>
          </div>
        </div>
      ) : (
        <button className={styles.mBtnSecondary} onClick={() => setShowNew(true)}>
          <Plus size={15} /> Nova Solicitação
        </button>
      )}

      <div className={styles.reqList}>
        {requests.map(r => (
          <div key={r.id} className={styles.reqRow}>
            <div className={styles.reqLeft}>
              <div className={styles.reqType}>{r.type}</div>
              <div className={styles.reqDate}>{r.date}</div>
              <div className={styles.reqReason}>{r.reason}</div>
            </div>
            <div
              className={styles.reqStatus}
              style={{ background: `${statusColors[r.status]}22`, color: statusColors[r.status] }}
            >
              {statusLabels[r.status]}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Bottom Nav ─────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'home',     icon: Home,         label: 'Início' },
  { id: 'tasks',    icon: CheckSquare,  label: 'Tarefas' },
  { id: 'hours',    icon: BarChart2,    label: 'Horas' },
  { id: 'requests', icon: Bell,         label: 'Pedidos' },
  { id: 'profile',  icon: User,         label: 'Perfil' },
]

// ── Main Mobile App ───────────────────────────────────────────
export default function MobileApp() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [screen,   setScreen]   = useState('home')

  if (!loggedIn) return (
    <div className={styles.phoneFrame}>
      <div className={styles.phoneBrow} />
      <LoginScreen onLogin={() => setLoggedIn(true)} />
    </div>
  )

  const screens = {
    home:     <HomeScreen onNav={setScreen} />,
    tasks:    <TasksScreen />,
    hours:    <HoursScreen />,
    schedule: <ScheduleScreen />,
    requests: <RequestsScreen />,
    profile:  <ProfileScreen onLogout={() => setLoggedIn(false)} />,
  }

  return (
    <div className={styles.phoneFrame}>
      <div className={styles.phoneBrow} />
      <div className={styles.phoneContent}>
        <div className={styles.screenWrap}>
          {screens[screen] || screens.home}
        </div>
        <nav className={styles.bottomNav}>
          {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              className={[styles.navItem, screen === id ? styles.navActive : ''].join(' ')}
              onClick={() => setScreen(id)}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
