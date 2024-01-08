import { useContext, type Dispatch, type SetStateAction } from 'react';
import type { ImageData } from '@utils/image-search';
import classes from './component.module.css';
import { FilterDialogDisplayContext } from '@components/Providers/FilterDialogDisplayProvider';

interface PropTypes {
  setImages: Dispatch<SetStateAction<ImageData[] | null>>;
  numImages: number;
}

export default function Footer({ setImages, numImages }: PropTypes) {
  const { setShowDialog } = useContext(FilterDialogDisplayContext);

  function clearResults() {
    setImages(null);
  }

  return (
    <footer className={classes['footer']}>
      <div data-visible={numImages > 0 ? 'true' : 'false'}>
        <span>{numImages} Images</span>
        <button onClick={clearResults}>Clear Results</button>
      </div>

      <button onClick={setShowDialog}>Filters</button>
    </footer>
  );
}
