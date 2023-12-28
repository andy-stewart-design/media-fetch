// TODO: figure out strtaegy for loading screen

import { useState, useEffect } from "react";
import ImageGallery from "@components/ImageGallery";
import Header from "@components/Header";
import Footer from "@components/Footer";
import type { ImageData } from "@utils/image-search";
import type { PluginPostMessage } from "@src/types/post-messages";
import "./styles/main.css";

function App() {
  const [status, setStatus] = useState("idle"); // idle, searching, inserting
  const [images, setImages] = useState<ImageData[] | null>(null);

  useEffect(() => {
    function handleMessage({ data }: MessageEvent<PluginPostMessage>) {
      const { type } = data.pluginMessage;

      if (type === "RESULTS_INIT") {
        const { payload } = data.pluginMessage;
        setImages(payload.images);
        setStatus("idle");
      }
    }

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <main>
      <Header setStatus={setStatus} setImages={setImages} />
      {status === "searching" ? (
        <div className="flex-grow" />
      ) : (
        <ImageGallery images={images} setImages={setImages} />
      )}
      <Footer setImages={setImages} numImages={images?.length ?? 0} />
    </main>
  );
}

export default App;
