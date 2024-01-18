import { RadioGroupAction } from '@src/hooks/use-input';
import {
  RadioGroup,
  RadioGroupLabel,
  RadioGroupItem,
  RadioItemLabel,
  RadioItemInput,
} from '@components/RadioGroup';
import classes from './component.module.css';
import FilterWrapper from '../FilterWrapper';
import VisuallyHidden from '../../VisuallyHidden';

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
  const name = groupLabel.toLocaleLowerCase().split(' ').join('-');

  return (
    <RadioGroup>
      <RadioGroupLabel>{groupLabel}</RadioGroupLabel>
      <FilterWrapper role="radiogroup" className={classes['wrapper']}>
        {options.map(({ value, label, background }) => {
          const checked = groupValue === value;
          const color = value === 'white' ? 'black' : 'white';
          return (
            <RadioGroupItem key={value} className={classes['item']}>
              <RadioItemInput
                id={value}
                name={name}
                value={value}
                onChange={onChange}
                checked={checked}
                className={classes['input']}
                style={{ background }}
              />
              <VisuallyHidden>
                <RadioItemLabel htmlFor={value}>{label}</RadioItemLabel>
              </VisuallyHidden>
              <span className={classes.iconWrapper} style={{ color }} data-checked={`${checked}`}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 12 L9 18 L21 6"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </RadioGroupItem>
          );
        })}
      </FilterWrapper>
    </RadioGroup>
  );
}
