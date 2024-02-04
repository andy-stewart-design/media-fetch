import { ReactNode } from 'react';
import SearchQueryProvider from './SearchQueryProvider';
import SearchFilterProvider from './SearchFilterProvider';
import ExportSettingsProvider from './ExportSettingsProvider';
import AppStatusProvider from './AppStatusProvider/AppStatusProvider';

interface PropTypes {
  children: ReactNode;
}

export default function Providers({ children }: PropTypes) {
  return (
    <>
      <SearchQueryProvider>
        <SearchFilterProvider>
          <ExportSettingsProvider>
            <AppStatusProvider>{children}</AppStatusProvider>
          </ExportSettingsProvider>
        </SearchFilterProvider>
      </SearchQueryProvider>
    </>
  );
}
