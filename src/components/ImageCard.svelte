<script lang="ts">
  interface Mediaimage {
    src: string;
    thumb: string;
    width: number;
    height: number;
    creator: string;
    service: string;
  }

  export let image: Mediaimage;
</script>

<div class="flex flex-col gap-1">
  <button class="group relative grow border border-white/10 bg-white/5" on:click>
    <img src={image.thumb} alt={image.creator} width={image.width} height={image.height} />
    <div
      class="absolute top-0 left-0 flex h-full w-full items-center justify-center overflow-hidden border border-current bg-figma-gray-900/50 text-sm font-semibold opacity-0 group-hover:opacity-100"
    >
      Add Image
    </div>
  </button>
  <p class="text-[11px]">
    <span class="opacity-60">by</span>
    <span class="font-semibold">{image.creator}</span> <span class="opacity-60">from</span>
    <span class="font-semibold capitalize">{image.service}</span>
  </p>
</div>
