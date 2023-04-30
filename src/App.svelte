<script lang="ts">
  import { fade } from "svelte/transition";
  import ImageCard from "./components/ImageCard.svelte";
  import search from "./components/svg/search.svg";
  import close from "./components/svg/close.svg";
  import loading from "./components/svg/loading.svg";
  import check from "./components/svg/check.svg";
  import chevrondown from "./components/svg/chevrondown.svg";
  import unsplashIcon from "./components/svg/unsplash.svg";
  import pexelsIcon from "./components/svg/pexels.svg";
  import pixabayIcon from "./components/svg/pixabay.svg";
  import "./app.css";
  import {
    MediaEntry,
    PhotoService,
    ServiceOption,
    SearchMessage,
    CreateMessage,
    OrientationOption,
    ColorOption,
  } from "./types/main";
  import { ListboxBase, ListboxButtonBase, ListboxOptionsBase, ListboxOptionBase } from "./components/listbox";

  interface ColorOptions {
    name: ColorOption;
    hex: string;
  }

  let query: string;
  let services: ServiceOption[] = [
    { name: "UNSPLASH", logo: unsplashIcon },
    { name: "PEXELS", logo: pexelsIcon },
    { name: "PIXABAY", logo: pixabayIcon },
  ];
  let selectedServices: PhotoService[] = ["UNSPLASH", "PEXELS", "PIXABAY"];
  let orientations: OrientationOption[] = ["ALL", "HORIZONTAL", "VERTICAL"];
  let selectedOrientation: OrientationOption = "ALL";
  let colors: ColorOptions[] = [
    { name: "ALL", hex: "#4e80ee" },
    { name: "BLACK", hex: "#000000" },
    { name: "WHITE", hex: "#FFFFFF" },
    // { name: "GRAYSCALE", hex: "#4e80ee" },
    { name: "BLUE", hex: "#4e80ee" },
    { name: "BROWN", hex: "#916133" },
    { name: "GRAY", hex: "#757575" },
    { name: "GREEN", hex: "#1BA21B" },
    { name: "ORANGE", hex: "#FD950D" },
    { name: "PINK", hex: "#FF3C99" },
    { name: "PURPLE", hex: "#C900EA" },
    { name: "RED", hex: "#E51A33" },
    { name: "TEAL", hex: "#008080" },
    { name: "YELLOW", hex: "#E7C623" },
  ];
  let selectedColor: ColorOption = "ALL";
  $: selectedHex = colors.filter((c) => c.name === selectedColor)[0].hex;

  let imageArray: MediaEntry[];
  let isWorking = false;

  onmessage = (event) => {
    if (event.data.pluginMessage.type === "STATUS") {
      // console.log("message received: is working", event.data.pluginMessage.workInProgress);
      isWorking = event.data.pluginMessage.workInProgress;
    }
    if (event.data.pluginMessage.media) {
      const duplicateArray = imageArray ? imageArray.slice() : [];
      const newArray = duplicateArray.concat(event.data.pluginMessage.media);
      imageArray = newArray;
    }
  };

  const postSearch = () => {
    if (query && query.replaceAll(" ", "") !== "") {
      const searchQuery = query.replaceAll(" ", "+");
      const pluginMessage: SearchMessage = {
        type: "SEARCH",
        payload: {
          services: selectedServices,
          params: { query: searchQuery, orientation: selectedOrientation, color: selectedColor },
        },
      };
      parent.postMessage({ pluginMessage }, "*");
    } else console.log("need a search query");
  };

  const clearSearch = () => (query = "");

  const postCreate = (src: string, width: number, height: number) => {
    const pluginMessage: CreateMessage = { type: "CREATE", payload: { src, width, height } };
    console.log("posting create", pluginMessage);
    parent.postMessage({ pluginMessage }, "*");
  };

  const handleClick = (e: KeyboardEvent) => e.key === "Enter" && postSearch();
</script>

