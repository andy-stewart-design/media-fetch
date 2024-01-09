import LoadingSpinner from './LoadingSpinner';
import classes from './component.module.css';

export default function Loading() {
  return (
    <div className={classes['loading']}>
      <LoadingSpinner />
      <p>Finding images</p>
    </div>
  );
}
