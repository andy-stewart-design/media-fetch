import { ChangeEvent, Dispatch, SetStateAction, useId } from "react";
import { ImageSource } from "@src/app/constants/image-sources";
import type { ImageService } from "@src/utils/image-search";
import type { UIPostMessage } from "@src/types/post-messages";
import classes from "./component.module.css";

interface PropTypes {
  label: string;
  sources: Array<ImageSource>;
  activeSources: Array<ImageService>;
  setSources: Dispatch<SetStateAction<Array<ImageService>>>;
}

export default function ToggleGroup({
  label,
  activeSources,
  sources,
  setSources,
}: PropTypes) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { checked, value } = e.target;

    // TODO: REMOVE CODE SMELL
    if (value !== "unsplash" && value !== "pexels" && value !== "pixabay") {
      return;
    }

    if (checked) {
      setSources([...activeSources, value]);
    } else {
      if (activeSources.length <= 1) {
        const pluginMessage: UIPostMessage = {
          type: "ERROR",
          payload: { message: "You must select at least one image source" },
        };

        parent.postMessage({ pluginMessage }, "*");

        return;
      }
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

export function Foo() {
  return (
    <div className="relative h-[8.5rem]">
      <button
        type="button"
        id="adjustments-horizontal-btn"
        aria-label="adjustments-horizontal"
        aria-haspopup="true"
        aria-controls="adjustments-horizontal"
        aria-expanded="true"
        className="absolute inset-0 flex h-full w-full cursor-auto items-center justify-center rounded-xl text-slate-900 ring-1 ring-inset ring-slate-900/[0.08] focus-visible"
        data-focus-visible-added=""
      >
        <span className="transition-transform duration-500 ease-in-out">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            aria-hidden="true"
            data-slot="icon"
            className="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
            ></path>
          </svg>
        </span>
      </button>
      <div
        id="adjustments-horizontal"
        role="menu"
        aria-labelledby="adjustments-horizontal-btn"
        aria-activedescendant="adjustments-horizontal-svg"
        className="absolute inset-0 grid grid-cols-1 grid-rows-2 gap-1 p-1 opacity-100"
      >
        <div
          id="adjustments-horizontal-svg"
          role="menuitem"
          className="flex cursor-pointer items-center justify-center rounded-lg text-[0.8125rem] font-semibold text-slate-500 bg-slate-200/80"
        >
          Copy SVG
        </div>
        <div
          id="adjustments-horizontal-jsx"
          role="menuitem"
          className="flex cursor-pointer items-center justify-center rounded-lg text-[0.8125rem] font-semibold text-slate-500 bg-slate-50/[0.94]"
        >
          Copy JSX
        </div>
      </div>
    </div>
  );
}
