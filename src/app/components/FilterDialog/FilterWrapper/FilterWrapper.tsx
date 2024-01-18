import { ComponentProps } from "react";
import classes from "./component.module.css";

export default function FilterWrapper({
  children,
  className,
  ...delegated
}: ComponentProps<"div">) {
  return (
    <div {...delegated} className={`${classes["wrapper"]} ${className}`}>
      {children}
    </div>
  );
}
