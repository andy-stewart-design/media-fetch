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
  className,
  children,
  ...delegated
}: ComponentProps<"legend">) {
  return (
    <legend {...delegated} className={`${classes["label"]} label ${className}`}>
      {children}
    </legend>
  );
}

export function RadioGroupItem({
  className,
  children,
  ...delegated
}: ComponentProps<"span">) {
  return (
    <span
      {...delegated}
      className={`${classes["radio-group-item"]} ${className}`}
    >
      {children}
    </span>
  );
}

export function RadioItemInput({
  className,
  ...delegated
}: ComponentProps<"input">) {
  return (
    <input
      {...delegated}
      type="radio"
      className={`${classes["input"]} ${className}`}
    />
  );
}

export function RadioItemLabel({
  className,
  children,
  ...delegated
}: ComponentProps<"label">) {
  return (
    <label {...delegated} className={`${classes["label"]} ${className}`}>
      {children}
    </label>
  );
}
