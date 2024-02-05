import { Item as Toggle } from '@radix-ui/react-toggle-group';
import type { ImageService } from '@src/utils/image-search';
import classes from './component.module.css';

interface ItemPropTypes {
  value: ImageService;
  icon: () => JSX.Element;
}

export default function ToggleGroupItem({ value, icon: Icon }: ItemPropTypes) {
  return (
    <Toggle value={value} className={classes.item}>
      <Icon />
    </Toggle>
  );
}
