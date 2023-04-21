export interface MediaEntry {
  src: string;
  thumb: string;
  width: number;
  height: number;
  creator: string;
  service: PhotoSource;
}

export type PhotoSource = "UNSPLASH" | "PEXELS" | "PIXABAY";

export type MediaType = "IMAGE" | "VIDEO";

export interface SearchMessage {
  messageType: "SEARCH";
  services: PhotoSource[];
  query: string;
}

export interface CreateMessage {
  messageType: "CREATE";
  src: string;
  width: number;
  height: number;
}
