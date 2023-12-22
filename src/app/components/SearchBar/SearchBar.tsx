import {
  type FormEvent,
  type Dispatch,
  type SetStateAction,
  useRef,
} from "react";
import { Search, Delete } from "../icons/20";
import classes from "./component.module.css";

interface SearchBarProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  handleCreate: (e: FormEvent) => void;
}

export default function SearchBar({
  value,
  setValue,
  handleCreate,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  function handleClearInput() {
    setValue("");
    inputRef.current?.focus();
  }

  return (
    <form onSubmit={handleCreate} className={`${classes.search} input-group`}>
      <label htmlFor="search-bar">Search</label>
      <div>
        <input
          type="text"
          id="search-bar"
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter a search term"
          spellCheck="false"
        />
        <button type="submit" disabled={value === ""}>
          <span className="sr-only">Search</span>
          <Search />
        </button>
        <button onClick={handleClearInput} disabled={value === ""}>
          <span className="sr-only">Cancel</span>
          <Delete />
        </button>
      </div>
    </form>
  );
}
