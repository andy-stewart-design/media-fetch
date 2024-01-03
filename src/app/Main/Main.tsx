import { useState, useEffect, useContext } from "react";
import ImageGallery from "@components/ImageGallery";
import Header from "@components/Header";
import Footer from "@components/Footer";
import { SearchQueryContext } from "@components/Providers/SearchQueryProvider";
import { SearchFilterContext } from "@components/Providers/SearchFilterProvider";
import type { ImageData } from "@utils/image-search";
import type {
  PluginPostMessage,
  UIPostMessage,
} from "@src/types/post-messages";

export default function Main() {
  // GLOBAL STATE
  const { searchQuery } = useContext(SearchQueryContext);
  const { searchFilters } = useContext(SearchFilterContext);

  // LOCAL STATE
  const [status, setStatus] = useState("idle"); // idle, searching, inserting
  const [images, setImages] = useState<ImageData[] | null>(null);

  //   Initiate search when any relevant parameters change
  useEffect(() => {
    if (searchQuery.value !== "") {
      setStatus("searching");
      setImages([]);

      const pluginMessage: UIPostMessage = {
        type: "QUERY_INIT",
        payload: {
          query: searchQuery.value,
          sources: searchQuery.sources,
          orientation: searchFilters.orientation,
          primaryColor: searchFilters.primaryColor,
        },
      };

      parent.postMessage({ pluginMessage }, "*");
    }
  }, [searchQuery, searchFilters]);

  //   handle any messages received from the plugin
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
      <Header />
      {status === "searching" ? (
        <div className="flex-grow" />
      ) : (
        <ImageGallery images={images} setImages={setImages} />
      )}
      <Footer setImages={setImages} numImages={images?.length ?? 0} />
    </main>
  );
}
