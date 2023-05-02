<script lang="ts">
  import unsplash from "./svg/unsplash.svg";
  import pexels from "./svg/pexels.svg";
  import pixabay from "./svg/pixabay.svg";
  import { MediaEntry } from "../types/main";

  export let image: MediaEntry;

  const { service } = image;
  const watermark =
    service.toLocaleUpperCase() === "UNSPLASH"
      ? unsplash
      : service.toLocaleUpperCase() === "PIXABAY"
      ? pixabay
      : pexels;
</script>

<div class=" relative flex flex-col gap-1">
  <button class="group relative grow overflow-hidden border border-foreground/10 bg-black/50" on:click>
    <img src={image.thumb} alt={image.creator} width={image.width} height={image.height} />
    <div
      class="absolute -bottom-16 -left-16 h-32 w-32 bg-gradient-radial from-black via-transparent to-transparent opacity-30"
    />
    <div
      class="absolute left-0 top-0 flex h-full w-full items-center justify-center overflow-hidden border border-current bg-black/75 text-sm font-semibold text-white opacity-0 transition-opacity ease-out group-hover:opacity-100"
    >
      Add Image
    </div>
    <div
      class="absolute bottom-0 left-0 w-8 p-1.5 text-white opacity-60 transition-opacity ease-out group-hover:opacity-100"
    >
      {@html watermark}
    </div>
  </button>
  <p class="text-[11px]">
    <span class="opacity-60">by</span>
    <span class="font-semibold">{image.creator}</span> <span class="opacity-60">from</span>
    <span class="font-semibold capitalize">{image.service}</span>
  </p>
</div>
