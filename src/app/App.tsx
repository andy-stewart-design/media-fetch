import { useState, useEffect, FormEvent } from "react";
import type { ImageData } from "@src/utils/image-search";
import { Search } from "./components/icons/24/Search/Search";
import "./styles/main.css";

function App() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState<ImageData[] | null>(null);

  function handleCreate(e: FormEvent) {
    e.preventDefault();

    parent.postMessage(
      { pluginMessage: { type: "image-search", query: value } },
      "*"
    );
  }

  function handleCancel() {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  }

  useEffect(() => {
    window.addEventListener("message", (event) => {
      const { type } = event.data.pluginMessage;

      if (type === "initialResults") {
        const { data } = event.data.pluginMessage;
        console.log(data);
        setImages(data);
      }
    });
  }, []);

  return (
    <main>
      <form onSubmit={handleCreate}>
        <label>
          Search
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a search term"
          />
        </label>
        <button type="submit">
          <span className="sr-only">Search</span>
          <Search />
        </button>
        <button onClick={handleCancel}>
          <span className="sr-only">Cancel</span>
        </button>
      </form>
      {images && (
        <div className="img-gallery">
          {images.map((image) => (
            <div key={image.id} className="img-card">
              <img src={image.image_thumbnail} />
              <p>
                {image.source} · {image.photographer}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default App;
