import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import styles from './Login.module.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('mariana@empresa.com.br')
  const [password, setPassword] = useState('senha123')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Preencha todos os campos.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    login(email, password)
    navigate('/dashboard')
  }

  return (
    <div className={styles.page}>
      {/* Left — hero */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.logoRow}>
            <div className={styles.logoIcon}>
              <img src="/assets/logo.png" alt="Ativus" className={styles.logoImg} />
            </div>
            <span className={styles.logoText}>Ativus</span>
          </div>

          <h1 className={styles.heroTitle}>
            Do ponto<br />à produtividade.
          </h1>
          <p className={styles.heroSub}>
            Controle de ponto 100% legal, gestão de jornada e produtividade — tudo em um só lugar.
          </p>

          <div className={styles.pillsRow}>
            {['100% Legal','Simples','Completo','Integrado'].map(p => (
              <span key={p} className={styles.pill}>{p}</span>
            ))}
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}><span className={styles.statNum}>+2.400</span><span className={styles.statLabel}>Empresas</span></div>
            <div className={styles.statDiv} />
            <div className={styles.stat}><span className={styles.statNum}>98%</span><span className={styles.statLabel}>Conformidade CLT</span></div>
            <div className={styles.statDiv} />
            <div className={styles.stat}><span className={styles.statNum}>4.9★</span><span className={styles.statLabel}>Avaliação</span></div>
          </div>
        </div>

        {/* Wave decoration */}
        <svg className={styles.wave} viewBox="0 0 200 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,200 Q50,100 100,200 Q150,300 200,200 L200,400 L0,400 Z" fill="rgba(41,171,226,0.08)" />
          <path d="M0,250 Q60,150 120,250 Q170,330 200,250 L200,400 L0,400 Z" fill="rgba(57,181,74,0.06)" />
        </svg>
      </div>

      {/* Right — form */}
      <div className={styles.formSide}>
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Entrar na sua conta</h2>
          <p className={styles.formSub}>Acesse o painel de gestão da sua empresa.</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              id="email"
              label="E-mail"
              type="email"
              placeholder="voce@empresa.com.br"
              value={email}
              onChange={e => setEmail(e.target.value)}
              icon={<Mail size={15} />}
              required
            />
            <div className={styles.pwdField}>
              <Input
                id="password"
                label="Senha"
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                icon={<Lock size={15} />}
                required
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPwd(v => !v)}
                tabIndex={-1}
              >
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <div className={styles.row}>
              <label className={styles.remember}>
                <input type="checkbox" className={styles.checkbox} defaultChecked />
                Lembrar de mim
              </label>
              <a href="#" className={styles.forgot}>Esqueci minha senha</a>
            </div>

            {error && <p className={styles.errorMsg}>{error}</p>}

            <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <p className={styles.hint}>
            Acesso exclusivo para gestores e RH.
            <br />
            Funcionários usam o <strong>App Ativus</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}
