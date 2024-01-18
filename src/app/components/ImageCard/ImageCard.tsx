import { useContext, useEffect, useRef, useState } from 'react';
import Unsplash from '@components/logos/Unsplash';
import Pexels from '@components/logos/Pexels';
import Pixabay from '@components/logos/Pixabay';
import { AppStatusContext } from '@components/Providers/AppStatusProvider';
import { ExportSettingsContext } from '@components/Providers/ExportSettingsProvider';
import type { StockImageData } from '@src/utils/image-search';
import classes from './component.module.css';
import { UIPostMessage } from '@src/types/post-messages';

interface PropTypes {
  image: StockImageData;
}

export default function ImageCard({ image }: PropTypes) {
  const {
    source,
    width,
    height,
    image_thumbnail,
    image_large,
    image_link,
    photographer,
    photographer_link,
  } = image;

  const { setAppStatus } = useContext(AppStatusContext);
  const { exportSettings } = useContext(ExportSettingsContext);

  const Icon =
    source.toLocaleLowerCase() === 'unsplash'
      ? Unsplash
      : source.toLocaleLowerCase() === 'pexels'
      ? Pexels
      : Pixabay;

  function handlePlaceImage() {
    const pluginMessage: UIPostMessage = {
      type: 'PLACE_IMAGE',
      payload: {
        src: image_large,
        width,
        height,
        quality: exportSettings.quality,
        exportSize: exportSettings.size,
      },
    };

    setAppStatus('GENERATING');
    parent.postMessage({ pluginMessage }, '*');
  }

  return (
    <div className={classes['img-card']}>
      <div className={classes['img-container']}>
        <Img src={image_thumbnail} />
        <div className={classes['btn-group']}>
          <button onClick={handlePlaceImage}>
            <span>Place on Canvas</span>
          </button>
          {/* <button>
            <span>View Larger</span>
          </button> */}
        </div>
      </div>
      <p>
        <a href={image_link} target="_blank">
          <Icon />
          {source}
        </a>
        <span>·</span>
        <a href={photographer_link} target="_blank">
          {photographer}
        </a>
      </p>
    </div>
  );
}

interface ImageProps {
  src: string;
}

function Img({ src }: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const image = imgRef.current;

    function loaded() {
      setIsLoaded(true);
    }

    if (image.complete) {
      loaded();
    } else {
      image.addEventListener('load', loaded);
    }

    return () => {
      image.removeEventListener('load', loaded);
    };
  }, []);

  return <img ref={imgRef} src={src} data-loaded={isLoaded} />;
}
