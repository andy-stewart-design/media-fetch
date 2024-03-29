import { createContext, useState, type ReactNode, type Dispatch, type SetStateAction } from 'react';
import { ImageService } from '@src/utils/image-search';

interface SearchQuery {
  value: string;
  sources: Array<ImageService>;
  imagesPerService: number;
  syncHeader: boolean;
  page: number;
}

interface QueryContext {
  searchQuery: SearchQuery;
  setSearchQuery: Dispatch<SetStateAction<SearchQuery>>;
}

export const SearchQueryContext = createContext<QueryContext>({
  searchQuery: {
    value: '',
    sources: [],
    imagesPerService: 0,
    syncHeader: false,
    page: 1,
  },
  setSearchQuery: () => {},
});

interface ProviderProps {
  children: ReactNode;
}

export default function FilterDialogDisplayProvider({ children }: ProviderProps) {
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    value: '',
    sources: ['unsplash', 'pexels', 'pixabay'],
    imagesPerService: 10,
    syncHeader: false,
    page: 1,
  });

  return (
    <SearchQueryContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchQueryContext.Provider>
  );
}
