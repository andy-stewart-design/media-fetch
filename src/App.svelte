<script lang="ts">
  // TODO: filters (amount, orientation, color)

  import { fade } from "svelte/transition";
  import ImageCard from "./components/ImageCard.svelte";
  import search from "./components/svg/search.svg";
  import close from "./components/svg/close.svg";
  import loading from "./components/svg/loading.svg";
  import "./app.css";

  interface MediaEntry {
    src: string;
    thumb: string;
    width: number;
    height: number;
    creator: string;
    service: string;
  }

  let isWorking = false;
  let query: string;
  let imageArray: MediaEntry[];

  onmessage = (event) => {
    if (event.data.pluginMessage.messageType === "STATUS") {
      console.log("message received");

      isWorking = event.data.pluginMessage.workInProgress;
    }
    if (event.data.pluginMessage.media) {
      imageArray = event.data.pluginMessage.media;
    }
  };

  const postSearch = () => {
    if (query && query.replaceAll(" ", "") !== "") {
      const searchQuery = query.replaceAll(" ", "+");
      console.log(query, searchQuery);

      parent.postMessage({ pluginMessage: { messageType: "SEARCH", query: searchQuery } }, "*");
    } else console.log("need a search query");
  };

  const clearSearch = () => (query = "");

  const postCreate = (src: string, width: number, height: number) => {
    console.log("posting create", { src, width, height });

    parent.postMessage({ pluginMessage: { messageType: "CREATE", src, width, height } }, "*");
  };

  const handleClick = (e: KeyboardEvent) => e.key === "Enter" && postSearch();
</script>

<div class="relative flex min-h-[100%] flex-col">
  <div class="sticky top-0 z-50 border-b border-white/10 bg-figma-gray-800 py-3 px-4">
    <div class="flex h-12">
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
        placeholder={`Search for images`}
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
  {#if imageArray}
    <div class="grid grid-cols-2 gap-4 bg-figma-gray-900/60 p-4" in:fade>
      {#each imageArray as image}
        <ImageCard {image} on:click={() => postCreate(image.src, image.width, image.height)} />
      {/each}
    </div>
  {:else}
    <div class="flex grow items-center justify-center bg-figma-gray-900/60">
      <p class="mb-4 opacity-50">Enter a search term</p>
    </div>
  {/if}
  {#if isWorking}
    <div class="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-black/70">
      {@html loading}
    </div>
  {/if}
</div>
