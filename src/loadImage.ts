import { asyncLoader } from "scenerystack/phet-core";

export const loadImage = ( url: string ) => {
  const image = new window.Image();

  console.log( `loading ${url}` );

  const unlock = asyncLoader.createLock( image );
  image.onload = () => {
    console.log( `loaded ${url}` );
    unlock();
  };

  image.src = url;
  return image;
};