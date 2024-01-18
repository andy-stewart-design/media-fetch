import { ComponentProps } from "react";
import classes from "./component.module.css";

type ValidTags = "div" | "fieldset";

interface PropTypes extends ComponentProps<"div"> {
  as?: ValidTags;
}

export default function InputGroup({
  as: Tag = "div",
  children,
  className,
}: PropTypes) {
  return <Tag className={`${classes["group"]} ${className}`}>{children}</Tag>;
}
