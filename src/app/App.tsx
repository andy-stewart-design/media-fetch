// TODO: figure out strategy for loading screen
// TODO: Polish light mode and error state styles
// POST LAUNCH
// TODO: tooltips
// TODO: view image dialog

import Providers from '@components/Providers';
import Main from '@components/Main';
import FilterDialog from '@components/FilterDialog';
import ErrorDialog from '@components/ErrorDialog';
import './styles/main.css';

function App() {
  return (
    <Providers>
      <Main />
      <FilterDialog />
      <ErrorDialog />
    </Providers>
  );
}

export default App;
