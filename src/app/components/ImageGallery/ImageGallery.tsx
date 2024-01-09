import { useContext, type Dispatch, type SetStateAction } from 'react';
import ImageCard from '@components/ImageCard';
import { SearchQueryContext } from '@components/Providers/SearchQueryProvider';
import type { StockImageData } from '@utils/image-search';
import classes from './component.module.css';

interface PropTypes {
  images: StockImageData[] | null;
  setImages: Dispatch<SetStateAction<StockImageData[] | null>>;
}

export default function ImageGallery({ images, setImages }: PropTypes) {
  const { setSearchQuery } = useContext(SearchQueryContext);

  function clearResults() {
    setImages(null);
  }

  function loadMore() {
    setSearchQuery((current) => ({ ...current, page: current.page + 1 }));
  }

  return (
    <>
      {images && images.length > 0 ? (
        <div className={classes['gallery']}>
          {images.map((image) => (
            <ImageCard key={image.id} image={image} />
          ))}
          <div className={classes.loadMore}>
            <button onClick={loadMore}>Load More</button>
          </div>
        </div>
      ) : images && images.length <= 0 ? (
        <div className={classes['placeholder']}>
          <div>
            <p>Sorry, we couldn't find any images matching that search term</p>
            <button onClick={clearResults}>Clear Results</button>
          </div>
        </div>
      ) : (
        <div className={classes['placeholder']}>
          <div>
            <p className="opacity-50">Enter a search term to get started</p>
          </div>
        </div>
      )}
    </>
  );
}
