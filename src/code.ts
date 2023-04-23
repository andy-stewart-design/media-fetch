// TODO: Handle error/rejection
// TODO: No implicit any

import { PhotoSource, MediaType, SearchMessage, CreateMessage } from "./types/app";

figma.showUI(__html__, { themeColors: true, width: 560, height: 560 });

const pexelsBaseURL = "https://api.pexels.com/v1/search";
const unsplashBaseURL = "https://api.unsplash.com/search/photos";
const pixabayBaseURL = "https://pixabay.com/api/";

figma.ui.onmessage = async (msg: SearchMessage | CreateMessage) => {
  if (msg.messageType === "SEARCH") {
    const fetchParamsArray = msg.services.map((service) => createFetchParams(service, msg.query, 12));
    const results = await Promise.allSettled(fetchParamsArray.map((params) => fetchMedia(params)));

    const fulfilledResults = results.filter(isFulfilled).map((p) => p.value);
    const rejectedResults = results.filter(isRejected);

    if (fulfilledResults.length === 0) {
      console.error("No results found");
      return;
    }
    if (rejectedResults.length > 0) console.log("Rejected results: ", rejectedResults);

    const imageData = fulfilledResults.map((set) => {
      if (set.service === "PEXELS") {
        return set.photos.map((image) => {
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
        return set.results.map((image) => {
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
        return set.hits.map((image) => {
          const orientation = image.width > image.height ? "landscape" : "portrait";
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

    figma.ui.postMessage({ media: shuffle(imageData.flat()) });
  } else if (msg.messageType === "CREATE") {
    figma.ui.postMessage({ messageType: "STATUS", workInProgress: true });
    const imgData = await figma.createImageAsync(msg.src);

    const { x, y } = figma.viewport.center;

    const rect = figma.createRectangle();
    rect.resize(msg.width, msg.height);
    rect.x = x - msg.width / 2;
    rect.y = y - msg.height / 2;

    rect.fills = [
      {
        type: "IMAGE",
        imageHash: imgData.hash,
        scaleMode: "FILL",
      },
    ];
    figma.ui.postMessage({ messageType: "STATUS", workInProgress: false });
    // figma.closePlugin();
  }
};

const createFetchParams = (service: PhotoSource, query: string, amount = 20) => {
  let url: string;

  if (service === "PEXELS") {
    url = `${pexelsBaseURL}?query=${query}&per_page=${amount}`;
  } else if (service === "UNSPLASH") {
    url = `${unsplashBaseURL}?client_id=${process.env.UNSPLASH_API_KEY}&query=${query}&per_page=${amount}`;
  } else if (service === "PIXABAY") {
    url = `${pixabayBaseURL}?key=${process.env.PIXABAY_API_KEY}&q=${query}&per_page=${amount}`;
  } else {
    console.error("Invalid service specified");
  }

  return { service, url };
};

const fetchMedia = async ({ service, url }: { service: PhotoSource; url: string }) => {
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
