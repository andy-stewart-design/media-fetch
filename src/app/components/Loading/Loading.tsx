import classes from './component.module.css';

export default function Loading() {
  return (
    <div className={classes['loading']}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path
          opacity="0.25"
          d="M42 24C42 34 34 42 24 42C14 42 6 34 6 24C6 14 14 6 24 6C34 6 42 14 42 24Z"
          stroke="currentColor"
          stroke-width="6"
        />
        <path d="M6 24C6 14 14 6 24 6" stroke="currentColor" stroke-width="6" />
      </svg>
      <p>Finding images</p>
    </div>
  );
}
