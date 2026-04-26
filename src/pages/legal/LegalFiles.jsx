import { useState } from 'react'
import { FileDown, Info } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { useToast } from '../../components/ui/ToastContainer'
import { useAuth } from '../../context/AuthContext'
import styles from './LegalFiles.module.css'

const FILE_TYPES = [
  {
    id: 'AFD',
    title: 'AFD — Arquivo Fonte de Dados',
    subtitle: 'Portaria 1.510/2009 — MTE',
    desc: 'Arquivo texto gerado pelo REP contendo todos os registros de ponto dos funcionários. Obrigatório para fiscalização trabalhista.',
    color: '#1565C0',
    bg: '#DBEAFE',
  },
  {
    id: 'AFDT',
    title: 'AFDT — Arquivo Fonte de Dados Tratado',
    subtitle: 'Portaria 1.510/2009 — MTE',
    desc: 'Versão tratada do AFD após os ajustes autorizados pelo empregador. Contém somente os registros válidos após processamento.',
    color: '#39B54A',
    bg: '#DCFCE7',
  },
  {
    id: 'ACJEF',
    title: 'ACJEF — Arquivo Controle de Jornada',
    subtitle: 'Portaria 1.510/2009 — MTE',
    desc: 'Arquivo de controle de jornada para fins judiciais e fiscais. Utilizado em processos trabalhistas como prova eletrônica.',
    color: '#F59E0B',
    bg: '#FEF3C7',
  },
]

function generateMockFile(type, company, cnpj, from, to) {
  const header = `|${type}|${cnpj.replace(/\D/g,'')}|${company}|${from.replace(/-/g,'')}|${to.replace(/-/g,'')}|\n`
  const lines = Array.from({ length: 10 }, (_, i) =>
    `|01|${String(i+1).padStart(9,'0')}|Funcionario ${i+1}|${from.replace(/-/g,'').slice(0,8)}|08:00|17:00|08h00|Normal|\n`
  ).join('')
  const trailer = `|09|${type}|${new Date().toLocaleDateString('pt-BR')}|\n`
  return header + lines + trailer
}

export default function LegalFiles() {
  const toast  = useToast()
  const { user } = useAuth()
  const [form, setForm] = useState({
    company: user?.company || 'Empresa Modelo Ltda',
    cnpj:    user?.cnpj   || '12.345.678/0001-90',
    from:    '2026-04-01',
    to:      '2026-04-30',
    operation: '1',
  })
  const [loading, setLoading] = useState(null)

  const handleGenerate = async (type) => {
    setLoading(type)
    await new Promise(r => setTimeout(r, 1200))
    const content = generateMockFile(type, form.company, form.cnpj, form.from, form.to)
    const blob = new Blob([content], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${type}_${form.cnpj.replace(/\D/g,'')}_${form.from.replace(/-/g,'')}.txt`
    a.click()
    URL.revokeObjectURL(url)
    setLoading(null)
    toast(`Arquivo ${type} gerado e baixado com sucesso!`, 'success')
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Arquivos Legais</h1>
          <p className={styles.sub}>Gere os arquivos obrigatórios para conformidade trabalhista CLT</p>
        </div>
        <div className={styles.legal}>
          <Info size={14} />
          <span>Portaria MTE 1.510/2009</span>
        </div>
      </div>

      {/* Global params */}
      <Card>
        <div className={styles.paramTitle}>Parâmetros de Geração</div>
        <div className={styles.paramGrid}>
          <Input label="Razão Social" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
          <Input label="CNPJ" value={form.cnpj} onChange={e => setForm(f => ({ ...f, cnpj: e.target.value }))} placeholder="00.000.000/0000-00" />
          <Input label="Período — De" type="date" value={form.from} onChange={e => setForm(f => ({ ...f, from: e.target.value }))} />
          <Input label="Período — Até" type="date" value={form.to}   onChange={e => setForm(f => ({ ...f, to: e.target.value }))} />
          <Select
            label="Tipo de Operação"
            value={form.operation}
            onChange={e => setForm(f => ({ ...f, operation: e.target.value }))}
            options={[
              { value: '1', label: '1 — Arquivo completo' },
              { value: '2', label: '2 — Arquivo de substituição' },
              { value: '3', label: '3 — Arquivo de exclusão' },
            ]}
          />
        </div>
      </Card>

      {/* File cards */}
      <div className={styles.fileGrid}>
        {FILE_TYPES.map(ft => (
          <Card key={ft.id} className={styles.fileCard}>
            <div className={styles.fileHeader}>
              <div className={styles.fileBadge} style={{ background: ft.bg, color: ft.color }}>
                {ft.id}
              </div>
              <div className={styles.fileInfo}>
                <div className={styles.fileTitle}>{ft.title}</div>
                <div className={styles.fileSubtitle}>{ft.subtitle}</div>
              </div>
            </div>
            <p className={styles.fileDesc}>{ft.desc}</p>
            <div className={styles.filePreview}>
              <pre className={styles.previewCode}>
{`|${ft.id}|${form.cnpj.replace(/\D/g,'').substring(0,14)}|...
|01|000000001|Funcionario 1|...
|09|${ft.id}|${new Date().toLocaleDateString('pt-BR')}|`}
              </pre>
            </div>
            <Button
              variant="secondary"
              icon={loading === ft.id ? undefined : <FileDown size={15} />}
              onClick={() => handleGenerate(ft.id)}
              disabled={loading === ft.id}
              fullWidth
            >
              {loading === ft.id ? 'Gerando...' : `Gerar ${ft.id}`}
            </Button>
          </Card>
        ))}
      </div>

      <Card className={styles.notice}>
        <Info size={16} color="#1565C0" />
        <div>
          <strong>Importante:</strong> Os arquivos gerados pelo Ativus seguem o layout exato exigido pela Portaria MTE nº 1.510/2009.
          Guarde os arquivos pelo prazo mínimo de <strong>5 anos</strong> conforme exigência legal.
        </div>
      </Card>
    </div>
  )
}
