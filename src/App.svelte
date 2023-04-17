<script lang="ts">
  import search from "./components/svg/search.svg";
  import close from "./components/svg/close.svg";
  import { fade } from "svelte/transition";
  import "./app.css";

  type MediaType = "IMAGE" | "VIDEO";

  interface ImageArray {
    src: string;
    thumb: string;
    width: number;
    height: number;
    creator: string;
    service: string;
  }

  let mediaType: MediaType = "VIDEO";
  let query: string;
  let mediaArray: ImageArray[];

  onmessage = (event) => {
    if (event.data.pluginMessage.media) {
      mediaArray = event.data.pluginMessage.media;
    }
  };

  const postSearch = () => {
    if (query && query.replaceAll(" ", "") !== "") {
      parent.postMessage({ pluginMessage: { messageType: "SEARCH", mediaType, query } }, "*");
    } else console.log("need a search query");
  };

  const clearSearch = () => (query = "");

  const postCreate = (src: string, width: number, height: number) => {
    console.log("posting create", { src, width, height });

    parent.postMessage({ pluginMessage: { messageType: "CREATE", mediaType, src, width, height } }, "*");
  };

  const handleClick = (e: KeyboardEvent) => e.key === "Enter" && postSearch();

  $: console.log(mediaArray);
</script>

<div class="flex min-h-[100%] flex-col">
  <div class="sticky top-0 z-50 border-b border-white/10 bg-figma-gray-900 p-4">
    <div class="flex h-12 border border-white/10">
      <button
        class="flex w-11 items-center justify-center focus:outline-none focus-visible:outline-blue-600 disabled:opacity-50"
        aria-label="Search"
        disabled={!(query && query.replaceAll(" ", "") !== "")}
        on:click={postSearch}
      >
        {@html search}
      </button>
      <input
        class="grow bg-transparent pt-1.5 pb-2 placeholder:text-white/50 focus:outline-none focus-visible:border-blue-600"
        type="text"
        bind:value={query}
        placeholder="Search for images"
        on:keydown={handleClick}
        spellcheck="false"
      />
      <button
        class="flex w-11 items-center justify-center focus:outline-none focus-visible:outline-blue-600 disabled:opacity-0"
        aria-label="Clear search"
        disabled={!(query && query.replaceAll(" ", "") !== "")}
        on:click={clearSearch}
      >
        {@html close}
      </button>
    </div>
  </div>
  {#if mediaArray}
    {#key mediaArray}
      <div class="grid grid-cols-2 gap-4 p-4" in:fade>
        {#each mediaArray as entry}
          <div class="flex flex-col gap-1">
            <button
              class="group relative grow border border-white/10 bg-white/5"
              on:click={() => postCreate(entry.src, entry.width, entry.height)}
            >
              <img src={entry.thumb} alt={entry.creator} width={entry.width} height={entry.height} />
              <div
                class="absolute top-0 left-0 flex h-full w-full items-center justify-center bg-black/40 font-semibold opacity-0 group-hover:opacity-100"
              >
                Add {mediaType.toLocaleLowerCase()}
              </div>
            </button>
            <p class="text-[11px]">
              <span class="opacity-60">by</span>
              <span class="font-semibold">{entry.creator}</span> <span class="opacity-60">from</span>
              <span class="font-semibold capitalize">{entry.service}</span>
            </p>
          </div>
        {/each}
      </div>
    {/key}
  {:else}
    <div class="flex grow items-center justify-center">
      <p class="mb-4 opacity-50">Enter a search term</p>
    </div>
  {/if}
</div>
