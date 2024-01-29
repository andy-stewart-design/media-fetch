import { useContext } from 'react';
import { ImageDialog, ImageDialogContent, ImageDialogTrigger } from '@components/ImageDialog';
import Unsplash from '@components/logos/Unsplash';
import Pexels from '@components/logos/Pexels';
import Pixabay from '@components/logos/Pixabay';
import Img from '@components/Img';
import { Download } from '@components/icons/20';
import { AppStatusContext } from '@components/Providers/AppStatusProvider';
import { ExportSettingsContext } from '@components/Providers/ExportSettingsProvider';
import type { StockImageData } from '@src/utils/image-search';
import type { UIPostMessage } from '@src/types/post-messages';
import classes from './component.module.css';

interface PropTypes {
  image: StockImageData;
}

export default function ImageCard({ image }: PropTypes) {
  const {
    source,
    width,
    height,
    image_thumbnail,
    image_download,
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
        src: image_download,
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
      <div className={classes['img-group']}>
        <Img
          src={image_thumbnail}
          width={width}
          height={height}
          style={{ aspectRatio: `${width} / ${height}` }}
        />
        <div className={classes['btn-group']}>
          e
          <button className={classes['generate']} onClick={handlePlaceImage}>
            <Download />
            <span>Place Image</span>
          </button>
          <ImageDialog>
            <ImageDialogTrigger />
            <ImageDialogContent image={image} icon={Icon} handlePlaceImage={handlePlaceImage} />
          </ImageDialog>
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
