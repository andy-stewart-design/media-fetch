// TODO: style filter footer
// TODO: protect secret keys
// TODO: load more functionality
// TODO: Error Handling
// TODO: figure out strategy for loading screen
// TODO: light mode
// POST LAUNCH
// TODO: tooltips
// TODO: view image dialog

import Providers from "@components/Providers";
import FilterDialog from "@components/FilterDialog";
import "./styles/main.css";
import Main from "./Main/Main";

function App() {
  return (
    <Providers>
      <Main />
      <FilterDialog />
    </Providers>
  );
}

export default App;
