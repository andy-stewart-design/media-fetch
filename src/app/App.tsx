import { useState } from "react";
import "./App.css";

function App() {
  const [value, setValue] = useState("");

  function handleCreate() {
    console.log("testing app file");

    parent.postMessage(
      { pluginMessage: { type: "create-rectangles", count: Number(value) } },
      "*"
    );
  }

  function handleCancel() {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  }

  return (
    <div>
      <h2>Rectangle Generator</h2>
      <label>
        Countkjn:
        <input value={value} onChange={(e) => setValue(e.target.value)} />
      </label>
      <button onClick={handleCreate}>Create</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
}

export default App;
