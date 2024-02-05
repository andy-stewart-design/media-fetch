import ToggleGroupItem from './ServiceFilterItem';
import type { Dispatch, SetStateAction } from 'react';
import type { ImageSource } from '@src/app/constants/image-sources';
import type { ImageService } from '@src/utils/image-search';
import type { UIPostMessage } from '@src/types/post-messages';
import { Root as ToggleRoot } from '@radix-ui/react-toggle-group';
import classes from './component.module.css';

interface PropTypes {
  label: string;
  sources: Array<ImageSource>;
  activeSources: Array<ImageService>;
  setSources: Dispatch<SetStateAction<Array<ImageService>>>;
}

export default function ServiceFilterGroup({
  label,
  activeSources,
  sources,
  setSources,
}: PropTypes) {
  function handleChange(newSources: Array<ImageService>) {
    if (newSources.length <= 0) {
      const pluginMessage: UIPostMessage = {
        type: 'ERROR',
        payload: { message: 'You must select at least one image source' },
      };

      parent.postMessage({ pluginMessage }, '*');

      return;
    } else {
      setSources(newSources);
    }
  }

  return (
    <fieldset className={`${classes['toggle-group']} input-group`}>
      <legend className="label">{label}</legend>
      <ToggleRoot
        type="multiple"
        value={activeSources}
        onValueChange={handleChange}
        className={classes.container}
      >
        {sources.map((source) => (
          <ToggleGroupItem {...source} />
        ))}
      </ToggleRoot>
    </fieldset>
  );
}
