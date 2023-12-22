import { useState, useEffect, FormEvent } from "react";
import type { ImageData } from "@src/utils/image-search";
import "./styles/main.css";
import SearchBar from "./components/SearchBar";
import ToggleGroup from "./components/ToggleGroup";
import { IMAGE_SOURCES } from "./constants/image-sources";

function App() {
  const [value, setValue] = useState("");
  const [sources, setSources] = useState<Array<string>>([
    "unsplash",
    "pexels",
    "pixabay",
  ]);
  const [images, setImages] = useState<ImageData[] | null>(null);

  function handleCreate(e: FormEvent) {
    e.preventDefault();

    parent.postMessage(
      {
        pluginMessage: {
          type: "image-search",
          data: { query: value, sources },
        },
      },
      "*"
    );
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
    <>
      <header>
        <SearchBar
          value={value}
          setValue={setValue}
          handleCreate={handleCreate}
        />
        <ToggleGroup
          label="Sources"
          sources={IMAGE_SOURCES}
          activeSources={sources}
          setSources={setSources}
        />
      </header>
      {images && (
        <main className="img-gallery">
          {images.map((image) => (
            <div key={image.id} className="img-card">
              <img src={image.image_thumbnail} />
              <p>
                {image.source} · {image.photographer}
              </p>
            </div>
          ))}
        </main>
      )}
    </>
  );
}

export default App;
