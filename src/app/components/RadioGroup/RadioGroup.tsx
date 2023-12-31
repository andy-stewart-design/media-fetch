import { ComponentProps, ReactNode } from "react";
import InputGroup from "../InputGroup";
import classes from "./component.module.css";

interface RadioGroupProps {
  children?: ReactNode;
  className?: string;
}

export function RadioGroup({ children, className }: RadioGroupProps) {
  return (
    <InputGroup as="fieldset" className={className}>
      {children}
    </InputGroup>
  );
}

export function RadioGroupLabel({
  children,
  ...delegated
}: ComponentProps<"label">) {
  return <label {...delegated}>{children}</label>;
}

interface RadioGroupItemProps extends ComponentProps<"input"> {
  value: string;
  label: string;
}

export function RadioGroupItem({
  value,
  label,
  className,
  ...delegated
}: RadioGroupItemProps) {
  return (
    <span className={`${classes["radio-group-item"]} ${className}`}>
      <input {...delegated} type="radio" value={value} id={value} />
      <label htmlFor={value}>{label}</label>
    </span>
  );
}
