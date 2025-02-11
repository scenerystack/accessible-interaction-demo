// Needed for direct import of image files
declare module '*.png' {
  const content: string;
  export default content;
}
declare module '*.svg' {
  const content: string;
  export default content;
}