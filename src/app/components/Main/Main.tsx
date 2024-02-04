import { useState, useEffect, useContext } from 'react';
import ImageGallery from '@components/ImageGallery';
import Header from '@components/Header';
import Footer from '@components/Footer';
import ErrorDialog from '@components/ErrorDialog';
import Loading from '@components/Loading';
import QueryError from '@components/QueryError';
import { SearchQueryContext } from '@components/Providers/SearchQueryProvider';
import { SearchFilterContext } from '@components/Providers/SearchFilterProvider';
import { AppStatusContext } from '@components/Providers/AppStatusProvider';
import { useToggle } from '@hooks/use-input';
import { shuffle } from '@utils/shuffle';
import type { StockImageData } from '@utils/image-search';
import type { PluginPostMessage, UIPostMessage } from '@src/types/post-messages';

export default function Main() {
  // GLOBAL STATE
  const { appStatus, setAppStatus } = useContext(AppStatusContext);
  const { searchQuery, setSearchQuery } = useContext(SearchQueryContext);
  const { searchFilters } = useContext(SearchFilterContext);

  // LOCAL STATE
  const [images, setImages] = useState<Array<Array<StockImageData>> | null>(null);
  const [total, setTotal] = useState(0);
  const [showErrorDialog, setShowErrorDialog] = useToggle(false);
  // const [message, setMessage] = useState('');

  // KICK OFF INITIAL IMAGE REQUEST WHEN RELEVANT PARAMETERS CHANGE
  useEffect(() => {
    if (searchQuery.value !== '') {
      setAppStatus('SEARCHING');
      const initialRequest = searchQuery.page === 1;
      if (initialRequest) {
        setImages(null);
        setTotal(0);
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
        setImages(createColumns(payload.images).toReversed());
        setTotal(payload.total);
        setAppStatus('IDLE');
      } else if (type === 'RESULTS_ADD') {
        setImages((currentImages) => {
          if (!currentImages) return null;
          else {
            const [curColLeft, curColRight] = currentImages;
            const [newColOne, newColTwo] = createColumns(payload.images);

            const currentPage = currentImages.flat().length / 30 + 1;
            const pageIsEven = currentPage % 2 === 0;

            const newColLeft = pageIsEven
              ? curColLeft.concat(newColOne)
              : curColLeft.concat(newColTwo);
            const newColRight = pageIsEven
              ? curColRight.concat(newColTwo)
              : curColRight.concat(newColOne);

            return [newColLeft, newColRight];
          }
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
        setShowErrorDialog(false);
        // errorDialog.setMessage(payload.message);
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
      <Footer setImages={setImages} numImages={images?.flat().length ?? 0} totalImages={total} />
      <ErrorDialog status={showErrorDialog} onChange={setShowErrorDialog} />
      <Loading open={appStatus === 'GENERATING'} display="fullscreen" message="Placing image" />
    </main>
  );
}

function createColumns(images: Array<StockImageData>) {
  const sortedImages = images?.toSorted((a, b) => {
    const aHeight = a.height / a.width;
    const bHeight = b.height / b.width;
    return aHeight - bHeight;
  });

  const cols = sortedImages?.reduce(
    (acc, cur, idx) => {
      idx % 2 === 0 ? acc[0].push(cur) : acc[1].push(cur);
      return acc;
    },
    [[], []] as Array<Array<StockImageData>>
  );

  return cols?.map((col) => shuffle(col));
}
