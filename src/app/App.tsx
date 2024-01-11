// TODO: Make sure Unsplash and Pexels are working
// TODO: consider replacing Pixabay
// TODO: Polish light mode and error state styles
// POST LAUNCH
// TODO: remove need to pass setStatus to this component
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
