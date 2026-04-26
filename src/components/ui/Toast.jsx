import { useEffect, useState } from 'react'
import { CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react'
import styles from './Toast.module.css'

const icons = {
  success: <CheckCircle size={16} />,
  warning: <AlertTriangle size={16} />,
  error:   <XCircle size={16} />,
}

export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onClose, 300) }, 4000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className={[styles.toast, styles[type], visible ? styles.in : styles.out].join(' ')}>
      <span className={styles.icon}>{icons[type]}</span>
      <span className={styles.msg}>{message}</span>
      <button className={styles.close} onClick={() => { setVisible(false); setTimeout(onClose, 300) }}>
        <X size={14} />
      </button>
    </div>
  )
}
