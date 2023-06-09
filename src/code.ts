// TODO: Improve TS implementation
// TODO: Improve error/rejection handling

import { queryParamsSchema } from "./data/params";
import { PhotoService, SearchParams, SearchMessage, CreateMessage, GenericMessage, MediaEntry } from "./types/main";
import { PexelsResponse, PixabayResponse, UnsplashRespones } from "./types/apiResponse";

let currentQuery: SearchMessage = undefined;
let currentPage = 1;

figma.showUI(__html__, { themeColors: true, width: 560, height: 640 });

const pexelsBaseURL = "https://api.pexels.com/v1/search";
const unsplashBaseURL = "https://api.unsplash.com/search/photos";
const pixabayBaseURL = "https://pixabay.com/api/";

figma.ui.onmessage = async (msg: SearchMessage | CreateMessage | GenericMessage) => {
  figma.ui.postMessage({ type: "STATUS", workInProgress: true });
  // ----------------------------------------------------
  // Initial query submission
  // ----------------------------------------------------
  if (msg.type === "SEARCH") {
    if (currentPage > 1) currentPage = 1;
    currentQuery = msg;

    const queryAmount = Math.floor(30 / msg.payload.services.length);
    const fetchParamsArray = msg.payload.services.map((service) =>
      createFetchParams(service, msg.payload.params, queryAmount, currentPage)
    );

    const results = await Promise.allSettled(fetchParamsArray.map((params) => fetchMedia(params)));

    const { fulfilled, rejected } = filterResults(results);

    if (fulfilled.length === 0) {
      console.error("No results found");
      return;
    }
    if (rejected.length > 0) console.log("Rejected results: ", rejected);

    const imageData = normalizeResults(fulfilled);

    figma.ui.postMessage({ type: "REPLACE", media: shuffle(imageData) });
    figma.ui.postMessage({ type: "STATUS", workInProgress: false });
    // ----------------------------------------------------
    // Load additional images based on previous query
    // ----------------------------------------------------
  } else if (msg.type === "LOADMORE") {
    currentPage++;

    const queryAmount = Math.floor(30 / currentQuery.payload.services.length);
    const fetchParamsArray = currentQuery.payload.services.map((service) =>
      createFetchParams(service, currentQuery.payload.params, queryAmount, currentPage)
    );

    const results = await Promise.allSettled(fetchParamsArray.map((params) => fetchMedia(params)));

    const { fulfilled, rejected } = filterResults(results);

    if (fulfilled.length === 0) {
      console.error("No results found");
      return;
    }
    if (rejected.length > 0) console.log("Rejected results: ", rejected);

    const imageData = normalizeResults(fulfilled);

    figma.ui.postMessage({ type: "PUSH", media: shuffle(imageData) });
    figma.ui.postMessage({ type: "STATUS", workInProgress: false });
    // ----------------------------------------------------
    // Fetch and insert a random image into the document
    // ----------------------------------------------------
  } else if (msg.type === "RANDOM") {
    const fetchParam = `https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_API_KEY}`;

    // const results = await Promise.allSettled([fetchParam]);
    const results = await Promise.allSettled([fetchMedia({ service: "UNSPLASH", url: fetchParam })]);

    const { fulfilled, rejected } = filterResults(results);

    if (fulfilled.length === 0) {
      console.error("No results found");
      return;
    }
    if (rejected.length > 0) console.log("Rejected results: ", rejected);

    let { width, height } = fulfilled[0];
    const size = width > height ? 1920 : 1280;
    height = height * (size / width);

    const src = fulfilled[0].urls.regular.replace(/w=([^"]*)/, `w=${size}`);

    const imgData = await figma.createImageAsync(src);

    const { x, y } = figma.viewport.center;

    const rect = figma.createRectangle();
    rect.resize(size, height);
    rect.x = x - size / 2;
    rect.y = y - height / 2;

    rect.fills = [
      {
        type: "IMAGE",
        imageHash: imgData.hash,
        scaleMode: "FILL",
      },
    ];
    figma.closePlugin();
  }
  // ----------------------------------------------------
  // Insert selected image into the document
  // ----------------------------------------------------
  else if (msg.type === "CREATE") {
    const imgData = await figma.createImageAsync(msg.payload.src);

    const { x, y } = figma.viewport.center;

    const rect = figma.createRectangle();
    rect.resize(msg.payload.width, msg.payload.height);
    rect.x = x - msg.payload.width / 2;
    rect.y = y - msg.payload.height / 2;

    rect.fills = [
      {
        type: "IMAGE",
        imageHash: imgData.hash,
        scaleMode: "FILL",
      },
    ];
    figma.closePlugin();
  }
};

// ----------------------------------------------------
// Helper functions
// ----------------------------------------------------

const createFetchParams = (service: PhotoService, params: SearchParams, amount = 20, page = 1) => {
  let url: string;
  const { orientation, color } = params;
  const pageQuery = `&page=${page}`;
  const amountQuery = `&per_page=${amount}`;

  if (service === "PEXELS") {
    const searchQuery = `?query=${params.query}`;
    const selectedOrientation = queryParamsSchema[service]["ORIENTATION"][orientation];
    const orientationQuery = selectedOrientation ? `&orientation=${selectedOrientation}` : null;
    const selectedColor = queryParamsSchema[service]["COLOR"][color];
    const colorQuery = selectedColor ? `&avg_color=${selectedColor}` : null;
    const urlArray = [pexelsBaseURL, searchQuery, pageQuery, amountQuery, orientationQuery, colorQuery];
    url = urlArray.join("");
  } else if (service === "UNSPLASH") {
    const apiKeyQuery = `?client_id=${process.env.UNSPLASH_API_KEY}`;
    const searchQuery = `&query=${params.query}`;
    const selectedOrientation = queryParamsSchema[service]["ORIENTATION"][orientation];
    const orientationQuery = selectedOrientation ? `&orientation=${selectedOrientation}` : null;
    const selectedColor = queryParamsSchema[service]["COLOR"][color];
    const colorQuery = selectedColor ? `&color=${selectedColor}` : null;

    const urlArray = [unsplashBaseURL, apiKeyQuery, searchQuery, pageQuery, amountQuery, orientationQuery, colorQuery];
    url = urlArray.join("");
  } else if (service === "PIXABAY") {
    const apiKeyQuery = `?key=${process.env.PIXABAY_API_KEY}`;
    const searchQuery = `&q=${params.query}`;
    const selectedOrientation = queryParamsSchema[service]["ORIENTATION"][orientation];
    const orientationQuery = selectedOrientation ? `&orientation=${selectedOrientation}` : null;
    const selectedColor = queryParamsSchema[service]["COLOR"][color];
    const colorQuery = selectedColor ? `&colors=${selectedColor}` : null;

    const urlArray = [pixabayBaseURL, apiKeyQuery, searchQuery, pageQuery, amountQuery, orientationQuery, colorQuery];
    url = urlArray.join("");
  } else {
    console.error("Invalid service specified");
  }

  return { service, url };
};

const fetchMedia = async ({ service, url }: { service: PhotoService; url: string }) => {
  const target = { service };
  switch (service) {
    case "PEXELS":
      const pexelsResults = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: process.env.PEXELS_API_KEY,
        },
      });
      const pexelsJSON = await pexelsResults.json();
      console.log(pexelsJSON);
      return Object.assign(target, pexelsJSON);
    case "UNSPLASH":
      const unsplashResults = await fetch(url);
      const unsplashJSON = await unsplashResults.json();
      return Object.assign(target, unsplashJSON);
    case "PIXABAY":
      const pixabayResults = await fetch(url);
      const pixabayJSON = await pixabayResults.json();
      return Object.assign(target, pixabayJSON);
    default:
      console.error("Invalid service specified");
  }
};

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

