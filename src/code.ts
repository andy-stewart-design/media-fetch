// TODO: Improve TS implementation
// TODO: Handle error/rejection

import { queryParamsSchema } from "./data/params";
import {
  PhotoService,
  SearchParams,
  SearchMessage,
  CreateMessage,
  LoadMoreMessage,
  PexelsResponse,
  PixabayResponse,
  UnsplashRespones,
  MediaEntry,
} from "./types/main";

let currentQuery: SearchMessage = undefined;
let currentPage = 1;

figma.showUI(__html__, { themeColors: true, width: 560, height: 560 });

const pexelsBaseURL = "https://api.pexels.com/v1/search";
const unsplashBaseURL = "https://api.unsplash.com/search/photos";
const pixabayBaseURL = "https://pixabay.com/api/";

figma.ui.onmessage = async (msg: SearchMessage | CreateMessage | LoadMoreMessage) => {
  if (msg.type === "SEARCH") {
    figma.ui.postMessage({ type: "STATUS", workInProgress: true });

    if (currentPage > 1) currentPage = 1;
    currentQuery = msg;

    const queryAmount = Math.floor(30 / msg.payload.services.length);
    const fetchParamsArray = msg.payload.services.map((service) =>
      createFetchParams(service, msg.payload.params, queryAmount, currentPage)
    );

    const results = await Promise.allSettled(fetchParamsArray.map((params) => fetchMedia(params)));

    const fulfilledResults = results.filter(isFulfilled).map((p) => p.value);
    const rejectedResults = results.filter(isRejected);

    if (fulfilledResults.length === 0) {
      console.error("No results found");
      return;
    }
    if (rejectedResults.length > 0) console.log("Rejected results: ", rejectedResults);

    const imageData: MediaEntry[][] = fulfilledResults.map((set) => {
      if (set.service === "PEXELS") {
        return set.photos.map((image: PexelsResponse) => {
          const orientation = image.width > image.height ? "landscape" : "portrait";
          return {
            service: set.service.toLocaleLowerCase(),
            creator: image.photographer,
            thumb: image.src.medium,
            src: image.src.large2x,
            width: image.width,
            height: image.height,
            orientation,
          };
        });
      } else if (set.service === "UNSPLASH") {
        return set.results.map((image: UnsplashRespones) => {
          const orientation = image.width > image.height ? "landscape" : "portrait";
          const src =
            orientation === "landscape"
              ? image.urls.regular.replace("w=1080", "w=1920")
              : image.urls.regular.replace("w=1080", "w=1280");
          return {
            service: set.service.toLocaleLowerCase(),
            creator: image.user.name,
            thumb: image.urls.small,
            src,
            width: image.width,
            height: image.height,
            orientation,
          };
        });
      } else if (set.service === "PIXABAY") {
        return set.hits.map((image: PixabayResponse) => {
          const orientation = image.imageWidth > image.imageHeight ? "landscape" : "portrait";
          const src = image.fullHDURL ? image.fullHDURL : image.largeImageURL;
          return {
            service: set.service.toLocaleLowerCase(),
            creator: image.user,
            thumb: image.webformatURL,
            src,
            width: image.imageWidth,
            height: image.imageHeight,
            orientation,
          };
        });
      }
    });

    console.log(currentQuery);
    figma.ui.postMessage({ type: "REPLACE", media: shuffle(imageData.flat()) });
    figma.ui.postMessage({ type: "STATUS", workInProgress: false });
  } else if (msg.type === "LOADMORE") {
    figma.ui.postMessage({ type: "STATUS", workInProgress: true });
    currentPage++;
    const queryAmount = Math.floor(30 / currentQuery.payload.services.length);
    const fetchParamsArray = currentQuery.payload.services.map((service) =>
      createFetchParams(service, currentQuery.payload.params, queryAmount, currentPage)
    );

    const results = await Promise.allSettled(fetchParamsArray.map((params) => fetchMedia(params)));

    const fulfilledResults = results.filter(isFulfilled).map((p) => p.value);
    const rejectedResults = results.filter(isRejected);

    if (fulfilledResults.length === 0) {
      console.error("No results found");
      return;
    }
    if (rejectedResults.length > 0) console.log("Rejected results: ", rejectedResults);

    const imageData: MediaEntry[][] = fulfilledResults.map((set) => {
      if (set.service === "PEXELS") {
        return set.photos.map((image: PexelsResponse) => {
          const orientation = image.width > image.height ? "landscape" : "portrait";
          return {
            service: set.service.toLocaleLowerCase(),
            creator: image.photographer,
            thumb: image.src.medium,
            src: image.src.large2x,
            width: image.width,
            height: image.height,
            orientation,
          };
        });
      } else if (set.service === "UNSPLASH") {
        return set.results.map((image: UnsplashRespones) => {
          const orientation = image.width > image.height ? "landscape" : "portrait";
          const src =
            orientation === "landscape"
              ? image.urls.regular.replace("w=1080", "w=1920")
              : image.urls.regular.replace("w=1080", "w=1280");
          return {
            service: set.service.toLocaleLowerCase(),
            creator: image.user.name,
            thumb: image.urls.small,
            src,
            width: image.width,
            height: image.height,
            orientation,
          };
        });
      } else if (set.service === "PIXABAY") {
        return set.hits.map((image: PixabayResponse) => {
          const orientation = image.imageWidth > image.imageHeight ? "landscape" : "portrait";
          const src = image.fullHDURL ? image.fullHDURL : image.largeImageURL;
          return {
            service: set.service.toLocaleLowerCase(),
            creator: image.user,
            thumb: image.webformatURL,
            src,
            width: image.imageWidth,
            height: image.imageHeight,
            orientation,
          };
        });
      }
    });

    figma.ui.postMessage({ type: "PUSH", media: shuffle(imageData.flat()) });
    figma.ui.postMessage({ type: "STATUS", workInProgress: false });
  } else if (msg.type === "CREATE") {
    figma.ui.postMessage({ type: "STATUS", workInProgress: true });
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
    figma.ui.postMessage({ type: "STATUS", workInProgress: false });
    // figma.closePlugin();
  }
};

