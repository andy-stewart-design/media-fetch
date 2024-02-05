import { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import SearchBar from '@components/SearchBar';
import ServiceFilterGroup from '@src/app/components/ServiceFilterGroup';
import { IMAGE_SOURCES } from '@src/app/constants/image-sources';
import type { ImageService } from '@src/utils/image-search';

import classes from './component.module.css';
import { SearchQueryContext } from '@components/Providers/SearchQueryProvider';

export default function Header() {
  const { searchQuery, setSearchQuery } = useContext(SearchQueryContext);

  const [value, setValue] = useState('');
  const [sources, setSources] = useState<Array<ImageService>>(['unsplash', 'pexels', 'pixabay']);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const imagesPerService = 30 / sources.length;
    setSearchQuery({ value, sources, imagesPerService, syncHeader: false, page: 1 });
  }

  useEffect(() => {
    if (!searchQuery.syncHeader) return;

    setValue(searchQuery.value);
    inputRef.current?.focus();
  }, [searchQuery]);

  return (
    <header className={classes['header']}>
      <SearchBar value={value} setValue={setValue} onSubmit={handleSubmit} ref={inputRef} />
      <ServiceFilterGroup
        label={`Sources (${sources.length})`}
        sources={IMAGE_SOURCES}
        activeSources={sources}
        setSources={setSources}
      />
    </header>
  );
}
