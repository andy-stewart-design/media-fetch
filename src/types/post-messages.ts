import type { ImageData, ImageService } from "@utils/image-search";

// PAYLOAD TYPES
interface ImageDataPayload {
  images: ImageData[];
}

interface ErrorPayload {
  message: string;
}

interface QueryPayload {
  query: string;
  sources: Array<ImageService>;
  orientation: string;
  primaryColor: string;
}

interface PlaceImagePayload {
  src: string;
  width: number;
  height: number;
  exportSize: number;
  quality: number;
}

// PLUGIN MESSAGES
export interface ImageResultsInitial {
  type: "RESULTS_INIT";
  payload: ImageDataPayload;
}

export interface ImageResultsAdditional {
  type: "RESULTS_ADD";
  payload: ImageDataPayload;
}

export interface PluginErrorMessage {
  type: "ERROR";
  payload: ErrorPayload;
}

export interface PluginPostMessage {
  pluginMessage: ImageResultsInitial | PluginErrorMessage;
}

// UI MESSAGES
export interface ImageQueryInitial {
  type: "QUERY_INIT";
  payload: QueryPayload;
}

export interface ImageQueryAdditional {
  type: "QUERY_ADD";
  payload: QueryPayload;
}

export interface PlaceImageRequest {
  type: "PLACE_IMAGE";
  payload: PlaceImagePayload;
}

export interface UIErrorMessage {
  type: "ERROR";
  payload: ErrorPayload;
}

export type UIPostMessage =
  | ImageQueryInitial
  | ImageQueryAdditional
  | PlaceImageRequest
  | UIErrorMessage;