const createFetchParams = (service: PhotoService, params: SearchParams, amount = 20, page = 1) => {
  let url: string;
  const { orientation, color } = params;
  const pageQuery = `&page=${page}`;
  const amountQuery = `&per_page=${amount}`;

  if (service === "PEXELS") {
    const searchQuery = `?query=${params.query}`;
    const selectedOrientation: string | undefined = queryParamsSchema[service]["ORIENTATION"][orientation];
    const orientationQuery = selectedOrientation ? `&orientation=${selectedOrientation}` : null;
    const selectedColor: string | undefined = queryParamsSchema[service]["COLOR"][color];
    const colorQuery = selectedColor ? `&avg_color=${selectedColor}` : null;
    const urlArray = [pexelsBaseURL, searchQuery, pageQuery, amountQuery, orientationQuery, colorQuery];
    url = urlArray.join("");
  } else if (service === "UNSPLASH") {
    const apiKeyQuery = `?client_id=${process.env.UNSPLASH_API_KEY}`;
    const searchQuery = `&query=${params.query}`;
    const selectedOrientation: string | undefined = queryParamsSchema[service]["ORIENTATION"][orientation];
    const orientationQuery = selectedOrientation ? `&orientation=${selectedOrientation}` : null;
    const selectedColor: string | undefined = queryParamsSchema[service]["COLOR"][color];
    const colorQuery = selectedColor ? `&color=${selectedColor}` : null;

    const urlArray = [unsplashBaseURL, apiKeyQuery, searchQuery, pageQuery, amountQuery, orientationQuery, colorQuery];
    url = urlArray.join("");
  } else if (service === "PIXABAY") {
    const apiKeyQuery = `?key=${process.env.PIXABAY_API_KEY}`;
    const searchQuery = `&q=${params.query}`;
    const selectedOrientation: string | undefined = queryParamsSchema[service]["ORIENTATION"][orientation];
    const orientationQuery = selectedOrientation ? `&orientation=${selectedOrientation}` : null;
    const selectedColor: string | undefined = queryParamsSchema[service]["COLOR"][color];
    const colorQuery = selectedColor ? `&colors=${selectedColor}` : null;

    const urlArray = [pixabayBaseURL, apiKeyQuery, searchQuery, pageQuery, amountQuery, orientationQuery, colorQuery];
    url = urlArray.join("");
  } else {
    console.error("Invalid service specified");
  }

  console.log(service, url);
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

const isFulfilled = <T>(p: PromiseSettledResult<T>): p is PromiseFulfilledResult<T> => p.status === "fulfilled";
const isRejected = <T>(p: PromiseSettledResult<T>): p is PromiseRejectedResult => p.status === "rejected";
