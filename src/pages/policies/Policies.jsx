import { useState } from 'react'
import { Shield, Clock, AlertTriangle, DollarSign, Save, Info } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { useToast } from '../../components/ui/ToastContainer'
import styles from './Policies.module.css'

const TABS = [
  { id: 'tolerance', label: 'Tolerâncias', icon: Clock },
  { id: 'overtime', label: 'Horas Extras', icon: DollarSign },
  { id: 'absence', label: 'Faltas e Atrasos', icon: AlertTriangle },
  { id: 'bank', label: 'Banco de Horas', icon: Shield },
]

const defaultConfig = {
  tolerance: {
    entryBefore: '10',
    entryAfter: '10',
    exitBefore: '10',
    exitAfter: '10',
    intervalMinus: '10',
    intervalPlus: '10',
    considerLate: 'yes',
    lateThreshold: '5',
  },
  overtime: {
    dailyLimit: '2',
    weeklyLimit: '10',
    monthlyLimit: '40',
    rate50: 'yes',
    rate100: 'yes',
    rate100Threshold: '2',
    sunday: '100',
    holiday: '100',
    autoApprove: 'no',
    maxAutoApprove: '30',
  },
  absence: {
    justifyDeadline: '48',
    medicalCertDeadline: '48',
    discountMode: 'proportional',
    halfDayAbsence: 'yes',
    partialJustify: 'yes',
    consecutiveTrigger: '3',
    consecutiveAction: 'notify',
  },
  bank: {
    enabled: 'yes',
    maxBalance: '80',
    maxNegative: '20',
    expiryMonths: '6',
    compensation: 'employee_choose',
    payoutOnTermination: 'yes',
    approvalRequired: 'yes',
  },
}

function InfoBox({ children }) {
  return (
    <div className={styles.infoBox}>
      <Info size={14} color="#1565C0" style={{ flexShrink: 0 }} />
      <span>{children}</span>
    </div>
  )
}

