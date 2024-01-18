import { type ChangeEvent } from 'react';
import { ImageSource } from '@app/constants/image-sources';
import classes from './component.module.css';

interface ItemPropTypes {
  source: ImageSource;
  activeSources: string[];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function ToggleGroupItem({
  source,
  activeSources,
  onChange: handleChange,
}: ItemPropTypes) {
  const { value, name, icon: Icon } = source;

  return (
    <div className={classes.item}>
      <input
        type="checkbox"
        id={value}
        value={value}
        onChange={handleChange}
        checked={activeSources.includes(value)}
      />
      <label htmlFor={value}>{name}</label>
      <Icon />
    </div>
  );
}
