import {
  PexelsAPIResponse,
  PixabayAPIResponse,
  UnsplashAPIRespones,
} from "../types/api-response";

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
  orientation: string,
  primaryColor: string,
  amount = 10
): Promise<ImageData[]> {
  const baseURL = "https://api.unsplash.com/search/photos";
  const queryParam = `?query=${query}`;
  const amountParam = `&per_page=${amount}`;
  const orientationParam = getUnsplashOrientationFilter(orientation);
  const colorParam = getUnsplashColorFilter(primaryColor);
  const apiKeyParam = `&client_id=${UNSPLASH_API_KEY}`;

  const apiUrl = [
    baseURL,
    queryParam,
    amountParam,
    orientationParam,
    colorParam,
    apiKeyParam,
  ].join("");

  // Make an API request using the API key and query
  const response = await fetch(apiUrl);

  if (!response.ok) throw new Error("Failed to fetch data from Unsplash");

  const data: UnsplashAPIRespones = await response.json();

  // Parse the response to extract necessary data
  const formattedData: ImageData[] = data.results.map((result) => ({
    id: String(Math.random()),
    width: result.width,
    height: result.height,
    image_thumbnail: result.urls.thumb,
    image_large: result.urls.full,
    image_link: result.links.html,
    photographer: result.user.name,
    photographer_link: result.user.links.html,
    source: "Unsplash",
  }));

  // Return formatted data
  return formattedData;
}

function getUnsplashOrientationFilter(value: string) {
  const param = "&orientation=";
  if (value === "all") return undefined;
  else if (value === "square") return `${param}squarish`;
  else return `${param}${value}`;
}

function getUnsplashColorFilter(value: string) {
  const param = "&color=";
  if (value === "any") return undefined;
  else if (value === "grayscale") return `${param}black_and_white`;
  else if (value === "pink") return `${param}magenta`;
  else return `${param}${value}`;
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
  const baseURL = "https://api.pexels.com/v1/search";
  const queryParam = `?query=${query}`;
  const amountParam = `&per_page=${amount}`;
  const orientationParam = getPexelsOrientationFilter(orientation);
  const colorParam = getPexelsColorFilter(primaryColor);

  const apiKey = PEXELS_API_KEY;
  const apiUrl = [
    baseURL,
    queryParam,
    amountParam,
    orientationParam,
    colorParam,
  ].join("");

  // Make an API request using the API key and query
  const response = await fetch(apiUrl, {
    headers: {
      Authorization: apiKey,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch data from Pexels");

  const data: PexelsAPIResponse = await response.json();

  // Parse the response to extract necessary data
  const formattedData: ImageData[] = data.photos.map((photo) => ({
    id: String(Math.random()),
    width: photo.width,
    height: photo.height,
    image_thumbnail: photo.src.tiny,
    image_large: photo.src.original,
    image_link: photo.url,
    photographer: photo.photographer,
    photographer_link: photo.photographer_url,
    source: "Pexels",
  }));

  // Return formatted data
  return formattedData;
}

function getPexelsOrientationFilter(value: string) {
  const param = "&orientation=";
  if (value === "all") return undefined;
  else return `${param}${value}`;
}

function getPexelsColorFilter(value: string) {
  const param = "&color=";
  if (value === "any") return undefined;
  else if (value === "grayscale") return `${param}gray`;
  else if (value === "teal") return `${param}turquoise`;
  else if (value === "purple") return `${param}#800080`;
  else return `${param}${value}`;
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
  const baseURL = "https://pixabay.com/api/";
  const apiKeyParam = `?key=${PIXABAY_API_KEY}`;
  const queryParam = `&q=${query}`;
  const amountParam = `&per_page=${amount}`;
  const orientationParam = getPixabayOrientationFilter(orientation);
  const colorParam = getPixabayColorFilter(primaryColor);

  const apiUrl = [
    baseURL,
    apiKeyParam,
    queryParam,
    amountParam,
    orientationParam,
    colorParam,
  ].join("");

  console.log(apiUrl);

  const response = await fetch(apiUrl);

  if (!response.ok) throw new Error("Failed to fetch data from Pixabay");

  const data: PixabayAPIResponse = await response.json();

  // Extract necessary information from the response
  const formattedData: ImageData[] = data.hits.map((hit) => ({
    id: String(Math.random()),
    image_thumbnail: hit.previewURL,
    width: hit.imageWidth,
    height: hit.imageHeight,
    image_large: hit.largeImageURL,
    image_link: hit.pageURL,
    photographer: hit.user,
    photographer_link: `https://pixabay.com/users/${hit.user}-${hit.user_id}`,
    source: "Pixabay",
  }));

  return formattedData;
}

function getPixabayOrientationFilter(value: string) {
  const param = "&orientation=";
  if (value === "all" || value === "square") return undefined;
  else if (value === "landscape") return `${param}horizontal`;
  else if (value === "portrait") return `${param}vertical`;
}

function getPixabayColorFilter(value: string) {
  const param = "&colors=";
  if (value === "any") return undefined;
  else if (value === "teal") return `${param}turquoise`;
  else if (value === "purple") return `${param}lilac`;
  else return `${param}${value}`;
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
