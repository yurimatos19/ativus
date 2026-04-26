import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Clock, Users, FileText, CheckCircle, BarChart2,
  Shield, Smartphone, ArrowRight, Star, Zap, Globe,
} from 'lucide-react'
import styles from './LandingPage.module.css'

// ── Wave SVG ─────────────────────────────────────────────────
function Wave({ flip = false }) {
  return (
    <svg
      className={flip ? styles.waveFlip : styles.wave}
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1350,20 1440,40 L1440,80 L0,80 Z"
        fill="#F4F6F9"
      />
    </svg>
  )
}

// ── Nav ───────────────────────────────────────────────────────
function Nav({ onLogin }) {
  return (
    <header className={styles.nav}>
      <div className={styles.navInner}>
        <div className={styles.navLogo}>
          <div className={styles.navLogoIcon}>
            <img src="/assets/logo.png" alt="Ativus" className={styles.navLogoImg} />
          </div>
          <span className={styles.navLogoText}>Ativus</span>
        </div>
        <nav className={styles.navLinks}>
          <a href="#features">Funcionalidades</a>
          <a href="#how">Como Funciona</a>
          <a href="#pricing">Planos</a>
          <a href="#testimonials">Clientes</a>
        </nav>
        <div className={styles.navActions}>
          <button className={styles.navLogin} onClick={onLogin}>Entrar</button>
          <button className={styles.navCta} onClick={onLogin}>Começar Grátis</button>
        </div>
      </div>
    </header>
  )
}

