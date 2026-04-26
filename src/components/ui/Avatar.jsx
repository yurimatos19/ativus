import styles from './Avatar.module.css'

const COLORS = ['#1565C0','#39B54A','#29ABE2','#0B2354','#8DC63F','#F59E0B','#EF4444','#7C3AED']

function initials(name = '') {
  return name.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()
}

function colorFor(name = '') {
  let h = 0
  for (let c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff
  return COLORS[Math.abs(h) % COLORS.length]
}

export default function Avatar({ name, src, size = 'md', className = '' }) {
  const bg = colorFor(name)
  return (
    <div
      className={[styles.avatar, styles[size], className].join(' ')}
      style={src ? {} : { background: bg }}
      title={name}
    >
      {src
        ? <img src={src} alt={name} className={styles.img} />
        : <span className={styles.text}>{initials(name)}</span>
      }
    </div>
  )
}
