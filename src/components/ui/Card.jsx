import styles from './Card.module.css'

export default function Card({ children, className = '', padding = 'md', dark = false, onClick }) {
  return (
    <div
      className={[
        styles.card,
        styles[`pad-${padding}`],
        dark ? styles.dark : '',
        onClick ? styles.clickable : '',
        className,
      ].join(' ')}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
