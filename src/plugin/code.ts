import { searchImages } from '@utils/image-search';
import { shuffle } from '@utils/shuffle';
import { placeImage } from '@src/utils/place-image';
import { handleError } from '@src/utils/handle-error';
import type {
  UIPostMessage,
  ImageResultsInitial,
  ImageResultsAdditional,
  QueryErrorMessage,
  PlaceImageErrorMessage,
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
      // throw new Error('This is a test query error');
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
      const message = handleError(error);

      const data: QueryErrorMessage = {
        type: 'QUERY_ERROR',
        payload: {
          message,
        },
      };

      figma.ui.postMessage(data);
    }
  } else if (message.type === 'PLACE_IMAGE') {
    const { src, width, height, quality, exportSize } = message.payload;

    try {
      // throw new Error('This is a test place image error');
      const imageResult = await placeImage(src, width, height, quality, exportSize);
      if (imageResult.ok) figma.notify('Placed image successful');
    } catch (error) {
      const message = handleError(error);

      const data: PlaceImageErrorMessage = {
        type: 'PLACE_IMAGE_ERROR',
        payload: {
          message,
        },
      };

      figma.ui.postMessage(data);
    }
  } else if (message.type === 'ERROR') {
    figma.notify(message.payload.message, { error: true });
  }
};
