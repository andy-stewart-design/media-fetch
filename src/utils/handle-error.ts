export function handleError(error: unknown) {
  if (!error) {
    // This is an error thrown from an unknown source
    const message = 'Unknown error';
    console.error(`Plugin error: ${message}`);
    return message;
  } else if (error instanceof Error) {
    // const message = error.message.toLocaleLowerCase();
    const { message } = error;
    // This is likely an error thrown from one of the image search functions
    // if (message.includes('unsplash')) {
    //   console.error('Unsplash problem');
    // } else if (message.includes('pexels')) {
    //   console.error('Pexels problem');
    // } else if (message.includes('pixabay')) {
    //   console.error('Pixabay problem');
    // } else console.error(error.message);
    console.error(`Plugin error: ${message}`);
    return message;
  } else if (typeof error === 'object' && 'message' in error) {
    if (error.message === 'Failed to fetch') {
      // This is likely an error thrown by the fetch request itself
      console.error(`Plugin error: ${error.message}`);
      const message = 'Sorry! We had an issue completeing the requested image search.';
      return message;
    } else {
      // This is an error thrown from an unknown source
      const message = 'Unknown error';
      console.error(`Plugin error: ${message}`);
      return message;
    }
  } else {
    // This is an error thrown from an unknown source
    const message = 'Unknown error';
    console.error(`Plugin error: ${message}`);
    return message;
  }
}
