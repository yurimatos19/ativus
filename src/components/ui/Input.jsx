import styles from './Input.module.css'

export default function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required,
  disabled,
  icon,
  hint,
  ...rest
}) {
  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label} {required && <span className={styles.req}>*</span>}
        </label>
      )}
      <div className={styles.inputWrap}>
        {icon && <span className={styles.iconLeft}>{icon}</span>}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={[styles.input, icon ? styles.hasIcon : '', error ? styles.hasError : ''].join(' ')}
          {...rest}
        />
      </div>
      {hint && !error && <p className={styles.hint}>{hint}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
