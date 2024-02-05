import { RadioGroupAction } from '@src/hooks/use-input';
import { Root as RadioGroupRoot } from '@radix-ui/react-radio-group';
import FilterWrapper from '../FilterWrapper';
import classes from './component.module.css';
import ColorFilterItem from './ColorFilterItem';

interface PropTypes {
  value: string;
  onChange: RadioGroupAction;
  label: string;
  options: Array<{
    value: string;
    label: string;
    background: string;
  }>;
}

export default function ColorFilter({
  value: groupValue,
  onChange,
  options,
  label: groupLabel,
}: PropTypes) {
  return (
    <fieldset className={`${classes.fieldset} input-group`}>
      <legend className={`${classes.groupLabel} label`}>{groupLabel}</legend>
      <FilterWrapper role="radiogroup" className={classes['wrapper']}>
        <RadioGroupRoot
          className={classes.group}
          value={groupValue}
          onValueChange={(value) => value && onChange(value)}
        >
          {options.map(({ value, label, background }) => (
            <ColorFilterItem key={value} value={value} background={background} aria-label={label} />
          ))}
        </RadioGroupRoot>
      </FilterWrapper>
    </fieldset>
  );
}
