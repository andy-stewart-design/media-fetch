import { useContext, type Dispatch, type SetStateAction } from 'react';
import { FiltersDialog, FiltersDialogContent, FiltersDialogTrigger } from './FiltersDialog';
import { SearchQueryContext } from '@components/Providers/SearchQueryProvider';
import { useToggle } from '@src/hooks/use-input';
import type { StockImageData } from '@utils/image-search';
import classes from './component.module.css';

interface PropTypes {
  setImages: Dispatch<SetStateAction<Array<Array<StockImageData>> | null>>;
  numImages: number;
  totalImages: number;
}

export default function Footer({ setImages, numImages, totalImages }: PropTypes) {
  const { setSearchQuery } = useContext(SearchQueryContext);
  const [showDialog, setShowDialog] = useToggle(false);

  function clearResults() {
    setImages(null);
    setSearchQuery((current) => ({ ...current, value: '', syncHeader: true }));
  }

  return (
    <footer className={classes['footer']}>
      <div data-visible={numImages > 0 ? 'true' : 'false'}>
        <span>
          Showing {numImages} of {numberWithCommas(totalImages)}
        </span>
        <button onClick={clearResults}>Clear Results</button>
      </div>

      <FiltersDialog open={showDialog} onOpenChange={setShowDialog}>
        <FiltersDialogTrigger />
        <FiltersDialogContent setShowDialog={setShowDialog} />
      </FiltersDialog>
    </footer>
  );
}

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
