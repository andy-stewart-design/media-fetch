import { Item as ToggleItem } from '@radix-ui/react-toggle-group';
import { TooltipRoot, TooltipTrigger, Tooltip } from '@components/Tooltip';
import type { ImageService } from '@src/utils/image-search';
import classes from './component.module.css';

interface ItemPropTypes {
  value: ImageService;
  name: string;
  icon: () => JSX.Element;
}

export default function ServiceFilterItem({ value, name, icon: Icon }: ItemPropTypes) {
  return (
    <TooltipRoot>
      <ToggleItem value={value} asChild>
        <TooltipTrigger>
          <button className={classes.item}>
            <Icon />
          </button>
        </TooltipTrigger>
      </ToggleItem>
      <Tooltip>{name}</Tooltip>
    </TooltipRoot>
  );
}
