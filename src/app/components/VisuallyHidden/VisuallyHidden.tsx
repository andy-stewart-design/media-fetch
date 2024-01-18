import { ComponentProps } from "react";
import classes from "./component.module.css";

export default function VisuallyHidden({
  children,
  className,
  ...delegated
}: ComponentProps<"span">) {
  return (
    <span {...delegated} className={`${classes.span} ${className}`}>
      {children}
    </span>
  );
}
