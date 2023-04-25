export interface MediaEntry {
  src: string;
  thumb: string;
  width: number;
  height: number;
  creator: string;
  service: PhotoService;
}

export type PhotoService = "UNSPLASH" | "PEXELS" | "PIXABAY";
export type ServiceOption = {
  name: PhotoService;
  logo: string;
};

export type MediaType = "IMAGE" | "VIDEO";

export type OrientationOption = "ALL" | "HORIZONTAL" | "VERTICAL";
export type ColorOption =
  | "ALL"
  | "BLACK"
  | "BLUE"
  | "BROWN"
  | "GRAY"
  | "GRAYSCALE"
  | "GREEN"
  | "ORANGE"
  | "PINK"
  | "PURPLE"
  | "RED"
  | "TEAL"
  | "WHITE"
  | "YELLOW";

export interface SearchParams {
  query: string;
  orientation: OrientationOption;
  color: ColorOption;
}

export interface SearchMessage {
  type: "SEARCH";
  payload: {
    services: PhotoService[];
    params: SearchParams;
  };
}

export interface CreateMessage {
  type: "CREATE";
  payload: {
    src: string;
    width: number;
    height: number;
  };
}
