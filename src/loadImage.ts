import { asyncLoader } from "scenerystack/phet-core";

export const loadImage = ( url: string ) => {
  const image = new window.Image();

  image.src = url;

  if ( !image.complete ) {
    const unlock = asyncLoader.createLock( image );

    image.onload = () => {
      unlock();
    };
  }

  return image;
};