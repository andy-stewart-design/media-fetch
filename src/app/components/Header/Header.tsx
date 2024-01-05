import { FormEvent, useContext, useState } from 'react';
import SearchBar from '@components/SearchBar';
import ToggleGroup from '@components/ToggleGroup';
import { IMAGE_SOURCES } from '@src/app/constants/image-sources';
import type { ImageService } from '@src/utils/image-search';

import classes from './component.module.css';
import { SearchQueryContext } from '@components/Providers/SearchQueryProvider';

export default function Header() {
  const { searchQuery, setSearchQuery } = useContext(SearchQueryContext);

  const [value, setValue] = useState('');
  const [sources, setSources] = useState<Array<ImageService>>(['unsplash', 'pexels', 'pixabay']);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const imagesPerService = 30 / searchQuery.sources.length;
    setSearchQuery({ value, sources, imagesPerService });
  }

  return (
    <header className={classes['header']}>
      <SearchBar value={value} setValue={setValue} onSubmit={handleSubmit} />
      <ToggleGroup
        label={`Sources (${sources.length})`}
        sources={IMAGE_SOURCES}
        activeSources={sources}
        setSources={setSources}
      />
    </header>
  );
}
