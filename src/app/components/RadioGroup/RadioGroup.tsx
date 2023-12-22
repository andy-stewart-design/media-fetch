import { ComponentProps } from "react";

interface RadioGroupProps extends ComponentProps<"div"> {
  //   numItems: number;
}

export default function RadioGroup({ children }: RadioGroupProps) {
  return <div role="radiogroup">{children}</div>;
}

export function RadioGroupLabel({ children }: ComponentProps<"p">) {
  return (
    <p className="label flex flex-justify-start flex-align-center gap-6">
      {children}
    </p>
  );
}

interface RadioGroupItemProps extends ComponentProps<"input"> {
  label: string;
}

export function RadioGroupItem({
  value,
  label,
  ...delegated
}: RadioGroupItemProps) {
  return (
    <span>
      <input {...delegated} type="radio" value={value} id={String(value)} />
      <label htmlFor={String(value)}>{label}</label>
    </span>
  );
}
