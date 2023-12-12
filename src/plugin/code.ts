import { searchImages, type ImageService } from "@src/utils/image-search";

const services: Array<ImageService> = ["unsplash", "pexels"];

figma.showUI(__html__, {
  height: 500,
  width: 500,
});

figma.ui.onmessage = async (msg) => {
  if (msg.type === "image-search") {
    const { query } = msg;
    figma.notify(`You searched for ${query}`);

    try {
      const images = await searchImages(query, services);
      console.log(images);
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
      else console.error(error);
    }
  }
};
