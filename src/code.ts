// TODO: Integrate Unsplash + Pixabay
// TODO: Handle error/rejection
// TODO: Enable video search

type PhotoSource = "UNSPLASH" | "PEXELS" | "PIXABAY";

interface SearchMessage {
  type: "SEARCH";
  query: string;
}

interface CreateMessage {
  type: "CREATE";
  src: string;
}

figma.showUI(__html__, { themeColors: true, width: 480, height: 560 });

const pexelsBaseURL = "https://api.pexels.com/v1/search";
const pexelsAPIKey = "6g13kUgrPvTdfvJ0TfNQS2QXzVBLFqO0tu5gMQTCaIOQCGYWISSckCPs";
const unsplashBaseURL = "https://api.unsplash.com/search/photos";
const unsplashAPIKey = "tAWVEwm8Gkhpp9r8wNTDyS_sgLptx6uEuqTm6_Hx6os";

figma.ui.onmessage = async (msg: SearchMessage | CreateMessage) => {
  if (msg.type === "SEARCH") {
    const fetchParams1 = createFetchParams("UNSPLASH", msg.query, 25);
    const fetchParams2 = createFetchParams("PEXELS", msg.query, 25);

    const foo = await Promise.allSettled([fetchPhotos(fetchParams1), fetchPhotos(fetchParams2)]);
    const bar = foo.map((result) => {
      if (result.status === "fulfilled") {
        const set = result.value;
        if (set.service === "PEXELS") {
          return set.photos.map((image) => {
            const orientation = image.width > image.height ? "landscape" : "portrait";
            return {
              service: set.service.toLocaleLowerCase(),
              photographer: image.photographer,
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
    console.log(bar);

    figma.ui.postMessage({ images: shuffle(bar.flat()) });
  } else if (msg.type === "CREATE") {
    const imgData = await figma.createImageAsync(msg.src);
    const { width, height } = await imgData.getSizeAsync();

    const { x, y } = figma.viewport.center;

    const rect = figma.createRectangle();
    rect.resize(width, height);
    rect.x = x - width / 2;
    rect.y = y - height / 2;

    rect.fills = [
      {
        type: "IMAGE",
        imageHash: imgData.hash,
        scaleMode: "FILL",
      },
    ];

    // figma.closePlugin();
  }
};

const createFetchParams = (service: PhotoSource, query: string, amount: number) => {
  let url: string;
  switch (service) {
    case "PEXELS":
      url = `${pexelsBaseURL}?query=${query}&per_page=${amount}`;
      break;
    case "UNSPLASH":
      url = `${unsplashBaseURL}?client_id=${unsplashAPIKey}&query=${query}&per_page=${amount}`;
      break;
    case "PIXABAY":
      console.log("Still need to set up pixabay");
      break;
    default:
      console.error("Invalid service specified");
  }
  return { service, url };
};

const fetchPhotos = async ({ service, url }: { service: PhotoSource; url: string }) => {
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
      console.log("Still need to set up pixabay");
      break;
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
