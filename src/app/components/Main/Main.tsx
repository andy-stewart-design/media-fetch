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
    <main>
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
