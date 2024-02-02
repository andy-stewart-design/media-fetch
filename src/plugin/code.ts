import { searchImages } from '@utils/image-search';
import { shuffle } from '@utils/shuffle';
import { placeImage } from '@src/utils/place-image';
import { handleError } from '@src/utils/handle-error';
import type {
  UIPostMessage,
  ImageResultsInitial,
  ImageResultsAdditional,
  QueryError,
  PlaceImageError,
  QuickAction,
  PlaceImageSuccess,
} from '@src/types/post-messages';

// const uiOptions = { height: 680, width: 520, themeColors: true };

// BOILERPLATE CODE TO DISPLAY THE UI WHEN THE PLUGIN IS RUN
figma.showUI(__html__, { height: 680, width: 520, themeColors: true, visible: false });

figma.parameters.on('input', async ({ result }) => {
  result.setLoadingMessage('');
});

figma.on('run', (event) => {
  if (event.parameters) {
    const data: QuickAction = {
      type: 'QUICK_ACTION',
      payload: {
        query: event.parameters['query'],
      },
    };

    figma.ui.postMessage(data);
    figma.ui.show();
  } else {
    figma.ui.show();
  }
});

// MESSAGE HANDLER
figma.ui.onmessage = async (message: UIPostMessage) => {
  if (message.type === 'QUERY_INIT' || message.type === 'QUERY_ADD') {
    const { payload } = message;

    try {
      // throw new Error('This is a test query error');
      const imgData = await searchImages(payload);
      const type = message.type === 'QUERY_INIT' ? 'RESULTS_INIT' : 'RESULTS_ADD';

      const data: ImageResultsInitial | ImageResultsAdditional = {
        type,
        payload: {
          total: imgData.total,
          images: shuffle(imgData.results),
        },
      };

      figma.ui.postMessage(data);
    } catch (error) {
      const message = handleError(error);

      const data: QueryError = {
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
      await placeImage(src, width, height, quality, exportSize);

      const message = 'Image generated successfully';

      const data: PlaceImageSuccess = {
        type: 'PLACE_IMAGE_SUCCESS',
        payload: {
          message,
        },
      };

      figma.ui.postMessage(data);
      figma.notify('✅ ' + message);
    } catch (error) {
      const message = handleError(error);

      const data: PlaceImageError = {
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
