import type { ImageData } from "@src/utils/image-search";
import Unsplash from "@components/logos/Unsplash";
import Pexels from "@components/logos/Pexels";
import Pixabay from "@components/logos/Pixabay";
import classes from "./component.module.css";

interface PropTypes {
  image: ImageData;
}

export default function ImageCard({ image }: PropTypes) {
  const {
    source,
    image_thumbnail,
    image_link,
    photographer,
    photographer_link,
  } = image;

  const Icon =
    source.toLocaleLowerCase() === "unsplash"
      ? Unsplash
      : source.toLocaleLowerCase() === "pexels"
      ? Pexels
      : Pixabay;

  return (
    <div className={classes["img-card"]}>
      <img src={image_thumbnail} />
      <p>
        <a href={image_link} target="_blank">
          <Icon />
          {source}
        </a>
        <span>·</span>
        <a href={photographer_link} target="_blank">
          {photographer}
        </a>
      </p>
    </div>
  );
}
