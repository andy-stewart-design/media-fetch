import type { StockImageData, ImageService } from '@utils/image-search';

// PAYLOAD TYPES
interface StockImageDataPayload {
  total: number;
  images: StockImageData[];
}

interface MessagePayload {
  message: string;
}

interface QuickActionPayload {
  query: string;
}

interface QueryPayload extends QuickActionPayload {
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
  payload: StockImageDataPayload;
}

export interface ImageResultsAdditional {
  type: 'RESULTS_ADD';
  payload: StockImageDataPayload;
}

export interface QuickAction {
  type: 'QUICK_ACTION';
  payload: QuickActionPayload;
}

export interface QueryError {
  type: 'QUERY_ERROR';
  payload: MessagePayload;
}

export interface PlaceImageSuccess {
  type: 'PLACE_IMAGE_SUCCESS';
  payload: MessagePayload;
}

export interface PlaceImageError {
  type: 'PLACE_IMAGE_ERROR';
  payload: MessagePayload;
}

export type PluginErrorMessage = QueryError | PlaceImageError;

export interface PluginPostMessage {
  pluginMessage:
    | ImageResultsInitial
    | ImageResultsAdditional
    | PlaceImageSuccess
    | PluginErrorMessage
    | QuickAction;
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
  payload: MessagePayload;
}

export type UIPostMessage =
  | ImageQueryInitial
  | ImageQueryAdditional
  | PlaceImageRequest
  | UIErrorMessage;
