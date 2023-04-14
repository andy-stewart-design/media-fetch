// TODO: Handle error/rejection
// TODO: Enable video search
// TODO: Integrate Unsplash + Pixabay

type PhotoSource = "UNSPLASH" | "PEXELS"

interface SearchMessage {
  type: "SEARCH"
  query: string
}

interface CreateMessage {
  type: "CREATE"
  src: string
}

figma.showUI(__html__, { themeColors: true, width: 480, height: 560 })

const pexelsBaseURL = "https://api.pexels.com/v1/search"
const pexelsAPIKey = "6g13kUgrPvTdfvJ0TfNQS2QXzVBLFqO0tu5gMQTCaIOQCGYWISSckCPs"
const unsplashBaseURL = "https://api.unsplash.com/photos/random?client_id="
const unsplashAPIKey = "tAWVEwm8Gkhpp9r8wNTDyS_sgLptx6uEuqTm6_Hx6os"

figma.ui.onmessage = async (msg: SearchMessage | CreateMessage) => {
  if (msg.type === "SEARCH") {
    // const res = await fetch(`https://api.pexels.com/v1/search?query=${msg.query}&per_page=50`, {
    //   method: "GET",
    //   headers: {
    //     Accept: "application/json",
    //     Authorization: pexelsAPIKey,
    //   },
    // })
    // const json = await res.json()
    const url1 = createFetchURL("PEXELS", msg.query, 25)
    const url2 = createFetchURL("PEXELS", "seattle", 25)

    const foo = await Promise.allSettled([getPhotos(url1), getPhotos(url2)])
    const bar = foo.map((set) => {
      if (set.status === "fulfilled") return set.value
    })
    const images = bar.flat().map((image) => {
      return {
        photographer: image.photographer,
        thumb: image.src.medium,
        src: image.src.large2x,
        width: image.width,
        height: image.height,
      }
    })

    // const rawImageData = await getPhotos(msg.query)
    // const images = rawImageData.map((image) => {
    //   return {
    //     photographer: image.photographer,
    //     thumb: image.src.medium,
    //     src: image.src.large2x,
    //     width: image.width,
    //     height: image.height,
    //   }
    // })
    figma.ui.postMessage({ images: shuffle(images) })
  } else if (msg.type === "CREATE") {
    const imgData = await figma.createImageAsync(msg.src)
    const { width, height } = await imgData.getSizeAsync()

    const { x, y } = figma.viewport.center

    const rect = figma.createRectangle()
    rect.resize(width, height)
    rect.x = x - width / 2
    rect.y = y - height / 2

    rect.fills = [
      {
        type: "IMAGE",
        imageHash: imgData.hash,
        scaleMode: "FILL",
      },
    ]

    figma.closePlugin()
  }
}

const getPhotos = async (url: string) => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: pexelsAPIKey,
    },
  })
  const json = await res.json()
  return json.photos
}

const createFetchURL = (source: PhotoSource, query: string, amount: number) => {
  if (source === "PEXELS") {
    return `${pexelsBaseURL}?query=${query}&per_page=${amount}`
  }
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
  return arr
}
