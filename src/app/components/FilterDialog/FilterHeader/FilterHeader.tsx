import classes from "./component.module.css";

interface PropTypes {
  setShowDialog: () => void;
}

export default function FilterHeader({
  setShowDialog: closeDialog,
}: PropTypes) {
  return (
    <div className={classes["header"]}>
      <p className="flex-grow">Additional Filters</p>
      <button onClick={closeDialog}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M3 3L17 17M17 3L10 10L3 17"
            stroke="currentColor"
            stroke-width="1.5"
          />
        </svg>
      </button>
    </div>
  );
}
