// TODO: return errors to the UI
// postMessage types: initialResults, additionalResults, error

import { searchImages, type ImageService } from "@src/utils/image-search";
import { shuffle } from "@src/utils/shuffle";

const services: Array<ImageService> = ["unsplash", "pexels"];

figma.showUI(__html__, {
  height: 640,
  width: 480,
});

figma.ui.onmessage = async (message) => {
  if (message.type === "image-search") {
    const { query } = message;
    // figma.notify(`You searched for ${query}`);

    try {
      const imageData = await searchImages(query, services);

      figma.ui.postMessage({
        type: "initialResults",
        data: shuffle(imageData),
      });
    } catch (error) {
      if (!error) {
        // This is an error thrown from an unknown source
        console.error("Unknown error");
        return;
      } else if (error instanceof Error) {
        const message = error.message.toLocaleLowerCase();
        // This is likely an error thrown from one of the image search functions
        if (message.includes("unsplash")) {
          console.error("Unsplash problem");
        } else if (message.includes("pexels")) {
          console.error("Pexels problem");
        } else if (message.includes("pixabay")) {
          console.error("Pixabay problem");
        } else console.error(error.message);
      } else if (typeof error === "object" && "message" in error) {
        if (error.message === "Failed to fetch") {
          // This is likely an error thrown by the fetch request itself
          console.error("There was a problem with the fetch request");
        }
      }
    }
  }
};
