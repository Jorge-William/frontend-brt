/// <reference types="vite/client" />

declare module "*.svg" {
  const content: any | string;
  export default content;
}
