// POST LAUNCH
// TODO: Switch images to masonry grid
// TODO: tooltips
// TODO: Polish error state styles
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