export default function Policies() {
  const toast = useToast()
  const [activeTab, setActiveTab] = useState('tolerance')
  const [config, setConfig] = useState(defaultConfig)

  const set = (section, key, val) => {
    setConfig(prev => ({ ...prev, [section]: { ...prev[section], [key]: val } }))
  }

  const save = () => toast('Política salva com sucesso!', 'success')

  const c = config[activeTab]

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Políticas de Ponto</h1>
          <p className={styles.sub}>Configure as regras de tolerância, horas extras e tratamento de faltas</p>
        </div>
        <Button variant="primary" icon={<Save size={15} />} onClick={save}>Salvar Políticas</Button>
      </div>

      <div className={styles.layout}>
        {/* Tab sidebar */}
        <Card className={styles.tabNav}>
          {TABS.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                className={[styles.tabBtn, activeTab === tab.id ? styles.tabActive : ''].join(' ')}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            )
          })}
        </Card>

        {/* Content */}
        <Card className={styles.content}>
          {activeTab === 'tolerance' && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Tolerâncias de Registro</div>
              <InfoBox>
                Tolerâncias permitem pequenas variações sem penalizar o funcionário. Registros dentro da tolerância
                são tratados como pontuais. CLT Art. 58 §1º permite até 5 minutos por registro.
              </InfoBox>

              <div className={styles.fieldGroup}>
                <div className={styles.fieldGroupTitle}>Entrada</div>
                <div className={styles.row2}>
                  <Input
                    label="Tolerância antes (min)"
                    type="number"
                    value={c.entryBefore}
                    onChange={e => set('tolerance', 'entryBefore', e.target.value)}
                  />
                  <Input
                    label="Tolerância depois (min)"
                    type="number"
                    value={c.entryAfter}
                    onChange={e => set('tolerance', 'entryAfter', e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.fieldGroupTitle}>Saída</div>
                <div className={styles.row2}>
                  <Input
                    label="Tolerância antes (min)"
                    type="number"
                    value={c.exitBefore}
                    onChange={e => set('tolerance', 'exitBefore', e.target.value)}
                  />
                  <Input
                    label="Tolerância depois (min)"
                    type="number"
                    value={c.exitAfter}
                    onChange={e => set('tolerance', 'exitAfter', e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.fieldGroupTitle}>Intervalo</div>
                <div className={styles.row2}>
                  <Input
                    label="Redução máx. permitida (min)"
                    type="number"
                    value={c.intervalMinus}
                    onChange={e => set('tolerance', 'intervalMinus', e.target.value)}
                  />
                  <Input
                    label="Excesso máx. sem desconto (min)"
                    type="number"
                    value={c.intervalPlus}
                    onChange={e => set('tolerance', 'intervalPlus', e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.row2}>
                <Select
                  label="Considerar atraso"
                  value={c.considerLate}
                  onChange={e => set('tolerance', 'considerLate', e.target.value)}
                  options={[{ value: 'yes', label: 'Sim' }, { value: 'no', label: 'Não' }]}
                />
                <Input
                  label="Atraso mínimo a registrar (min)"
                  type="number"
                  value={c.lateThreshold}
                  onChange={e => set('tolerance', 'lateThreshold', e.target.value)}
                />
              </div>
            </div>
          )}

          {activeTab === 'overtime' && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Regras de Horas Extras</div>
              <InfoBox>
                Horas extras devem ser remuneradas com adicional mínimo de 50% (CLT Art. 59). Domingos e feriados
                têm adicional de 100%. Configure os limites e percentuais conforme convenção coletiva.
              </InfoBox>

              <div className={styles.fieldGroup}>
                <div className={styles.fieldGroupTitle}>Limites</div>
                <div className={styles.row3}>
                  <Input label="Limite diário (h)" type="number" value={c.dailyLimit} onChange={e => set('overtime', 'dailyLimit', e.target.value)} />
                  <Input label="Limite semanal (h)" type="number" value={c.weeklyLimit} onChange={e => set('overtime', 'weeklyLimit', e.target.value)} />
                  <Input label="Limite mensal (h)" type="number" value={c.monthlyLimit} onChange={e => set('overtime', 'monthlyLimit', e.target.value)} />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.fieldGroupTitle}>Percentuais de Adicional</div>
                <div className={styles.row2}>
                  <Input label="Adicional padrão (%)" type="number" value="50" readOnly />
                  <Input
                    label="Horas acima de (h/dia) → 100%"
                    type="number"
                    value={c.rate100Threshold}
                    onChange={e => set('overtime', 'rate100Threshold', e.target.value)}
                  />
                </div>
                <div className={styles.row2}>
                  <Input label="Domingo (%)" type="number" value={c.sunday} onChange={e => set('overtime', 'sunday', e.target.value)} />
                  <Input label="Feriado (%)" type="number" value={c.holiday} onChange={e => set('overtime', 'holiday', e.target.value)} />
                </div>
              </div>

              <div className={styles.row2}>
                <Select
                  label="Aprovação automática"
                  value={c.autoApprove}
                  onChange={e => set('overtime', 'autoApprove', e.target.value)}
                  options={[{ value: 'yes', label: 'Sim, até o limite' }, { value: 'no', label: 'Não, sempre aprovar' }]}
                />
                <Input
                  label="Limite auto-aprovação (min)"
                  type="number"
                  value={c.maxAutoApprove}
                  onChange={e => set('overtime', 'maxAutoApprove', e.target.value)}
                  disabled={c.autoApprove === 'no'}
                />
              </div>
            </div>
          )}

          {activeTab === 'absence' && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Faltas e Atrasos</div>
              <InfoBox>
                Defina as regras de justificativa e desconto. Atestados médicos suspendem o desconto conforme
                CLT Art. 131 e Lei 605/49.
              </InfoBox>

              <div className={styles.row2}>
                <Input
                  label="Prazo justificativa (horas)"
                  type="number"
                  value={c.justifyDeadline}
                  onChange={e => set('absence', 'justifyDeadline', e.target.value)}
                />
                <Input
                  label="Prazo atestado médico (horas)"
                  type="number"
                  value={c.medicalCertDeadline}
                  onChange={e => set('absence', 'medicalCertDeadline', e.target.value)}
                />
              </div>

              <Select
                label="Modo de desconto"
                value={c.discountMode}
                onChange={e => set('absence', 'discountMode', e.target.value)}
                options={[
                  { value: 'proportional', label: 'Proporcional às horas faltadas' },
                  { value: 'full_day', label: 'Dia inteiro de falta' },
                  { value: 'dsr', label: 'Proporcional + DSR' },
                ]}
              />

              <div className={styles.row2}>
                <Select
                  label="Permitir falta meio-período"
                  value={c.halfDayAbsence}
                  onChange={e => set('absence', 'halfDayAbsence', e.target.value)}
                  options={[{ value: 'yes', label: 'Sim' }, { value: 'no', label: 'Não' }]}
                />
                <Select
                  label="Justificativa parcial"
                  value={c.partialJustify}
                  onChange={e => set('absence', 'partialJustify', e.target.value)}
                  options={[{ value: 'yes', label: 'Permitir' }, { value: 'no', label: 'Bloquear' }]}
                />
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.fieldGroupTitle}>Alertas automáticos</div>
                <div className={styles.row2}>
                  <Input
                    label="Faltas consecutivas para alerta"
                    type="number"
                    value={c.consecutiveTrigger}
                    onChange={e => set('absence', 'consecutiveTrigger', e.target.value)}
                  />
                  <Select
                    label="Ação ao atingir"
                    value={c.consecutiveAction}
                    onChange={e => set('absence', 'consecutiveAction', e.target.value)}
                    options={[
                      { value: 'notify', label: 'Notificar gestor' },
                      { value: 'block', label: 'Bloquear acesso' },
                      { value: 'hr', label: 'Escalar para RH' },
                    ]}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bank' && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Banco de Horas</div>
              <InfoBox>
                O banco de horas permite compensar horas extras com folgas, conforme CLT Art. 59 §2º e
                Portaria MTE. Configure os limites e regras de compensação.
              </InfoBox>

              <Select
                label="Habilitar banco de horas"
                value={c.enabled}
                onChange={e => set('bank', 'enabled', e.target.value)}
                options={[{ value: 'yes', label: 'Sim' }, { value: 'no', label: 'Não (pagar como hora extra)' }]}
              />

              {c.enabled === 'yes' && (
                <>
                  <div className={styles.row2}>
                    <Input
                      label="Saldo máximo positivo (h)"
                      type="number"
                      value={c.maxBalance}
                      onChange={e => set('bank', 'maxBalance', e.target.value)}
                    />
                    <Input
                      label="Saldo máximo negativo (h)"
                      type="number"
                      value={c.maxNegative}
                      onChange={e => set('bank', 'maxNegative', e.target.value)}
                    />
                  </div>

                  <div className={styles.row2}>
                    <Input
                      label="Validade do saldo (meses)"
                      type="number"
                      value={c.expiryMonths}
                      onChange={e => set('bank', 'expiryMonths', e.target.value)}
                    />
                    <Select
                      label="Quem solicita compensação"
                      value={c.compensation}
                      onChange={e => set('bank', 'compensation', e.target.value)}
                      options={[
                        { value: 'employee_choose', label: 'Funcionário escolhe' },
                        { value: 'manager_choose', label: 'Gestor escolhe' },
                        { value: 'auto', label: 'Sistema automático' },
                      ]}
                    />
                  </div>

                  <div className={styles.row2}>
                    <Select
                      label="Pagar saldo na rescisão"
                      value={c.payoutOnTermination}
                      onChange={e => set('bank', 'payoutOnTermination', e.target.value)}
                      options={[{ value: 'yes', label: 'Sim, pagar tudo' }, { value: 'no', label: 'Não' }]}
                    />
                    <Select
                      label="Exige aprovação do gestor"
                      value={c.approvalRequired}
                      onChange={e => set('bank', 'approvalRequired', e.target.value)}
                      options={[{ value: 'yes', label: 'Sim' }, { value: 'no', label: 'Não' }]}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