// ── Hero ──────────────────────────────────────────────────────
function Hero({ onLogin }) {
  return (
    <section className={styles.hero}>
      {/* Animated background orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />

      <div className={styles.heroInner}>
        <div className={styles.heroBadge}>
          <Zap size={12} /> Novo · Agora com IA integrada
        </div>
        <h1 className={styles.heroTitle}>
          Do ponto<br />
          <span className={styles.heroGreen}>à produtividade.</span>
        </h1>
        <p className={styles.heroSub}>
          Controle de ponto 100% legal, gestão de jornada e produtividade —
          tudo em um só lugar. Mais de <strong>2.400 empresas</strong> confiam no Ativus.
        </p>

        <div className={styles.heroPills}>
          {['100% CLT','Registro Eletrônico','Multi-empresa','API aberta'].map(p => (
            <span key={p} className={styles.heroPill}>{p}</span>
          ))}
        </div>

        <div className={styles.heroCtas}>
          <button className={styles.ctaGreen} onClick={onLogin}>
            Começar Grátis — 14 dias
            <ArrowRight size={16} />
          </button>
          <button className={styles.ctaGhost} onClick={onLogin}>
            Ver Demo
          </button>
        </div>

        <div className={styles.heroStats}>
          {[
            { num: '+2.400', label: 'Empresas' },
            { num: '+120k',  label: 'Funcionários' },
            { num: '98%',    label: 'Conformidade CLT' },
            { num: '4.9★',  label: 'Avaliação' },
          ].map(s => (
            <div key={s.label} className={styles.heroStat}>
              <span className={styles.heroStatNum}>{s.num}</span>
              <span className={styles.heroStatLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dashboard preview */}
      <div className={styles.heroPreview}>
        <div className={styles.previewWindow}>
          <div className={styles.previewBar}>
            <span className={styles.dot} style={{ background: '#EF4444' }} />
            <span className={styles.dot} style={{ background: '#F59E0B' }} />
            <span className={styles.dot} style={{ background: '#39B54A' }} />
            <span className={styles.previewUrl}>app.ativus.com.br/dashboard</span>
          </div>
          <div className={styles.previewDash}>
            <div className={styles.pSidebar}>
              {['Painel','Funcionários','Registros','Espelho','Relatórios'].map((item, i) => (
                <div key={item} className={[styles.pNavItem, i === 0 ? styles.pNavActive : ''].join(' ')}>
                  <div className={styles.pNavDot} />
                  {item}
                </div>
              ))}
            </div>
            <div className={styles.pContent}>
              <div className={styles.pKpis}>
                {[
                  { label: 'Online', val: '8/12', color: '#39B54A' },
                  { label: 'H. Extra', val: '47h', color: '#1565C0' },
                  { label: 'Atrasos', val: '2', color: '#F59E0B' },
                  { label: 'Faltas', val: '2', color: '#EF4444' },
                ].map(k => (
                  <div key={k.label} className={styles.pKpi}>
                    <div className={styles.pKpiVal} style={{ color: k.color }}>{k.val}</div>
                    <div className={styles.pKpiLabel}>{k.label}</div>
                  </div>
                ))}
              </div>
              <div className={styles.pChart}>
                {[70,90,60,100,80].map((h, i) => (
                  <div key={i} className={styles.pBar} style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className={styles.pTable}>
                {['João S.','Maria L.','Pedro M.'].map(n => (
                  <div key={n} className={styles.pRow}>
                    <div className={styles.pAvatar}>{n.split(' ').map(x=>x[0]).join('')}</div>
                    <span>{n}</span>
                    <div className={styles.pBadge}>Normal</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Features ──────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Clock, color: '#1565C0', bg: '#DBEAFE',
    title: 'Ponto Eletrônico 100% Legal',
    desc: 'Conformidade total com a Portaria MTE 1.510/2009. Gere AFD, AFDT e ACJEF com um clique. Nunca mais pague multas trabalhistas.',
  },
  {
    icon: Users, color: '#39B54A', bg: '#DCFCE7',
    title: 'Gestão Completa da Equipe',
    desc: 'Gerencie escalas, jornadas, horas extras e banco de horas de toda a empresa em tempo real. Para equipes de 5 a 10.000 pessoas.',
  },
  {
    icon: BarChart2, color: '#F59E0B', bg: '#FEF3C7',
    title: 'Relatórios e Insights',
    desc: 'Dashboards em tempo real com KPIs de presença, produtividade e conformidade. Exporte para Excel, PDF ou integre via API.',
  },
  {
    icon: Smartphone, color: '#8DC63F', bg: '#F0FDF4',
    title: 'App Mobile para Funcionários',
    desc: 'Os funcionários registram o ponto pelo smartphone com GPS e selfie. Funciona offline. iOS e Android.',
  },
  {
    icon: Shield, color: '#7C3AED', bg: '#F5F3FF',
    title: 'Segurança e LGPD',
    desc: 'Dados criptografados em repouso e em trânsito. Controle de acesso por perfil. Auditoria completa. 100% LGPD.',
  },
  {
    icon: Globe, color: '#29ABE2', bg: '#EFF6FF',
    title: 'Integrações Nativas',
    desc: 'Conecte com Folhamatic, TOTVS, SAP, Google Workspace, Slack e mais de 40 sistemas via API REST.',
  },
]

function Features() {
  return (
    <section id="features" className={styles.features}>
      <Wave />
      <div className={styles.sectionInner}>
        <div className={styles.sectionTag}>Funcionalidades</div>
        <h2 className={styles.sectionTitle}>Tudo que você precisa para gerir jornada</h2>
        <p className={styles.sectionSub}>Do registro de ponto à análise de produtividade. Uma plataforma, zero complicação.</p>
        <div className={styles.featuresGrid}>
          {FEATURES.map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title} className={styles.featureCard}>
              <div className={styles.featureIcon} style={{ background: bg }}>
                <Icon size={22} color={color} />
              </div>
              <h3 className={styles.featureTitle}>{title}</h3>
              <p className={styles.featureDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── How It Works ──────────────────────────────────────────────
const STEPS = [
  { num: '01', title: 'Cadastre sua empresa', desc: 'Configure em 5 minutos: importe funcionários, defina escalas e integre com sua folha de pagamento.' },
  { num: '02', title: 'Funcionários batem ponto', desc: 'Via App Mobile, tablet na entrada, ou integração com REP homologado pelo MTE.' },
  { num: '03', title: 'Gestão em tempo real', desc: 'Acompanhe presença, aprove ajustes e gere relatórios legais no painel web — de qualquer lugar.' },
]

function HowItWorks() {
  return (
    <section id="how" className={styles.how}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionTag}>Como Funciona</div>
        <h2 className={styles.sectionTitle}>Simples de implementar. Poderoso no dia a dia.</h2>
        <div className={styles.stepsRow}>
          {STEPS.map((s, i) => (
            <div key={s.num} className={styles.step}>
              <div className={styles.stepNum}>{s.num}</div>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepDesc}>{s.desc}</p>
              {i < STEPS.length - 1 && <div className={styles.stepArrow}><ArrowRight size={20} /></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Pricing ───────────────────────────────────────────────────
// Fixed plans: by company size
const PLANS_FIXED = [
  {
    name: 'MEI / Microempresa', price: 'R$ 99,90', period: '/mês', highlight: false,
    desc: 'Até 10 funcionários', tag: null,
    features: ['Ponto eletrônico web + app','Espelho de ponto','AFD / AFDT','Relatórios básicos','Suporte por chat'],
  },
  {
    name: 'Pequena Empresa', price: 'R$ 299,90', period: '/mês', highlight: false,
    desc: 'Até 50 funcionários', tag: null,
    features: ['Tudo do MEI','Banco de horas','Escalas e jornadas','Ocorrências e atestados','Suporte prioritário'],
  },
  {
    name: 'Média Empresa', price: 'R$ 799,90', period: '/mês', highlight: true,
    desc: 'Até 200 funcionários', tag: 'Mais escolhido',
    features: ['Tudo da Pequena','Dashboard avançado','ACJEF','Integração ERP/Folha','API REST','Suporte SLA 4h'],
  },
  {
    name: 'Grande Empresa', price: 'R$ 1.999,90', period: '/mês', highlight: false,
    desc: 'Até 500 funcionários', tag: null,
    features: ['Tudo da Média','Multi-filial','IA de produtividade','Gerente de conta','Treinamento incluído'],
  },
  {
    name: 'Corporativo', price: 'R$ 5.999,90', period: '/mês', highlight: false,
    desc: 'Acima de 500 funcionários', tag: null,
    features: ['Tudo da Grande','SLA 99,9%','Infraestrutura dedicada','API ilimitada','Suporte 24/7','Multi-empresa'],
  },
]

const PLANS_VARIABLE = [
  {
    segment: 'Setor de Serviços (ex: varejo, limpeza)',
    price: 'R$ 8,00',
    per: 'por funcionário/mês',
    min: 'Mínimo R$ 99,90',
  },
  {
    segment: 'Indústria e Logística',
    price: 'R$ 14,00',
    per: 'por funcionário/mês',
    min: 'Mínimo R$ 199,90',
  },
  {
    segment: 'Saúde e Educação',
    price: 'R$ 18,00',
    per: 'por funcionário/mês',
    min: 'Mínimo R$ 149,90',
  },
  {
    segment: 'TI / Empresas com teletrabalho',
    price: 'R$ 25,00',
    per: 'por funcionário/mês',
    min: 'Mínimo R$ 99,90',
  },
]

function Pricing({ onLogin }) {
  const [mode, setMode] = useState('fixed')

  return (
    <section id="pricing" className={styles.pricing}>
      <Wave />
      <div className={styles.sectionInner}>
        <div className={styles.sectionTag}>Planos</div>
        <h2 className={styles.sectionTitle}>Preço justo, sem surpresas</h2>
        <p className={styles.sectionSub}>14 dias grátis em todos os planos. Sem cartão de crédito. Cancele quando quiser.</p>

        {/* Mode toggle */}
        <div className={styles.planToggle}>
          <button
            className={[styles.planToggleBtn, mode === 'fixed' ? styles.planToggleActive : ''].join(' ')}
            onClick={() => setMode('fixed')}
          >
            Plano Fixo
          </button>
          <button
            className={[styles.planToggleBtn, mode === 'variable' ? styles.planToggleActive : ''].join(' ')}
            onClick={() => setMode('variable')}
          >
            Plano Variável
          </button>
        </div>

        {mode === 'fixed' ? (
          <>
            <p className={styles.planModeDesc}>Preço fixo mensal por porte da empresa. Inclui todos os funcionários cadastrados.</p>
            <div className={styles.plansGridFixed}>
              {PLANS_FIXED.map(p => (
                <div key={p.name} className={[styles.planCard, p.highlight ? styles.planHighlight : ''].join(' ')}>
                  {p.tag && <div className={styles.planBadge}>{p.tag}</div>}
                  <div className={styles.planName}>{p.name}</div>
                  <div className={styles.planDesc}>{p.desc}</div>
                  <div className={styles.planPrice}>
                    {p.price}<span className={styles.planPeriod}>{p.period}</span>
                  </div>
                  <ul className={styles.planFeatures}>
                    {p.features.map(f => (
                      <li key={f} className={styles.planFeature}>
                        <CheckCircle size={13} color={p.highlight ? '#fff' : '#39B54A'} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={p.highlight ? styles.planCtaPrimary : styles.planCtaGhost}
                    onClick={onLogin}
                  >
                    Começar Grátis
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className={styles.planModeDesc}>Pague apenas pelos funcionários ativos. Ideal para operações sazonais ou em crescimento.</p>
            <div className={styles.plansGridVar}>
              {PLANS_VARIABLE.map(p => (
                <div key={p.segment} className={styles.varCard}>
                  <div className={styles.varSegment}>{p.segment}</div>
                  <div className={styles.varPrice}>{p.price}</div>
                  <div className={styles.varPer}>{p.per}</div>
                  <div className={styles.varMin}>{p.min}</div>
                  <button className={styles.planCtaGhost} style={{ width: '100%', marginTop: 16 }} onClick={onLogin}>
                    Ver Demo
                  </button>
                </div>
              ))}
            </div>
            <p className={styles.planVarNote}>
              * Cobrança mensal baseada no pico de funcionários ativos. Migração entre planos sem custo.
            </p>
          </>
        )}
      </div>
    </section>
  )
}

// ── Testimonials ──────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: 'Carla Mendonça', role: 'Diretora de RH', company: 'Logística Rápida S/A',
    text: 'O Ativus eliminou completamente o trabalho manual com folha de ponto. Economizamos 40h/mês só na conferência de registros.',
    stars: 5,
  },
  {
    name: 'Roberto Figueiredo', role: 'CEO', company: 'TechVenture Brasil',
    text: 'Implementamos em 3 dias para 80 funcionários. A integração com o TOTVS é perfeita e o suporte é excepcional.',
    stars: 5,
  },
  {
    name: 'Patrícia Alves', role: 'Gerente Operacional', company: 'Rede Comercial Norte',
    text: 'Finalmente um sistema que os funcionários realmente usam. O App é simples e nunca tivemos problema de compliance.',
    stars: 5,
  },
]

function Testimonials() {
  return (
    <section id="testimonials" className={styles.testimonials}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionTag}>Clientes</div>
        <h2 className={styles.sectionTitle}>Quem já usa o Ativus</h2>
        <div className={styles.testimonialsGrid}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} className={styles.testimonialCard}>
              <div className={styles.stars}>
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <p className={styles.testimonialText}>"{t.text}"</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>
                  {t.name.split(' ').map(p => p[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className={styles.testimonialName}>{t.name}</div>
                  <div className={styles.testimonialRole}>{t.role} · {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA Banner ────────────────────────────────────────────────
function CTABanner({ onLogin }) {
  return (
    <section className={styles.ctaBanner}>
      <div className={styles.ctaBannerInner}>
        <h2 className={styles.ctaBannerTitle}>Pronto para controlar sua jornada?</h2>
        <p className={styles.ctaBannerSub}>Comece grátis hoje. Sem cartão de crédito. Cancele quando quiser.</p>
        <div className={styles.ctaBannerBtns}>
          <button className={styles.ctaGreen} onClick={onLogin}>
            Começar Grátis — 14 dias <ArrowRight size={16} />
          </button>
          <button className={styles.ctaGhostDark} onClick={onLogin}>Agendar Demo</button>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <div className={styles.footerLogoRow}>
            <div className={styles.footerLogoIcon}>
              <img src="/assets/logo.png" alt="Ativus" className={styles.footerLogoImg} />
            </div>
            <span className={styles.footerLogoText}>Ativus</span>
          </div>
          <p className={styles.footerTagline}>Do ponto à produtividade.</p>
          <p className={styles.footerDesc}>
            Sistema de controle de ponto e gestão de jornada para empresas brasileiras.
            100% em conformidade com a CLT e Portaria MTE 1.510/2009.
          </p>
        </div>

        <div className={styles.footerLinks}>
          {[
            { title: 'Produto',  links: ['Funcionalidades','Como Funciona','Planos','API','Changelog'] },
            { title: 'Empresa',  links: ['Sobre nós','Blog','Parceiros','Trabalhe conosco','Imprensa'] },
            { title: 'Suporte', links: ['Central de Ajuda','Documentação','Status','LGPD','Termos de Uso'] },
          ].map(col => (
            <div key={col.title} className={styles.footerCol}>
              <div className={styles.footerColTitle}>{col.title}</div>
              {col.links.map(l => <a key={l} href="#" className={styles.footerLink}>{l}</a>)}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.footerBottom}>
        <span>© 2026 Ativus Tecnologia Ltda. CNPJ 00.000.000/0001-00</span>
        <span className={styles.footerLgpd}>🔒 LGPD Compliance · ISO 27001</span>
      </div>
    </footer>
  )
}

// ── Main ──────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()
  const goLogin = () => navigate('/login')

  return (
    <div className={styles.page}>
      <Nav onLogin={goLogin} />
      <Hero onLogin={goLogin} />
      <Features />
      <HowItWorks />
      <Pricing onLogin={goLogin} />
      <Testimonials />
      <CTABanner onLogin={goLogin} />
      <Footer />
    </div>
  )
}
