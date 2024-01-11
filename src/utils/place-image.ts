// import { handleError } from './handle-error';

export async function placeImage(
  src: string,
  width: number,
  height: number,
  quality: number,
  exportSize: number
) {
  let resizedWidth = exportSize;
  let resizedHeight = height * (exportSize / width);

  console.log({ resizedWidth, resizedHeight });

  if (resizedHeight > exportSize) {
    resizedHeight = exportSize;
    resizedWidth = width * (resizedHeight / height);
  }

  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      src,
      width: Math.floor(resizedWidth),
      height: Math.floor(resizedHeight),
      quality,
    }),
  };

  const post = await fetch(`https://media-fetch-hono.vercel.app/generate`, options);
  const { data } = await post.json();

  // const res = await fetch(
  //   `https://media-fetch-hono.vercel.app/generate?src=${src}&w=${resizedWidth}&h=${resizedHeight}&q=${quality}`
  // );

  if (typeof data !== 'string')
    throw new Error(
      `There was an error with the return value of the generate api. Expected a string but got a ${typeof data}.`
    );

  const imgData = figma.createImage(figma.base64Decode(data));

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
}
