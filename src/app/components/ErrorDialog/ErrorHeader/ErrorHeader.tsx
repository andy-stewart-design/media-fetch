import classes from './component.module.css';

interface PropTypes {
  setShowDialog: () => void;
}

export default function FilterHeader({ setShowDialog: closeDialog }: PropTypes) {
  return (
    <div className={classes['header']}>
      <h6 className="flex-grow">Error</h6>
      <button onClick={closeDialog}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 4 L16 16 M16 4 L4 16" stroke="currentColor" stroke-width="1.5" />
        </svg>
      </button>
    </div>
  );
}
