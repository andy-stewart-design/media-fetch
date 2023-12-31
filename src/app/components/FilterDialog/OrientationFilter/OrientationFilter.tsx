import { RadioGroupAction } from "@src/hooks/use-input";
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupLabel,
} from "@components/RadioGroup";
import classes from "./component.module.css";
import FilterWrapper from "../FilterWrapper";

interface PropTypes {
  value: string;
  onChange: RadioGroupAction;
  label: string;
  options: Array<{ value: string; label: string }>;
}

export default function OrientationFilter({
  value: groupValue,
  onChange,
  options,
  label: groupLabel,
}: PropTypes) {
  const name = groupLabel.toLocaleLowerCase().split(" ").join("-");

  return (
    <RadioGroup className={classes["group"]}>
      <RadioGroupLabel>{groupLabel}</RadioGroupLabel>
      <FilterWrapper role="radiogroup" className={classes["wrapper"]}>
        {options.map(({ value, label }) => (
          <RadioGroupItem
            key={value}
            name={name}
            value={value}
            onChange={onChange}
            label={label}
            checked={groupValue === value}
            className={classes["radio"]}
          />
        ))}
      </FilterWrapper>
    </RadioGroup>
  );
}
