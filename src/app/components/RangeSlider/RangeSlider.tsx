import { ComponentProps } from "react";
import { map } from "@src/utils/math";
import classes from "./component.module.css";

interface PropTypes extends ComponentProps<"input"> {}

export default function RangeSlider({
  className,
  value,
  min,
  max,
  style,
  ...delegated
}: PropTypes) {
  const sliderProgress = map(Number(value), Number(min), Number(max), 0, 100);
  const internalStyle = {
    "--slider-progress": `${sliderProgress}%`,
  };

  return (
    <input
      {...delegated}
      type="range"
      className={`${classes["range-group"]} ${className}`}
      value={value}
      min={min}
      max={max}
      style={{ ...style, ...internalStyle }}
    />
  );
}
