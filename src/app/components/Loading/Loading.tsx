import * as Dialog from '@radix-ui/react-dialog';
import LoadingSpinner from './LoadingSpinner';
import classes from './component.module.css';

interface PropTypes {
  open?: boolean;
  display?: 'fullscreen' | 'fill';
  message?: string | null;
}

export default function Loading({ open = true, display = 'fill', message = null }: PropTypes) {
  return (
    <>
      {display === 'fill' ? (
        <div className={`${classes.overlay} ${classes.fill}`}>
          <LoadingSpinner />
          {message && <p>{message}</p>}
        </div>
      ) : (
        <Dialog.Root open={open}>
          <Dialog.Portal>
            <Dialog.Overlay className={`${classes.overlay} ${classes.fullscreen}`}>
              <Dialog.Content className={classes.dialog}>
                <LoadingSpinner />
                {message && <p>{message}</p>}
              </Dialog.Content>
            </Dialog.Overlay>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </>
  );
}
