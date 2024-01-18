import InputGroup from "@components/InputGroup";
import RangeSlider from "@components/RangeSlider";
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

export default function QualityFilter({
  value,
  onChange,
  min = 1,
  max = 100,
  step = 1,
}: PropTypes) {
  const id = useId();

  return (
    <InputGroup className="flex-grow">
      <label htmlFor={id}>Image Quality</label>
      <FilterWrapper>
        <div className={classes["wrapper"]}>
          <RangeSlider
            id={id}
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
          />
          <NumberInput
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            controls={false}
            textAlign="center"
          />
        </div>
      </FilterWrapper>
    </InputGroup>
  );
}
