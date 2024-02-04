import { Root, Portal, Overlay, Content } from '@radix-ui/react-dialog';
import ErrorHeader from './ErrorHeader';
import { ToggleAction } from '@hooks/use-input';
import classes from './component.module.css';

interface PropTypes {
  status: boolean;
  onChange: ToggleAction;
}

export default function ErrorDialog({ status, onChange }: PropTypes) {
  return (
    <Root open={status} onOpenChange={onChange}>
      <Portal>
        <Overlay className={classes.overlay} />
        <Content className={classes.dialog}>
          <section>
            <ErrorHeader />
          </section>
          <section>
            <p>
              Sorry! We had an issue with generating the selected image. Please see if reducing the
              size or quality of the image (found in the filters below) solves the problem.
              Otherwise, feel free to reach out.
            </p>
            <button>Get in touch</button>
          </section>
        </Content>
      </Portal>
    </Root>
  );
}
