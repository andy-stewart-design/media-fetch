import { RadioGroupAction } from '@src/hooks/use-input';
import * as ToggleGroup from '@radix-ui/react-radio-group';
import FilterWrapper from '../FilterWrapper';
import classes from './component.module.css';

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
  return (
    <fieldset className={`${classes.fieldset} input-group`}>
      <legend className={`${classes.groupLabel} label`}>{groupLabel}</legend>
      <FilterWrapper role="radiogroup" className={classes['wrapper']}>
        <ToggleGroup.Root
          className={classes.group}
          value={groupValue}
          onValueChange={(value) => value && onChange(value)}
        >
          {options.map(({ value, label }) => (
            <label htmlFor={value} key={value}>
              <ToggleGroup.Item value={value} id={value} className={classes.radio}>
                {label}
              </ToggleGroup.Item>
            </label>
          ))}
        </ToggleGroup.Root>
      </FilterWrapper>
    </fieldset>
  );
}
