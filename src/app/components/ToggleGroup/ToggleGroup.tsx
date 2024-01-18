import ToggleGroupItem from './ToggleGroupItem';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import type { ImageSource } from '@src/app/constants/image-sources';
import type { ImageService } from '@src/utils/image-search';
import type { UIPostMessage } from '@src/types/post-messages';
import classes from './component.module.css';

interface PropTypes {
  label: string;
  sources: Array<ImageSource>;
  activeSources: Array<ImageService>;
  setSources: Dispatch<SetStateAction<Array<ImageService>>>;
}

export default function ToggleGroup({ label, activeSources, sources, setSources }: PropTypes) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { checked, value } = e.target;

    // TODO: REMOVE CODE SMELL
    if (value !== 'unsplash' && value !== 'pexels' && value !== 'pixabay') {
      return;
    }

    if (checked) {
      setSources([...activeSources, value]);
    } else {
      if (activeSources.length <= 1) {
        const pluginMessage: UIPostMessage = {
          type: 'ERROR',
          payload: { message: 'You must select at least one image source' },
        };

        parent.postMessage({ pluginMessage }, '*');

        return;
      }
      setSources(activeSources.filter((source) => source !== value));
    }
  }

  return (
    <fieldset className={`${classes['toggle-group']} input-group`}>
      <legend className="label">{label}</legend>
      <div className={classes.container}>
        {sources.map((source) => (
          <ToggleGroupItem source={source} activeSources={activeSources} onChange={handleChange} />
        ))}
      </div>
    </fieldset>
  );
}
