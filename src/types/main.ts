export interface PexelsResponse {
  id: number;
  width: number;
  height: number;
  url: string;
  alt: string | null;
  avg_color: string | null;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  liked: boolean;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
}

export interface PixabayResponse {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  previewUrl: string;
  previewWidth: number;
  previewHeight: number;
  webformatURL: string;
  webformatWidth: number;
  webformatHeight: number;
  largeImageURL: string;
  fullHDURL: string;
  imageURL: string;
  imageWidth: number;
  imageHeight: number;
  imageSize: number;
  views: number;
  downloads: number;
  favorites: number;
  likes: number;
  comments: number;
  user_id: number;
  user: string;
  userImageURL: string;
}

export interface UnsplashRespones {
  id: string;
  created_at: string;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  likes: number;
  liked_by_user: boolean;
  description: string;
  user: {
    id: string;
    username: string;
    name: string;
    first_name: string;
    last_name: string;
    instagram_username: string;
    twitter_username: string;
    portfolio_url: string;
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
    links: {
      self: string;
      html: string;
      photos: string;
      likes: string;
    };
  };
  current_user_collections: Array<string>;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  links: {
    self: string;
    html: string;
    download: string;
  };
}

export interface MediaEntry {
  service: PhotoService;
  creator: string;
  src: string;
  thumb: string;
  width: number;
  height: number;
  orientation: OrientationOption;
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

export interface LoadMoreMessage {
  type: "LOADMORE";
}
