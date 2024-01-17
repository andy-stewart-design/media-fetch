// TODO: Clean up code
// -- remove need to pass setStatus to Query Error component

// POST LAUNCH
// TODO: Polish error state styles
// TODO: tooltips
// TODO: view image dialog
// TODO: Consider adding Openverse as a service: https://api.openverse.engineering/v1/

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
