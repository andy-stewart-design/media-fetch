import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import SearchBar from "@components/SearchBar";
import ToggleGroup from "@components/ToggleGroup";
import { IMAGE_SOURCES } from "@src/app/constants/image-sources";
import type { ImageData } from "@utils/image-search";
import type { ImageService } from "@src/utils/image-search";
import { UIPostMessage } from "@src/types/post-messages";
import classes from "./component.module.css";

interface PropTypes {
  setStatus: Dispatch<SetStateAction<string>>;
  setImages: Dispatch<SetStateAction<ImageData[] | null>>;
}

export default function Header({ setImages, setStatus }: PropTypes) {
  const [value, setValue] = useState("");
  const [sources, setSources] = useState<Array<ImageService>>([
    "unsplash",
    "pexels",
    "pixabay",
  ]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("searching");
    setImages([]);

    const pluginMessage: UIPostMessage = {
      type: "QUERY_INIT",
      payload: { query: value, sources },
    };

    parent.postMessage({ pluginMessage }, "*");
  }

  return (
    <header className={classes["header"]}>
      <SearchBar value={value} setValue={setValue} onSubmit={handleSubmit} />
      <ToggleGroup
        label={`Sources (${sources.length})`}
        sources={IMAGE_SOURCES}
        activeSources={sources}
        setSources={setSources}
      />
    </header>
  );
}