const filterResults = (results: PromiseSettledResult<any>[]) => {
  const isFulfilled = <T>(p: PromiseSettledResult<T>): p is PromiseFulfilledResult<T> => p.status === "fulfilled";
  const isRejected = <T>(p: PromiseSettledResult<T>): p is PromiseRejectedResult => p.status === "rejected";

  const fulfilledResults = results.filter(isFulfilled).map((p) => p.value);
  const rejectedResults = results.filter(isRejected);

  return { fulfilled: fulfilledResults, rejected: rejectedResults };
};

const normalizeResults = (data: any[]) => {
  const imageData: MediaEntry[][] = data.map((set) => {
    if (set.service === "PEXELS") {
      return set.photos.map((image: PexelsResponse) => {
        let { width, height } = image;
        const trueWidth = width > height ? 1920 : 1280;
        const trueHeight = height * (trueWidth / width);
        const orientation = width > height ? "landscape" : "portrait";
        const src = image.src.large2x.replace(/w=([^"]*)/, `w=${trueWidth}`).replace(/h=([^"]*)/, `w=${trueHeight}`);
        return {
          service: set.service.toLocaleLowerCase(),
          creator: image.photographer,
          thumb: image.src.medium,
          src,
          width: trueWidth,
          height: trueHeight,
          orientation,
        };
      });
    } else if (set.service === "UNSPLASH") {
      return set.results.map((image: UnsplashRespones) => {
        let { width, height } = image;
        const trueWidth = width > height ? 1920 : 1280;
        const orientation = width > height ? "landscape" : "portrait";
        const src = image.urls.regular.replace(/w=([^"]*)/, `w=${trueWidth}`);
        return {
          service: set.service.toLocaleLowerCase(),
          creator: image.user.name,
          thumb: image.urls.small,
          src,
          width: trueWidth,
          height: height * (trueWidth / width),
          orientation,
        };
      });
    } else if (set.service === "PIXABAY") {
      return set.hits.map((image: PixabayResponse) => {
        const { imageWidth, imageHeight } = image;
        const width = 1280;
        const orientation = imageWidth > imageHeight ? "landscape" : "portrait";
        const src = image.fullHDURL ? image.fullHDURL : image.largeImageURL;
        return {
          service: set.service.toLocaleLowerCase(),
          creator: image.user,
          thumb: image.webformatURL,
          src,
          width,
          height: imageHeight * (width / imageWidth),
          orientation,
        };
      });
    }
  });

  return imageData.flat();
};
