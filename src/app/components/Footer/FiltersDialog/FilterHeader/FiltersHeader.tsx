import { Title, Close } from '@radix-ui/react-dialog';
import classes from './component.module.css';
import VisuallyHidden from '@components/VisuallyHidden';

export default function FiltersHeader() {
  return (
    <div className={classes['header']}>
      <Title className="">Additional Filters</Title>
      <Close asChild>
        <button className={classes.close}>
          <VisuallyHidden>Close</VisuallyHidden>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 4 L16 16 M16 4 L4 16" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </button>
      </Close>
    </div>
  );
}
