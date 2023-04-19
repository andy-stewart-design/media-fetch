<script lang="ts">
  import play from "../components/svg/play.svg";
  import loading from "../components/svg/loading.svg";

  interface Mediavideo {
    src: string;
    thumb: string;
    videoThumb: string;
    width: number;
    height: number;
    creator: string;
    service: string;
  }

  export let video: Mediavideo;
  let videoRef: HTMLVideoElement;
  let hasHovered = false;
  let paused = true;

  const handleMouseEnter = () => {
    if (!hasHovered) hasHovered = true;
    // isHovering = true;
    if (videoRef && paused) videoRef.play();
  };

  const handleMouseLeave = () => {
    // (isHovering = false)
    if (videoRef && !paused) videoRef.pause();
  };
</script>

<div class="flex flex-col gap-1">
  <button
    class="group relative grow border border-white/10 bg-white/5"
    on:click
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
  >
    <video
      bind:this={videoRef}
      class="relative w-full"
      src={video.videoThumb}
      muted
      width={video.width}
      height={video.height}
    />
    <!-- <img src={video.thumb} alt={video.creator} width={video.width} height={video.height} />
    {#if hasHovered}
      <div
        class="absolute top-0 left-0 flex h-full w-full items-center justify-center overflow-hidden border border-current bg-figma-gray-800 font-semibold opacity-0 group-hover:opacity-100"
      >
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {@html loading}
        </div>
        <video bind:this={videoRef} class="relative w-full" src={video.videoThumb} autoplay muted bind:paused />
      </div>
    {/if}
    <div class="absolute top-2 left-2 flex items-center gap-2 text-[10px] font-bold text-white drop-shadow-md">
      {@html play}
      {#if !paused}<span>Previewing</span>{/if}
    </div> -->
  </button>
  <p class="text-[11px]">
    <span class="opacity-60">by</span>
    <span class="font-semibold">{video.creator}</span> <span class="opacity-60">from</span>
    <span class="font-semibold capitalize">{video.service}</span>
  </p>
</div>
