import { ComponentProps, useEffect, useRef, useState } from 'react';

export default function Img({ ...delegated }: ComponentProps<'img'>) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const image = imgRef.current;

    function loaded() {
      setIsLoaded(true);
    }

    if (image.complete) {
      loaded();
    } else {
      image.addEventListener('load', loaded);
    }

    return () => {
      image.removeEventListener('load', loaded);
    };
  }, []);

  return <img {...delegated} ref={imgRef} data-loaded={isLoaded} />;
}
