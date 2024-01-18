import classes from "./component.module.css";

interface PropTypes {
  handleCancel: () => void;
  disableApplyFilters: boolean;
  applyFilters: () => void;
}

export default function FilterFooter({
  handleCancel,
  applyFilters,
  disableApplyFilters,
}: PropTypes) {
  return (
    <div className={classes.wrapper}>
      <button onClick={handleCancel}>Cancel</button>
      <button
        className={classes.apply}
        onClick={applyFilters}
        disabled={disableApplyFilters}
      >
        Apply Filters
      </button>
    </div>
  );
}
