import { searchImages } from "@utils/image-search";
import { shuffle } from "@utils/shuffle";
import type {
  UIPostMessage,
  ImageResultsInitial,
} from "@src/types/post-messages";
import { placeImage } from "@src/utils/place-image";
import { handleError } from "@src/utils/handle-error";

// BOILERPLATE CODE TO DISPLAY THE UI WHEN THE PLUGIN IS RUN
figma.showUI(__html__, {
  height: 680,
  width: 520,
});

// MESSAGE HANDLER
figma.ui.onmessage = async (message: UIPostMessage) => {
  if (message.type === "QUERY_INIT") {
    const { query, sources } = message.payload;

    try {
      const imageData = await searchImages(query, sources);

      const data: ImageResultsInitial = {
        type: "RESULTS_INIT",
        payload: {
          images: shuffle(imageData),
        },
      };

      figma.ui.postMessage(data);
    } catch (error) {
      handleError(error);
    }
  } else if (message.type === "PLACE_IMAGE") {
    const { src, width, height } = message.payload;

    const imageResult = await placeImage(src, width, height);

    if (imageResult.ok) figma.notify("Placed image successful");
  } else if (message.type === "ERROR") {
    figma.notify(message.payload.message, { error: true });
  }
};
