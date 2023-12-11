import { useState } from "react";
import "./App.css";

function App() {
  const [value, setValue] = useState("");

  function handleCreate() {
    console.log("hell yeah!");

    parent.postMessage(
      { pluginMessage: { type: "image-search", query: value } },
      "*"
    );
  }

  function handleCancel() {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  }

  return (
    <main>
      <h2>Image Search</h2>
      <label>
        Search
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
      <div className="btn-group">
        <button onClick={handleCreate}>Create</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </main>
  );
}

export default App;
