export type PrimaryColorValue =
  | "any"
  | "grayscale"
  | "black"
  | "white"
  | "green"
  | "teal"
  | "blue"
  | "purple"
  | "pink"
  | "red"
  | "orange"
  | "yellow";

export const COLOR_OPTIONS = [
  {
    label: "Any",
    value: "any",
    background:
      "conic-gradient(from 0deg at 50% 50% in oklch longer hue, oklch(70% .3 0) 0%, oklch(70% .3 0) 100%)",
  },
  {
    label: "Grayscale",
    value: "grayscale",
    background:
      "linear-gradient(to bottom in oklch, oklch(10% 0 0) 0%, oklch(70% 0 0) 100%)",
  },
  {
    label: "Black",
    value: "black",
    background: "oklch(0% 0 0)",
  },
  {
    label: "White",
    value: "white",
    background: "oklch(100% 0 0)",
  },
  {
    label: "Green",
    value: "green",
    background: "oklch(75% 0.25 150)",
  },
  {
    label: "Teal",
    value: "teal",
    background: "oklch(55% 0.5 185)",
  },
  {
    label: "Blue",
    value: "blue",
    background: "oklch(75% 0.5 240)",
  },
  {
    label: "Purple",
    value: "purple",
    background: "oklch(80% 0.5 272)",
  },
  {
    label: "Pink",
    value: "pink",
    background: "oklch(75% 0.35 320)",
  },
  {
    label: "Red",
    value: "red",
    background: "oklch(65% 0.27 25)",
  },
  {
    label: "Orange",
    value: "orange",
    background: "oklch(75% 0.4 75)",
  },
  {
    label: "Yellow",
    value: "yellow",
    background: "oklch(80% 0.4 100)",
  },
];

export const ORIENTATION_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Landscape", value: "landscape" },
  { label: "Portrait", value: "portrait" },
  { label: "Square", value: "square" },
];
