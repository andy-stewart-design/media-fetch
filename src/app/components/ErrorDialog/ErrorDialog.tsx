import { useContext } from 'react';
import Dialog from '@components/Dialog';
import { ErrorDialogDisplayContext } from '@components/Providers/ErrorDialogDisplayProvider';
import classes from './component.module.css';
import ErrorHeader from './ErrorHeader';

export default function ErrorDialog() {
  const { showDialog, setShowDialog } = useContext(ErrorDialogDisplayContext);

  return (
    <Dialog className={classes.dialog} showDialog={showDialog} setShowDialog={setShowDialog}>
      <section>
        <ErrorHeader setShowDialog={setShowDialog} />
      </section>
      <section>
        <p>
          Sorry! We had an issue with generating the selected image. Please see if reducing the size
          or quality of the image (found in the filters below) solves the problem. Otherwise, feel
          free to reach out.
        </p>
        <button>Get in touch</button>
      </section>
    </Dialog>
  );
}
