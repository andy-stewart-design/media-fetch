import LoadingSpinner from './LoadingSpinner';
import classes from './component.module.css';

interface PropTypes {
  display?: 'fullscreen' | 'fill';
  message?: string | null;
}

export default function Loading({ display = 'fill', message = null }: PropTypes) {
  return (
    <div className={`${classes['loading']} ${classes[display]}`}>
      <LoadingSpinner />
      {message && <p>{message}</p>}
    </div>
  );
}
