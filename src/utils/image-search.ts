export interface ImageData {
  id: string;
  width: number;
  height: number;
  image_thumbnail: string;
  image_large: string;
  image_link: string;
  photographer: string;
  photographer_link: string;
  source: string;
}

export type ImageService = "unsplash" | "pexels" | "pixabay";

//------------------------------------------------
// UNSPLASH
//------------------------------------------------
export async function searchUnsplash(
  query: string,
  orientation: string,
  primaryColor: string,
  amount = 10
): Promise<ImageData[]> {
  const apiURL = `https://media-fetch-hono.vercel.app/unsplash?query=${query}&per_page=${amount}&orientation=${orientation}&color=${primaryColor}`;

  const response = await fetch(apiURL);

  if (!response.ok) throw new Error("Failed to fetch data from Unsplash");

  const data: ImageData[] = await response.json();

  return data;
}

//------------------------------------------------
// PEXELS
//------------------------------------------------
async function searchPexels(
  query: string,
  orientation: string,
  primaryColor: string,
  amount = 10
): Promise<ImageData[]> {
  const apiURL = `https://media-fetch-hono.vercel.app/pexels?query=${query}&per_page=${amount}&orientation=${orientation}&color=${primaryColor}`;

  const response = await fetch(apiURL);

  if (!response.ok) throw new Error("Failed to fetch data from Unsplash");

  const data: ImageData[] = await response.json();

  console.log("pexels", data);

  return data;
}

//------------------------------------------------
// PIXABAY
//------------------------------------------------
async function searchPixabay(
  query: string,
  orientation: string,
  primaryColor: string,
  amount = 10
): Promise<ImageData[]> {
  const apiURL = `https://media-fetch-hono.vercel.app/pixabay?query=${query}&per_page=${amount}&orientation=${orientation}&color=${primaryColor}`;

  const response = await fetch(apiURL);

  if (!response.ok) throw new Error("Failed to fetch data from Unsplash");

  const data: ImageData[] = await response.json();

  console.log("pixabay", data);

  return data;
}

//------------------------------------------------
// ORCHESTRATING FUNCTIONS
//------------------------------------------------
function fetchImages(
  query: string,
  services: Array<ImageService>,
  orientation: string,
  primaryColor: string
) {
  const responses: Array<Promise<ImageData[]>> = [];
  const numImages = 30 / services.length;

  if (services.includes("unsplash"))
    responses.push(searchUnsplash(query, orientation, primaryColor, numImages));
  if (services.includes("pexels"))
    responses.push(searchPexels(query, orientation, primaryColor, numImages));
  if (services.includes("pixabay"))
    responses.push(searchPixabay(query, orientation, primaryColor, numImages));

  return responses;
}

export async function searchImages(
  query: string,
  services: Array<ImageService>,
  orientation: string,
  primaryColor: string
) {
  // get fetch response promises
  const fetchResponses = fetchImages(
    query,
    services,
    orientation,
    primaryColor
  );

  // run the image searches concurrently to prevent a waterfall
  const searchResults = await Promise.all(fetchResponses);

  // Combine results from all platforms into a single array
  return searchResults.reduce((acc, curr) => acc.concat(curr), []);
}
