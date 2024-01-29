import { useContext } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import VisuallyHidden from '@components/VisuallyHidden';
import { LoadingSpinner } from '@components/Loading';
import { ArrowRight, Download } from '@components/icons/24';
import { Expand } from '@components/icons/20';
import { AppStatusContext } from '@components/Providers/AppStatusProvider';
import type { StockImageData } from '@src/utils/image-search';
import classes from './component.module.css';

interface PropTypes {
  image: StockImageData;
  icon: () => JSX.Element;
  handlePlaceImage: () => void;
}

export function ImageDialogContent({ image, icon: Icon, handlePlaceImage }: PropTypes) {
  const { appStatus } = useContext(AppStatusContext);
  const { photographer, photographer_avatar, source, image_large, width, height } = image;

  return (
    <Dialog.Portal>
      <Dialog.Overlay className={classes.overlay}>
        <Dialog.Content className={classes.dialog}>
          <div className={classes.header}>
            <div className={classes.avatar}>
              {photographer_avatar ? <img src={photographer_avatar} /> : <Icon />}
            </div>
            <div className={classes.attribution}>
              <Dialog.Title className="">{photographer}</Dialog.Title>
              <p>via {source}</p>
            </div>
            <Dialog.Close asChild>
              <button className={classes.close}>
                <VisuallyHidden>Close</VisuallyHidden>
                <ArrowRight />
              </button>
            </Dialog.Close>
          </div>
          <div className={classes.content}>
            <img src={image_large} className={classes.image} width={width} height={height} />
          </div>
          <div className={classes.footer}>
            <button
              className={classes.generate}
              onClick={handlePlaceImage}
              disabled={appStatus === 'GENERATING'}
            >
              {appStatus === 'GENERATING' ? (
                <LoadingSpinner size={32} />
              ) : (
                <>
                  <Download /> Place Image
                </>
              )}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Portal>
  );
}

export const ImageDialog = Dialog.Root;

export function ImageDialogTrigger() {
  return (
    <Dialog.Trigger className={classes.trigger}>
      <Expand />
      <VisuallyHidden>View Large Image</VisuallyHidden>
    </Dialog.Trigger>
  );
}