<div class="relative flex min-h-[100%] flex-col">
  <div class="sticky top-0 z-50 grid gap-2 border-b border-white/10 bg-figma-gray-800 px-6 py-3">
    <div class="flex h-12 gap-3 border-b border-white/10 transition-colors ease-out [&:has(input:focus)]:border-white">
      <button
        class="flex items-center justify-center border border-transparent transition-colors ease-out focus:outline-none focus-visible:border-white disabled:opacity-50"
        aria-label="Search"
        disabled={!(query && query.replaceAll(" ", "") !== "")}
        on:click={postSearch}
      >
        {@html search}
      </button>
      <input
        class="grow bg-transparent pb-2 pt-1.5 placeholder:text-white/50 focus:outline-none"
        type="text"
        bind:value={query}
        placeholder={`Search for images`}
        on:keydown={handleClick}
        spellcheck="false"
      />
      <button
        class="flex w-11 items-center justify-center border border-transparent opacity-60 outline-none transition-all ease-out hover:opacity-100 focus:outline-none focus-visible:border-white focus-visible:opacity-100 disabled:opacity-0"
        aria-label="Clear search"
        disabled={!(query && query.replaceAll(" ", "") !== "")}
        on:click={clearSearch}
      >
        {@html close}
      </button>
    </div>
    <div class="grid grid-cols-3 gap-3 py-3">
      <!-- SERVICE SELECT -->
      <ListboxBase multi bind:value={selectedServices}>
        <ListboxButtonBase>
          {selectedServices.length >= services.length
            ? "All Services"
            : selectedServices.length === 1
            ? selectedServices[0].toLocaleLowerCase()
            : `${selectedServices.length} Services`}
          {@html chevrondown}
        </ListboxButtonBase>
        <ListboxOptionsBase>
          {#each services as service}
            <ListboxOptionBase value={service.name}>
              <span
                class="inline-flex items-center gap-3 text-white/50 transition-colors ease-out group-data-[selected=true]:text-white"
              >
                <span
                  class="inline-block w-7 rounded-full border border-white/10 p-1 group-data-[selected=true]:bg-white/80 group-data-[selected=true]:text-black"
                >
                  {@html service.logo}
                </span>
                {service.name.toLocaleLowerCase()}
              </span>
            </ListboxOptionBase>
          {/each}
        </ListboxOptionsBase>
      </ListboxBase>

      <!-- ORIENTATION SELECT -->
      <ListboxBase bind:value={selectedOrientation}>
        <ListboxButtonBase>
          {selectedOrientation === "ALL" ? "All Orientations" : selectedOrientation.toLocaleLowerCase()}
          {@html chevrondown}
        </ListboxButtonBase>
        <ListboxOptionsBase>
          {#each orientations as orientation}
            <ListboxOptionBase value={orientation}>
              <span class="opacity-0 group-data-[selected=true]:opacity-100">
                {@html check}
              </span>
              {orientation.toLocaleLowerCase()}
            </ListboxOptionBase>
          {/each}
        </ListboxOptionsBase>
      </ListboxBase>

      <!-- COLOR SELECT -->
      <ListboxBase bind:value={selectedColor}>
        <ListboxButtonBase>
          <span class="inline-flex items-center gap-2">
            {#if selectedColor !== "ALL"}
              <span class="h-2 w-2 shrink-0 rounded-full" style:background={selectedHex} />
            {/if}
            {selectedColor === "ALL" ? "All Colors" : selectedColor.toLocaleLowerCase()}
          </span>
          {@html chevrondown}
        </ListboxButtonBase>
        <ListboxOptionsBase>
          <ListboxOptionBase value={colors[0].name}>
            <span class="opacity-0 group-data-[selected=true]:opacity-100">
              {@html check}
            </span>
            All Colors
          </ListboxOptionBase>
          <div class="grid grid-cols-4 border-t border-white/10 px-2 py-1">
            {#each colors as color, index}
              {#if index > 0}
                <ListboxOptionBase value={color.name} grid>
                  <span
                    class="inline-block h-6 w-6 shrink-0 rounded-full border border-white/30 transition-colors group-data-[selected=true]:border-white"
                    style:background={color.hex}
                  />
                </ListboxOptionBase>
              {/if}
            {/each}
          </div>
        </ListboxOptionsBase>
      </ListboxBase>
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
    <div class="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-black/70">
      {@html loading}
    </div>
  {/if}
</div>
