import { ReactNode } from "react";
import SearchQueryProvider from "./SearchQueryProvider";
import SearchFilterProvider from "./SearchFilterProvider";
import FilterDialogDisplayProvider from "./FilterDialogDisplayProvider";
import ExportSettingsProvider from "./ExportSettingsProvider";

interface PropTypes {
  children: ReactNode;
}

export default function Providers({ children }: PropTypes) {
  return (
    <>
      <SearchQueryProvider>
        <SearchFilterProvider>
          <ExportSettingsProvider>
            <FilterDialogDisplayProvider>
              {children}
            </FilterDialogDisplayProvider>
          </ExportSettingsProvider>
        </SearchFilterProvider>
      </SearchQueryProvider>
    </>
  );
}
