// Needed for direct import of image files
declare module '*.png' {
  const content: string;
  export default content;
}