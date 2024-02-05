// POST LAUNCH
// TODO: clean up Filter dialog CSS
// TODO: Polish error state styles
// TODO: Consider adding Openverse as a service: https://api.openverse.engineering/v1/

import Providers from '@components/Providers';
import Main from '@components/Main';
import './styles/main.css';

function App() {
  return (
    <Providers>
      <Main />
    </Providers>
  );
}

export default App;
