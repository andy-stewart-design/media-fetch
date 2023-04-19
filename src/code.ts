// TODO: Integrate Unsplash + Pixabay
// TODO: Handle error/rejection
// TODO: Enable video search

type PhotoSource = "UNSPLASH" | "PEXELS" | "PIXABAY";

type MediaType = "IMAGE" | "VIDEO";

interface SearchMessage {
  messageType: "SEARCH";
  mediaType: MediaType;
  query: string;
}

interface CreateMessage {
  messageType: "CREATE";
  mediaType: MediaType;
  src: string;
  width: number;
  height: number;
}

figma.showUI(__html__, { themeColors: true, width: 480, height: 560 });

const pexelsAPIKey = "6g13kUgrPvTdfvJ0TfNQS2QXzVBLFqO0tu5gMQTCaIOQCGYWISSckCPs";
const pexelsBaseImageURL = "https://api.pexels.com/v1/search";
const pexelsBaseVideoURL = "https://api.pexels.com/videos/search";
const unsplashAPIKey = "tAWVEwm8Gkhpp9r8wNTDyS_sgLptx6uEuqTm6_Hx6os";
const unsplashBaseURL = "https://api.unsplash.com/search/photos";
const pixabayAPIKey = "35568846-b12b8564471b5e493ec192e02";
const pixabayBaseImageURL = "https://pixabay.com/api/";
const pixabayBaseVideoURL = "https://pixabay.com/api/videos/";

figma.ui.onmessage = async (msg: SearchMessage | CreateMessage) => {
  if (msg.messageType === "SEARCH") {
    if (msg.mediaType === "VIDEO") {
      console.log("Searching for video");

      const fetchParams = createFetchParams("PIXABAY", msg.mediaType, msg.query, 10);

      const videoDataRaw = await fetchMedia(fetchParams);

      console.log(videoDataRaw);

      const videoData = videoDataRaw.hits.map((video, index) => {
        const orientation = video.videos.large.width > video.videos.large.height ? "landscape" : "portrait";
        // const getVideoSrc = (files: any[], size: string) => {
        //   let targetWidth = undefined;
        //   if (size === "MAX") {
        //     targetWidth = Math.max.apply(
        //       Math,
        //       video.video_files.map((file) => (file.width < 2000 ? file.width : 0))
        //     );
        //   } else if (size === "MIN") {
        //     targetWidth = Math.min.apply(
        //       Math,
        //       video.video_files.map((file) => file.width)
        //     );
        //   }

        //   return files.filter((file) => file.width === targetWidth)[0];
        // };

        // const videoSrc = getVideoSrc(video.video_files, "MAX");
        // const videoThumb = getVideoSrc(video.video_files, "MIN");

        return {
          service: videoDataRaw.service.toLocaleLowerCase(),
          id: video.id,
          creator: video.user,
          // thumb: video.image,
          videoThumb: video.videos.small.url,
          src: video.videos.large.url,
          width: video.videos.large.width || undefined,
          height: video.videos.large.height || undefined,
          orientation,
        };
      });

      console.log(videoData);

      figma.ui.postMessage({ mediaType: msg.mediaType, media: shuffle(videoData.flat()) });
    } else if (msg.mediaType === "IMAGE") {
      const fetchParams1 = createFetchParams("UNSPLASH", msg.mediaType, msg.query, 25);
      const fetchParams2 = createFetchParams("PEXELS", msg.mediaType, msg.query, 25);

      const imageDataRaw = await Promise.allSettled([fetchMedia(fetchParams1), fetchMedia(fetchParams2)]);
      const imageData = imageDataRaw.map((result) => {
        if (result.status === "fulfilled") {
          const set = result.value;
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
                photographer: image.user.name,
                thumb: image.urls.small,
                src,
                width: image.width,
                height: image.height,
                orientation,
              };
            });
          }
        }
      });
      // console.log(imageData);

      figma.ui.postMessage({ mediaType: msg.mediaType, media: shuffle(imageData.flat()) });
    }
  } else if (msg.messageType === "CREATE") {
    if (msg.mediaType === "VIDEO") {
      figma.ui.postMessage({ messageType: "status", workInProgress: true });
      console.log("creating video", msg);
      const response = await fetch(msg.src);
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      const videobuffer = await response.arrayBuffer();
      const videoUint8Array = new Uint8Array(videobuffer);

      const videoData = await figma.createVideoAsync(videoUint8Array);

      const { x, y } = figma.viewport.center;

      const rect = figma.createRectangle();
      rect.resize(msg.width, msg.height);
      rect.x = x - msg.width / 2;
      rect.y = y - msg.height / 2;

      rect.fills = [
        {
          type: "VIDEO",
          videoHash: videoData.hash,
          scaleMode: "FILL",
        },
      ];
      figma.ui.postMessage({ messageType: "status", workInProgress: false });
      // figma.closePlugin();
    } else if (msg.mediaType === "IMAGE") {
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

      // figma.closePlugin();
    }
  }
};

const createFetchParams = (service: PhotoSource, mediaType: MediaType, query: string, amount = 20) => {
  let url: string;

  if (service === "PEXELS") {
    if (mediaType === "IMAGE") {
      url = `${pexelsBaseImageURL}?query=${query}&per_page=${amount}`;
    } else if (mediaType === "VIDEO") {
      url = `${pexelsBaseVideoURL}?query=${query}&per_page=${amount}`;
    }
  } else if (service === "UNSPLASH") {
    url = `${unsplashBaseURL}?client_id=${unsplashAPIKey}&query=${query}&per_page=${amount}`;
  } else if (service === "PIXABAY") {
    if (mediaType === "IMAGE") {
      url = `${pixabayBaseImageURL}?key=${pixabayAPIKey}&q=${query}&per_page=${amount}`;
    } else if (mediaType === "VIDEO") {
      url = `${pixabayBaseVideoURL}?key=${pixabayAPIKey}&q=${query}&per_page=${amount}`;
    }
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
          Authorization: pexelsAPIKey,
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
