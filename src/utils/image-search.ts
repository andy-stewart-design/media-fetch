import {
  PexelsAPIResponse,
  PixabayAPIResponse,
  UnsplashAPIRespones,
} from "../types/api-response";

export interface Image {
  thumbnailURL: string;
  highResURL: string;
  photographer: string;
  source: string;
}

export type ImageService = "unsplash" | "pexels" | "pixabay";

//------------------------------------------------
// API KEYS — NEED TO REMOVE
//------------------------------------------------
const PEXELS_API_KEY =
  "6g13kUgrPvTdfvJ0TfNQS2QXzVBLFqO0tu5gMQTCaIOQCGYWISSckCPs";
const PIXABAY_API_KEY = "35568846-b12b8564471b5e493ec192e02";
const UNSPLASH_API_KEY = "tAWVEwm8Gkhpp9r8wNTDyS_sgLptx6uEuqTm6_Hx6os";

//------------------------------------------------
// UNSPLASH
//------------------------------------------------
export async function searchUnsplash(
  query: string,
  amount = 10
): Promise<Image[]> {
  const apiKey = UNSPLASH_API_KEY;
  const apiUrl = `https://api.unsplash.com/search/photos?query=${query}&per_page=${amount}&client_id=${apiKey}`;

  // Make an API request using the API key and query
  const response = await fetch(apiUrl);

  if (!response.ok) throw new Error("Failed to fetch data from Unsplash");

  const data: UnsplashAPIRespones = await response.json();

  // Parse the response to extract necessary data
  const formattedData: Image[] = data.results.map((result) => ({
    thumbnailURL: result.urls.thumb,
    highResURL: result.urls.full,
    photographer: result.user.name,
    source: "Unsplash",
  }));

  // Return formatted data
  return formattedData;
}

//------------------------------------------------
// PEXELS
//------------------------------------------------
async function searchPexels(query: string, amount = 10) {
  const apiKey = PEXELS_API_KEY;
  const apiUrl = `https://api.pexels.com/v1/search?query=${query}&per_page=${amount}`;

  // Make an API request using the API key and query
  const response = await fetch(apiUrl, {
    headers: {
      Authorization: apiKey,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch data from Pexels");

  const data: PexelsAPIResponse = await response.json();

  // Parse the response to extract necessary data
  const formattedData = data.photos.map((photo) => ({
    thumbnailURL: photo.src.tiny,
    highResURL: photo.src.original,
    photographer: photo.photographer,
    source: "Pexels",
  }));

  // Return formatted data
  return formattedData;
}

//------------------------------------------------
// PIXABAY
//------------------------------------------------
async function searchPixabay(query: string, amount = 10) {
  const apiKey = PIXABAY_API_KEY;
  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${query}&per_page=${amount}`;

  const response = await fetch(apiUrl);

  if (!response.ok) throw new Error("Failed to fetch data from Pixabay");

  const data: PixabayAPIResponse = await response.json();

  // Extract necessary information from the response
  const formattedData = data.hits.map((hit) => ({
    thumbnailURL: hit.previewURL,
    highResURL: hit.largeImageURL,
    photographer: hit.user,
    source: "Pixabay",
  }));

  return formattedData;
}

//------------------------------------------------
// ORCHESTRATING FUNCTION
//------------------------------------------------
function fetchImages(query: string, services: Array<ImageService>) {
  const responses: Array<Promise<Image[]>> = [];
  const numImages = 30 / services.length;

  if (services.includes("unsplash"))
    responses.push(searchUnsplash(query, numImages));
  if (services.includes("pexels"))
    responses.push(searchPexels(query, numImages));
  if (services.includes("pixabay"))
    responses.push(searchPixabay(query, numImages));

  return responses;
}

export async function searchImages(
  query: string,
  services: Array<ImageService>
) {
  // get fetch response promises
  const fetchResponses = fetchImages(query, services);

  // run the image searches concurrently to prevent a waterfall
  const searchResults = await Promise.all(fetchResponses);

  // Combine results from all platforms into a single array
  return searchResults.reduce((acc, curr) => acc.concat(curr), []);
}
