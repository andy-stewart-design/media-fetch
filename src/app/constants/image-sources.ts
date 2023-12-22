import Unsplash from "@components/logos/Unsplash";
import Pexels from "@components/logos/Pexels";
import Pixabay from "@components/logos/Pixabay";

export interface ImageSource {
  name: string;
  value: string;
  icon: () => JSX.Element;
}

export const IMAGE_SOURCES: Array<ImageSource> = [
  {
    name: "Unsplash",
    value: "unsplash",
    icon: Unsplash,
  },
  {
    name: "Pexels",
    value: "pexels",
    icon: Pexels,
  },
  {
    name: "Pixabay",
    value: "pixabay",
    icon: Pixabay,
  },
];
