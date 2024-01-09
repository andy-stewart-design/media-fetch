import { useState, useEffect, useContext } from 'react';
import ImageGallery from '@components/ImageGallery';
import Header from '@components/Header';
import Footer from '@components/Footer';
import Loading from '@components/Loading';
import QueryError from '@components/QueryError';
import { SearchQueryContext } from '@components/Providers/SearchQueryProvider';
import { SearchFilterContext } from '@components/Providers/SearchFilterProvider';
import { ErrorDialogDisplayContext } from '@components/Providers/ErrorDialogDisplayProvider';
import type { StockImageData } from '@utils/image-search';
import type { PluginPostMessage, UIPostMessage } from '@src/types/post-messages';

export default function Main() {
  // GLOBAL STATE
  const { searchQuery, setSearchQuery } = useContext(SearchQueryContext);
  const { searchFilters } = useContext(SearchFilterContext);
  const errorDialog = useContext(ErrorDialogDisplayContext);

  // LOCAL STATE
  const [status, setStatus] = useState('IDLE'); // IDLE, SEARCHING, GENERATING, QUERY_ERROR
  const [images, setImages] = useState<StockImageData[] | null>(null);
  // const [currentPage, setCurrentPage] = useState(1);

  // KICK OFF INITIAL IMAGE REQUEST WHEN RELEVANT PARAMETERS CHANGE
  useEffect(() => {
    if (searchQuery.value !== '') {
      console.log(searchQuery);

      const initialRequest = searchQuery.page === 1;
      if (initialRequest) {
        setStatus('SEARCHING');
        setImages([]);
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
        setStatus('IDLE');
      } else if (type === 'RESULTS_ADD') {
        setImages((images) => {
          if (!images) return null;
          else return [...images, ...payload.images];
        });
      } else if (type === 'QUICK_ACTION') {
        setSearchQuery((current) => ({ ...current, value: payload.query, syncHeader: true }));
      } else if (type === 'QUERY_ERROR') {
        setImages(null);
        setStatus(type);
      } else if (type === 'PLACE_IMAGE_ERROR') {
        errorDialog.setShowDialog();
        errorDialog.setMessage(payload.message);
        setStatus('IDLE');
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
      {status === 'SEARCHING' ? (
        <Loading />
      ) : status === 'QUERY_ERROR' ? (
        <QueryError setStatus={setStatus} />
      ) : (
        <ImageGallery images={images} setImages={setImages} />
      )}
      <Footer setImages={setImages} numImages={images?.length ?? 0} />
    </main>
  );
}
