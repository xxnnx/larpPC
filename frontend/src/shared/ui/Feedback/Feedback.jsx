import styles from './Feedback.module.css';

export default function Feedback({ children, kind = 'error' }) {
  if (!children) return null;
  return <p className={`${styles.message} ${kind === 'success' ? styles.success : ''}`} role={kind === 'error' ? 'alert' : 'status'}>{children}</p>;
}
