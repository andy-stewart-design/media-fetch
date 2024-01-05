import ImageCard from '@components/ImageCard';
import type { ImageData } from '@utils/image-search';
import type { Dispatch, SetStateAction } from 'react';
import classes from './component.module.css';

interface PropTypes {
  images: ImageData[] | null;
  setImages: Dispatch<SetStateAction<ImageData[] | null>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

export default function ImageGallery({ images, setImages, setCurrentPage }: PropTypes) {
  function clearResults() {
    setImages(null);
  }

  return (
    <>
      {images && images.length > 0 ? (
        <div className={classes['gallery']}>
          {images.map((image) => (
            <ImageCard key={image.id} image={image} />
          ))}
          <div className={classes.loadMore}>
            <button onClick={() => setCurrentPage((p) => p + 1)}>Load More</button>
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
