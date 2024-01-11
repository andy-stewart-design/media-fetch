// TODO: Polish light mode and error state styles
// TODO: Clean up code
// POST LAUNCH
// TODO: remove need to pass setStatus to this component
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
