import { useState, useEffect, useContext } from 'react';
import ImageGallery from '@components/ImageGallery';
import Header from '@components/Header';
import Footer from '@components/Footer';
import Loading from '@components/Loading';
import QueryError from '@components/QueryError';
import { SearchQueryContext } from '@components/Providers/SearchQueryProvider';
import { SearchFilterContext } from '@components/Providers/SearchFilterProvider';
import { ErrorDialogDisplayContext } from '@components/Providers/ErrorDialogDisplayProvider';
import { AppStatusContext } from '@components/Providers/AppStatusProvider';
import type { StockImageData } from '@utils/image-search';
import type { PluginPostMessage, UIPostMessage } from '@src/types/post-messages';

export default function Main() {
  // GLOBAL STATE
  const { appStatus, setAppStatus } = useContext(AppStatusContext);
  const { searchQuery, setSearchQuery } = useContext(SearchQueryContext);
  const { searchFilters } = useContext(SearchFilterContext);
  const errorDialog = useContext(ErrorDialogDisplayContext);

  // LOCAL STATE
  const [images, setImages] = useState<StockImageData[] | null>(null);

  // KICK OFF INITIAL IMAGE REQUEST WHEN RELEVANT PARAMETERS CHANGE
  useEffect(() => {
    if (searchQuery.value !== '') {
      setAppStatus('SEARCHING');
      const initialRequest = searchQuery.page === 1;
      if (initialRequest) {
        setImages(null);
      }
      const type = initialRequest ? 'QUERY_INIT' : 'QUERY_ADD';

      const pluginMessage: UIPostMessage = {
        type,
        payload: {
          query: searchQuery.value,
          services: searchQuery.sources,
          orientation: searchFilters.orientation,
          primaryColor: searchFilters.primaryColor,
          page: searchQuery.page,
          imagesPerService: searchQuery.imagesPerService,
        },
      };

      parent.postMessage({ pluginMessage }, '*');
    }
  }, [searchQuery, searchFilters]);

  // HANDLE ANY MESSAGES RECEIVED FROM THE PLUGIN
  useEffect(() => {
    function handleMessage({ data }: MessageEvent<PluginPostMessage>) {
      const { type, payload } = data.pluginMessage;

      if (type === 'RESULTS_INIT') {
        setImages(payload.images);
        setAppStatus('IDLE');

        const cols = payload.images.reduce(
          (acc, cur, idx) => {
            idx % 2 === 0 ? acc[0].push(cur) : acc[1].push(cur);
            return acc;
          },
          [[], []] as Array<Array<StockImageData>>
        );

        const [colLeft, colRight] = cols.map((col) => {
          const height = col.reduce((acc, image) => {
            return acc + image.height;
          }, 0);

          const lastImageHeights = col.toSpliced(0, col.length - 4).map((col) => col.height);

          return { height, lastImageHeights: [0, ...lastImageHeights] };
        });

        console.log({ colLeft, colRight });

        const heightDifference = colLeft.height - colRight.height;
        console.log({ heightDifference });

        if (heightDifference < 0) {
          // right column is longer
          console.log('right column is longer');

          const colRightHeights = colRight.lastImageHeights.reduce(
            (acc, cur, index) => {
              if (index === 0) return [acc[index] - cur];
              else return [...acc, acc[index - 1] - cur];
            },
            [colRight.height]
          );
          const colLeftHeights = colRight.lastImageHeights.reduce(
            (acc, cur, index) => {
              if (index === 0) return [acc[index] + cur];
              else return [...acc, acc[index - 1] + cur];
            },
            [colLeft.height]
          );

          console.log({ colRightHeights, colLeftHeights });
        } else if (heightDifference > 0) {
          console.log('left column is longer');
        }
      } else if (type === 'RESULTS_ADD') {
        setImages((images) => {
          if (!images) return null;
          else return [...images, ...payload.images];
        });
        setAppStatus('IDLE');
      } else if (type === 'QUICK_ACTION') {
        setSearchQuery((current) => ({ ...current, value: payload.query, syncHeader: true }));
      } else if (type === 'QUERY_ERROR') {
        setImages(null);
        setAppStatus(type);
      } else if (type === 'PLACE_IMAGE_SUCCESS') {
        setAppStatus('IDLE');
      } else if (type === 'PLACE_IMAGE_ERROR') {
        errorDialog.setShowDialog();
        errorDialog.setMessage(payload.message);
        setAppStatus('IDLE');
      }
    }

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <main style={{ isolation: 'isolate' }}>
      <Header />
      {!images && appStatus === 'SEARCHING' ? (
        <Loading message="Finding images" />
      ) : appStatus === 'QUERY_ERROR' ? (
        <QueryError setStatus={setAppStatus} />
      ) : (
        <ImageGallery images={images} setImages={setImages} />
      )}
      <Footer setImages={setImages} numImages={images?.length ?? 0} />
      {appStatus === 'GENERATING' && <Loading display="fullscreen" message="Placing image" />}
    </main>
  );
}
