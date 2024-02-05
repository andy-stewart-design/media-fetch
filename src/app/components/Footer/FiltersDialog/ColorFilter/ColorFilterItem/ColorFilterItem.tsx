import { Item as RadioGroupItem } from '@radix-ui/react-radio-group';
import { TooltipRoot, TooltipTrigger, Tooltip } from '@components/Tooltip';
import { Check } from '@components/icons/24';
import classes from './component.module.css';
import { ComponentProps } from 'react';

interface PropTypes extends ComponentProps<typeof RadioGroupItem> {
  background: string;
}

export default function ColorFilterItem({ value, background, ...delegated }: PropTypes) {
  const color = value === 'white' ? 'black' : 'white';

  return (
    <TooltipRoot>
      <RadioGroupItem {...delegated} value={value} asChild>
        <TooltipTrigger>
          <button className={classes.radio}>
            <span className={classes.bgColor} style={{ background }} />
            <span className={classes.iconWrapper} style={{ color }}>
              <Check />
            </span>
          </button>
        </TooltipTrigger>
      </RadioGroupItem>
      <Tooltip className={classes.tooltip}>{value}</Tooltip>
    </TooltipRoot>
  );
}
