import { handleError } from './handle-error';

export async function placeImage(
  src: string,
  width: number,
  height: number,
  quality: number,
  exportSize: number
) {
  let resizedWidth = exportSize;
  let resizedHeight = height * (exportSize / width);

  if (resizedHeight > exportSize) {
    resizedHeight = exportSize;
    resizedWidth = width * (resizedHeight / height);
  }

  try {
    const res = await fetch(
      `https://media-fetch-hono.vercel.app/generate?src=${src}&w=${resizedWidth}&h=${resizedHeight}&q=${quality}`
    );

    if (!res.ok) throw new Error('There was an error fetching this image');

    const data = await res.json();
    const imgArray = figma.base64Decode(data);
    const imgData = figma.createImage(imgArray);
    console.log(imgData);

    if (!imgData) throw new Error(`There was an error thrown by figma's createImage function.`);

    const { x, y } = figma.viewport.center;

    const rect = figma.createRectangle();
    rect.resize(resizedWidth, resizedHeight);
    rect.x = x - resizedWidth / 2;
    rect.y = y - resizedHeight / 2;

    rect.fills = [
      {
        type: 'IMAGE',
        imageHash: imgData.hash,
        scaleMode: 'FILL',
      },
    ];

    return { ok: true };
  } catch (error) {
    handleError(error);
    return { ok: false };
  }
}
