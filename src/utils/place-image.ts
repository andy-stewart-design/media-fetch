import { handleError } from "./handle-error";

const IMAGE_KIT_SECRET_KEY = "oxo8xdmts";

export async function placeImage(src: string, width: number, height: number) {
  let resizedWidth = width > height ? 2400 : 1600;
  let resizedHeight = height * (resizedWidth / width);

  if (resizedHeight > 2400) {
    resizedHeight = 2400;
    resizedWidth = width * (resizedHeight / height);
  }

  const imageKitURL = `https://ik.imagekit.io/${IMAGE_KIT_SECRET_KEY}/tr:w-${resizedWidth},h-${resizedHeight},q-60/${src}`;

  try {
    const imgData = await figma.createImageAsync(imageKitURL);

    if (!imgData) throw new Error("There was an error processing this image");

    const { x, y } = figma.viewport.center;

    const rect = figma.createRectangle();
    rect.resize(resizedWidth, resizedHeight);
    rect.x = x - resizedWidth / 2;
    rect.y = y - resizedHeight / 2;

    rect.fills = [
      {
        type: "IMAGE",
        imageHash: imgData.hash,
        scaleMode: "FILL",
      },
    ];

    return { ok: true };
  } catch (error) {
    handleError(error);
    return { ok: false };
  }
}
