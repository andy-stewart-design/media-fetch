import { ReactNode } from 'react';
import SearchQueryProvider from './SearchQueryProvider';
import SearchFilterProvider from './SearchFilterProvider';
import FilterDialogDisplayProvider from './FilterDialogDisplayProvider';
import ExportSettingsProvider from './ExportSettingsProvider';
import ErrorDialogDisplayProvider from './ErrorDialogDisplayProvider';

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
              <ErrorDialogDisplayProvider>{children}</ErrorDialogDisplayProvider>
            </FilterDialogDisplayProvider>
          </ExportSettingsProvider>
        </SearchFilterProvider>
      </SearchQueryProvider>
    </>
  );
}
