import styles from './Button.module.css';

export default function Button({ type = 'button', className = '', children, ...props }) {
  return <button type={type} className={`${styles.button} ${className}`} {...props}>{children}</button>;
}
