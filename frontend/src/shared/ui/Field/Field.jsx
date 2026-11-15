import { useId } from 'react';
import styles from './Field.module.css';

export default function Field({ label, id, as: Control = 'input', className = '', error, children, ...props }) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const describedBy = [props['aria-describedby'], error && errorId].filter(Boolean).join(' ') || undefined;
  return <div className={`${styles.field} ${className}`}>
    <label htmlFor={inputId}>{label}</label>
    <Control {...props} id={inputId} className={styles.control} aria-invalid={error ? true : undefined} aria-describedby={describedBy}>{children}</Control>
    {error && <span id={errorId} className={styles.error} role="alert">{error}</span>}
  </div>;
}
