import styles from './Badge.module.css'

const variantMap = {
  success: styles.success,
  warning: styles.warning,
  error:   styles.error,
  info:    styles.info,
  neutral: styles.neutral,
  blue:    styles.blue,
}

export default function Badge({ children, variant = 'neutral', dot = false }) {
  return (
    <span className={[styles.badge, variantMap[variant] || styles.neutral].join(' ')}>
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  )
}
