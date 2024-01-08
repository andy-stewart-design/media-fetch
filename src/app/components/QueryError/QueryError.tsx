import { SearchQueryContext } from '@components/Providers/SearchQueryProvider';
import { useContext } from 'react';
import classes from './component.module.css';

interface PropTypes {
  setStatus: React.Dispatch<React.SetStateAction<string>>;
}

export default function QueryError({ setStatus }: PropTypes) {
  const { searchQuery, setSearchQuery } = useContext(SearchQueryContext);

  function tryAgain() {
    setSearchQuery({ ...searchQuery });
    setStatus('IDLE');
  }

  return (
    <div className={classes.container}>
      <p>
        Sorry! We had an issue completing your search request. Please try again. If the issue
        persists, please reach out.
      </p>
      <div className={classes['button-group']}>
        <button onClick={tryAgain}>Try again</button>
        <button>Get in touch</button>
      </div>
    </div>
  );
}
