import { forwardRef, type FormEvent, type Dispatch, type SetStateAction } from 'react';
import { Search, Delete } from '../icons/20';
import classes from './component.module.css';

interface SearchBarProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  onSubmit: (e: FormEvent) => void;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ value, setValue, onSubmit }, ref) => {
    // const inputRef = useRef<HTMLInputElement>(null);

    function handleClearInput() {
      setValue('');

      if (ref && 'current' in ref) ref.current?.focus();
    }

    return (
      <form onSubmit={onSubmit} className="input-group flex-grow">
        <label htmlFor="search-bar">Search</label>
        <div className={`${classes.search}`}>
          <input
            type="text"
            id="search-bar"
            ref={ref}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search for free images"
            spellCheck="false"
            autoFocus
          />
          <button type="submit" disabled={value === ''}>
            <span className="sr-only">Search</span>
            <Search />
          </button>
          <button onClick={handleClearInput} disabled={value === ''}>
            <span className="sr-only">Cancel</span>
            <Delete />
          </button>
        </div>
      </form>
    );
  }
);

export default SearchBar;
