import type { ImageData, ImageService } from '@utils/image-search';

// PAYLOAD TYPES
interface ImageDataPayload {
  images: ImageData[];
}

interface ErrorPayload {
  message: string;
}

interface QueryPayload {
  query: string;
  services: Array<ImageService>;
  orientation: string;
  primaryColor: string;
  page: number;
  imagesPerService: number;
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
  type: 'RESULTS_INIT';
  payload: ImageDataPayload;
}

export interface ImageResultsAdditional {
  type: 'RESULTS_ADD';
  payload: ImageDataPayload;
}

export interface QueryErrorMessage {
  type: 'QUERY_ERROR';
  payload: ErrorPayload;
}

export interface PlaceImageErrorMessage {
  type: 'PLACE_IMAGE_ERROR';
  payload: ErrorPayload;
}

export type PluginErrorMessage = QueryErrorMessage | PlaceImageErrorMessage;

export interface PluginPostMessage {
  pluginMessage: ImageResultsInitial | ImageResultsAdditional | PluginErrorMessage;
}

// UI MESSAGES
export interface ImageQueryInitial {
  type: 'QUERY_INIT';
  payload: QueryPayload;
}

export interface ImageQueryAdditional {
  type: 'QUERY_ADD';
  payload: QueryPayload;
}

export interface PlaceImageRequest {
  type: 'PLACE_IMAGE';
  payload: PlaceImagePayload;
}

export interface UIErrorMessage {
  type: 'ERROR';
  payload: ErrorPayload;
}

export type UIPostMessage =
  | ImageQueryInitial
  | ImageQueryAdditional
  | PlaceImageRequest
  | UIErrorMessage;
