import { ChangeEvent, Dispatch, SetStateAction, useId } from "react";
import { ImageSource } from "@src/app/constants/image-sources";
import classes from "./component.module.css";

interface PropTypes {
  label: string;
  sources: Array<ImageSource>;
  activeSources: Array<string>;
  setSources: Dispatch<SetStateAction<string[]>>;
}

export default function ToggleGroup({
  label,
  activeSources,
  sources,
  setSources,
}: PropTypes) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { checked, value } = e.target;

    if (checked) {
      setSources([...activeSources, value]);
    } else {
      if (activeSources.length <= 1) return;
      setSources(activeSources.filter((source) => source !== value));
    }
  }

  return (
    <fieldset className={`${classes["toggle-group"]} input-group`}>
      <legend className="label">{label}</legend>
      <div data-toggle-group>
        {sources.map((source) => (
          <ToggleGroupItem
            source={source}
            activeSources={activeSources}
            onChange={handleChange}
          />
        ))}
      </div>
    </fieldset>
  );
}

interface ItemPropTypes {
  source: ImageSource;
  activeSources: string[];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function ToggleGroupItem({
  source,
  activeSources,
  onChange: handleChange,
}: ItemPropTypes) {
  const id = useId();
  console.log(source);

  const { value, name, icon: Icon } = source;

  return (
    <div data-toggle-group-item>
      <input
        type="checkbox"
        id={id}
        value={value}
        onChange={handleChange}
        checked={activeSources.includes(value)}
      />
      <label htmlFor={id}>{name}</label>
      <Icon />
    </div>
  );
}
