export interface StockImageData {
  id: string;
  width: number;
  height: number;
  image_thumbnail: string;
  image_large: string;
  image_download: string;
  image_link: string;
  photographer: string;
  photographer_avatar?: string | undefined;
  photographer_link: string;
  source: string;
}

export type ImageService = 'unsplash' | 'pexels' | 'pixabay';

//------------------------------------------------
// TYPE DEFINITIONS
//------------------------------------------------

interface GeneralSearchProps {
  query: string;
  services: Array<ImageService>;
  orientation: string;
  primaryColor: string;
  page: number;
  imagesPerService: number;
}

interface ServiceSearchProps {
  query: string;
  orientation: string;
  primaryColor: string;
  page: number;
  imagesPerService: number;
}

interface ServiceSearchResponse {
  total: number;
  results: Array<StockImageData>;
}

//------------------------------------------------
// ORCHESTRATING FUNCTION
//------------------------------------------------

export async function searchImages({
  query,
  services,
  orientation,
  primaryColor,
  page,
  imagesPerService,
}: GeneralSearchProps) {
  // get fetch response promises
  const fetchResponses: Array<Promise<ServiceSearchResponse>> = [];
  const restSearchArgs = { query, orientation, primaryColor, page, imagesPerService };

  if (services.includes('unsplash')) fetchResponses.push(searchUnsplash(restSearchArgs));
  if (services.includes('pexels')) fetchResponses.push(searchPexels(restSearchArgs));
  if (services.includes('pixabay')) fetchResponses.push(searchPixabay(restSearchArgs));

  // run the image searches concurrently to prevent a waterfall
  const searchResponse = await Promise.all(fetchResponses);

  const formatedResponse = searchResponse.reduce(
    (acc, cur) => {
      const total = acc.total + cur.total;
      const results = [...acc.results, ...cur.results];
      return { total, results };
    },
    { total: 0, results: [] }
  );

  // Combine results from all platforms into a single array
  return formatedResponse;
}

//------------------------------------------------
// UNSPLASH HELPER FUNCTION
//------------------------------------------------

export async function searchUnsplash({
  query,
  orientation,
  primaryColor,
  page,
  imagesPerService,
}: ServiceSearchProps) {
  const apiURL = `https://media-fetch-hono.vercel.app/unsplash?query=${query}&page=${page}&per_page=${imagesPerService}&orientation=${orientation}&color=${primaryColor}`;

  const response = await fetch(apiURL);

  if (!response.ok) throw new Error('Failed to fetch data from Unsplash');

  const data: ServiceSearchResponse = await response.json();

  return data;
}

//------------------------------------------------
// PEXELS HELPER FUNCTION
//------------------------------------------------

async function searchPexels({
  query,
  orientation,
  primaryColor,
  page,
  imagesPerService,
}: ServiceSearchProps) {
  const apiURL = `https://media-fetch-hono.vercel.app/pexels?query=${query}&page=${page}&per_page=${imagesPerService}&orientation=${orientation}&color=${primaryColor}`;

  const response = await fetch(apiURL);

  if (!response.ok) throw new Error('Failed to fetch data from Unsplash');

  const data: ServiceSearchResponse = await response.json();

  return data;
}

//------------------------------------------------
// PIXABAY HELPER FUNCTION
//------------------------------------------------

async function searchPixabay({
  query,
  orientation,
  primaryColor,
  page,
  imagesPerService,
}: ServiceSearchProps) {
  const apiURL = `https://media-fetch-hono.vercel.app/pixabay?query=${query}&page=${page}&per_page=${imagesPerService}&orientation=${orientation}&color=${primaryColor}`;

  const response = await fetch(apiURL);

  if (!response.ok) throw new Error('Failed to fetch data from Unsplash');

  const data: ServiceSearchResponse = await response.json();

  return data;
}
