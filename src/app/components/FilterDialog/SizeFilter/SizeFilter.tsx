import InputGroup from "@components/InputGroup";
import NumberInput from "@components/NumberInput";
import FilterWrapper from "../FilterWrapper";
import { NumberChangeAction } from "@src/hooks/use-input";
import classes from "./component.module.css";
import { useId } from "react";

interface PropTypes {
  value: number;
  onChange: NumberChangeAction;
  min: number;
  max: number;
  step: number;
}

export default function SizeFilter({
  value,
  onChange,
  min = 1,
  max = 100,
  step = 1,
}: PropTypes) {
  const id = useId();

  return (
    <InputGroup className={`${classes["group"]}`}>
      <label htmlFor={id}>Image Size</label>
      <FilterWrapper>
        <NumberInput
          id={id}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
        />
      </FilterWrapper>
    </InputGroup>
  );
}
