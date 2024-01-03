import {
  createContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

interface SearchFilters {
  orientation: string;
  primaryColor: string;
}

interface FilterContext {
  searchFilters: SearchFilters;
  setSearchFilters: Dispatch<SetStateAction<SearchFilters>>;
}

export const SearchFilterContext = createContext<FilterContext>({
  searchFilters: {
    orientation: "",
    primaryColor: "",
  },
  setSearchFilters: () => {},
});

interface ProviderProps {
  children: ReactNode;
}

export default function FilterDialogDisplayProvider({
  children,
}: ProviderProps) {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    orientation: "all",
    primaryColor: "any",
  });

  return (
    <SearchFilterContext.Provider value={{ searchFilters, setSearchFilters }}>
      {children}
    </SearchFilterContext.Provider>
  );
}
