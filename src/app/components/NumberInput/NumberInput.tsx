import { ComponentProps, ChangeEvent, KeyboardEvent } from "react";
import classes from "./component.module.css";
import { NumberChangeAction } from "@src/hooks/use-input";

interface PropTypes extends ComponentProps<"input"> {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: NumberChangeAction;
  controls?: boolean;
  textAlign?: "left" | "right" | "center";
}

export default function NumberInput({
  value,
  onChange,
  min,
  max,
  step,
  controls = true,
  textAlign = "left",
  className,
  ...delegated
}: PropTypes) {
  const stepInternal =
    typeof step === "number"
      ? step
      : typeof Number(step) === "number"
      ? Number(step)
      : 1;

  function onBlur(
    event: ChangeEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>
  ) {
    const { target } = event;

    if (!target) return;
    const newValueNumber = Number((target as HTMLInputElement).value);

    if (newValueNumber >= max) onChange(max);
    else if (newValueNumber <= min) onChange(min);
    else onChange(newValueNumber);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") onBlur(event);
  }

  return (
    <div className={classes["wrapper"]}>
      <input
        {...delegated}
        type="number"
        className={`${classes["number-input"]} ${className}`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        step={stepInternal}
        style={{ textAlign }}
      />
      {controls && (
        <div className={classes["button-group"]}>
          <button onClick={() => onChange(value + stepInternal)} tabIndex={-1}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 2 V 10 M10 6 L2 6"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
          <button onClick={() => onChange(value - stepInternal)} tabIndex={-1}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M10 6 L2 6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
