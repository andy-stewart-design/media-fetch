<script lang="ts">
  import { fade } from "svelte/transition"
  import "./app.css"

  interface ImageArray {
    src: string
    thumb: string
    width: string
    height: string
    photographer: string
  }

  let query: string
  let images: ImageArray[]

  onmessage = (event) => {
    if (event.data.pluginMessage.images) {
      images = event.data.pluginMessage.images
    }
  }

  const postSearch = () => {
    if (query && query.replaceAll(" ", "") !== "") {
      parent.postMessage({ pluginMessage: { type: "SEARCH", query } }, "*")
    } else console.log("need a search query")
  }

  const postCreate = (src: string) => parent.postMessage({ pluginMessage: { type: "CREATE", src } }, "*")

  const handleClick = (e: KeyboardEvent) => e.key === "Enter" && postSearch()
</script>

<div class="flex flex-col min-h-[100%]">
  <div class="sticky top-0 flex gap-2 bg-figma-gray-900 border-b border-white/10 p-4 z-50">
    <input
      class="grow bg-transparent border border-white/10 pt-1.5 px-2 pb-2 focus:outline-none focus-visible:border-blue-600"
      type="text"
      bind:value={query}
      placeholder="Search for images"
      on:keydown={handleClick}
    />
    <button class="bg-blue-600 pt-1.5 px-4 pb-2 focus:outline-none focus-visible:outline-blue-600" on:click={postSearch}
      >Search</button
    >
  </div>
  {#if images}
    {#key images}
      <div class="grid grid-cols-2 gap-4 p-4" in:fade>
        {#each images as image}
          <div class="flex flex-col gap-1">
            <button on:click={() => postCreate(image.src)} class="grow bg-white/5 border border-white/10">
              <img src={image.thumb} alt={image.photographer} width={image.width} height={image.height} />
            </button>
            <p class="text-[11px]">
              <span class="opacity-60">by</span>
              {image.photographer} <span class="opacity-60">from</span> Pexels
            </p>
          </div>
        {/each}
      </div>
    {/key}
  {:else}
    <div class="grow flex justify-center items-center">
      <p class="opacity-50 mb-4">Enter a search term</p>
    </div>
  {/if}
</div>
