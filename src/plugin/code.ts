import { searchImages } from '@utils/image-search';
import { shuffle } from '@utils/shuffle';
import { placeImage } from '@src/utils/place-image';
import { handleError } from '@src/utils/handle-error';
import type {
  UIPostMessage,
  ImageResultsInitial,
  ImageResultsAdditional,
} from '@src/types/post-messages';

// BOILERPLATE CODE TO DISPLAY THE UI WHEN THE PLUGIN IS RUN
figma.showUI(__html__, {
  height: 680,
  width: 520,
  themeColors: true,
});

// MESSAGE HANDLER
figma.ui.onmessage = async (message: UIPostMessage) => {
  if (message.type === 'QUERY_INIT' || message.type === 'QUERY_ADD') {
    const { payload } = message;

    try {
      const imageData = await searchImages(payload);
      const type = message.type === 'QUERY_INIT' ? 'RESULTS_INIT' : 'RESULTS_ADD';

      const data: ImageResultsInitial | ImageResultsAdditional = {
        type,
        payload: {
          images: shuffle(imageData),
        },
      };

      figma.ui.postMessage(data);
    } catch (error) {
      handleError(error);
    }
  } else if (message.type === 'PLACE_IMAGE') {
    const { src, width, height, quality, exportSize } = message.payload;

    const imageResult = await placeImage(src, width, height, quality, exportSize);

    if (imageResult.ok) figma.notify('Placed image successful');
  } else if (message.type === 'ERROR') {
    figma.notify(message.payload.message, { error: true });
  }
};
