/**
 * Asynchronously places an image from a given source onto the Figma canvas.
 * @param src - The source URL of the image.
 * @param width - The original width of the image.
 * @param height - The original height of the image.
 * @param quality - The desired export quality of the image.
 * @param exportSize - The desired export size of the image.
 */
export async function placeImage(
  src: string,
  width: number,
  height: number,
  quality: number,
  exportSize: number
) {
  // Calculate the dimensions for the resized image while maintaining the original aspect ratio.
  let resizedWidth = exportSize;
  let resizedHeight = height * (exportSize / width);

  if (resizedHeight > exportSize) {
    resizedHeight = exportSize;
    resizedWidth = width * (resizedHeight / height);
  }

  // Set up options for the fetch request to the image generation API.
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

  // Fetch the image data from the proxy API.
  const post = await fetch(`https://media-fetch-hono.vercel.app/generate`, options);
  const { data } = await post.json();

  // Ensure the API response returned a Base64 string and not an error object.
  if (typeof data !== 'string')
    throw new Error(
      `There was an error with the return value of the generate API. Expected a string but got a ${typeof data}.`
    );

  // Create a Figma image from the base64-encoded image data.
  const imgData = figma.createImage(figma.base64Decode(data));

  // Handle errors related to Figma's createImage function.
  if (!imgData) throw new Error(`There was an error thrown by Figma's createImage function.`);

  // Check if the user has selected a shape on the Figma canvas.
  const selectedShape = figma.currentPage.selection[0];
  const isRectangle = selectedShape && selectedShape.type === 'RECTANGLE';
  const isEllipse = selectedShape && selectedShape.type === 'ELLIPSE';
  const isPolygon = selectedShape && selectedShape.type === 'POLYGON';
  const isValidShape = isRectangle || isEllipse || isPolygon;
  const userHasSelectedValidShape = selectedShape && isValidShape;

  // If the user has selected a shape and it's a valid shape, apply the image as a fill to the shape.
  // Otherwise, create a new rectangle.
  if (userHasSelectedValidShape) {
    selectedShape.fills = [
      {
        type: 'IMAGE',
        imageHash: imgData.hash,
        scaleMode: 'FILL',
      },
    ];
  } else {
    // If no valid shape is selected, create a new rectangle and position it in the center of the viewport.
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
}
