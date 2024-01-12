import { useContext, type Dispatch, type SetStateAction } from 'react';
import { FilterDialogDisplayContext } from '@components/Providers/FilterDialogDisplayProvider';
import { SearchQueryContext } from '@components/Providers/SearchQueryProvider';
import type { StockImageData } from '@utils/image-search';
import classes from './component.module.css';

interface PropTypes {
  setImages: Dispatch<SetStateAction<StockImageData[] | null>>;
  numImages: number;
}

export default function Footer({ setImages, numImages }: PropTypes) {
  const { setSearchQuery } = useContext(SearchQueryContext);
  const { setShowDialog } = useContext(FilterDialogDisplayContext);

  function clearResults() {
    setImages(null);
    setSearchQuery((current) => ({ ...current, value: '', syncHeader: true }));
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
