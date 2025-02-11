import { asyncLoader } from "scenerystack/phet-core";

export const loadImage = ( url: string ) => {
  const image = new window.Image();

  const unlock = asyncLoader.createLock( image );
  image.onload = () => {
    unlock();
  };

  image.src = url;
  return image;
};