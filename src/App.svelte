<script lang="ts">
  // TODO: filters (amount, orientation, color)

  import { fade } from "svelte/transition";
  import { RadioGroup, RadioLabel, RadioOption } from "neutral-ui";
  import ImageCard from "./components/ImageCard.svelte";
  import search from "./components/svg/search.svg";
  import close from "./components/svg/close.svg";
  import loading from "./components/svg/loading.svg";
  import unsplashIcon from "./svg/unsplash.svg";
  import pexelsIcon from "./svg/pexels.svg";
  import pixabayIcon from "./svg/pixabay.svg";
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
    { name: "GRAYSCALE", hex: "#4e80ee" },
    { name: "BLUE", hex: "#4e80ee" },
    { name: "BROWN", hex: "#6A411C" },
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

  const filterService = (service: PhotoService) => {
    if (!selectedServices.includes(service)) {
      selectedServices = selectedServices.concat(service);
    } else if (selectedServices.length > 1) {
      selectedServices = selectedServices.filter((s) => s != service);
    }
    // if (selectedServices.includes(service) && selectedServices.length > 1)
    //   selectedServices = selectedServices.filter((s) => s != service);
    // else selectedServices = selectedServices.concat(service);
    console.log(selectedServices);
  };

  let showServiceModal = false;
  let showOrientationsModal = false;
  let showColorsModal = false;
</script>

<div class="relative flex min-h-[100%] flex-col">
  <div class="sticky top-0 z-50 grid gap-2 border-b border-white/10 bg-figma-gray-800 px-6 py-3">
    <div class="flex h-12 gap-3 border-b border-white/10">
      <button
        class="flex items-center justify-center focus:outline-none focus-visible:outline-blue-600 disabled:opacity-50"
        aria-label="Search"
        disabled={!(query && query.replaceAll(" ", "") !== "")}
        on:click={postSearch}
      >
        {@html search}
      </button>
      <input
        class="grow bg-transparent pb-2 pt-1.5 placeholder:text-white/50 focus:outline-none focus-visible:border-blue-600"
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
    <div class="flex gap-6 py-3">
      <!-- SERVICE SELECT -->
      <div class="relative">
        <button
          class="flex items-center gap-1 text-sm font-medium"
          on:click={() => (showServiceModal = !showServiceModal)}
        >
          {selectedServices.length === 3 ? "All Services" : selectedServices.length === 2 ? `2 Services` : `1 Service`}
          <svg viewBox="0 0 12 12" width="12" height="12">
            <path d="M2 4 L6 8 L10 4" stroke="currentColor" stroke-width="1.5" fill="none" />
          </svg>
        </button>
        <div
          class="invisible absolute mt-1 hidden flex-col gap-3 rounded bg-black p-4 data-[active=true]:visible data-[active=true]:flex"
          data-active={showServiceModal}
        >
          {#each services as service}
            <button
              on:click={() => filterService(service.name)}
              class="group flex items-center gap-2 rounded-full text-sm font-medium capitalize text-white/50 transition-colors data-[selected=true]:text-white"
              class:active={selectedServices.includes(service.name)}
              data-selected={selectedServices.includes(service.name)}
            >
              <span
                class="inline-block w-7 rounded-full border border-white/10 p-1 text-white/50 transition-colors group-data-[selected=true]:bg-white/80 group-data-[selected=true]:text-black"
                >{@html service.logo}</span
              >
              {service.name.toLocaleLowerCase()}
            </button>
          {/each}
        </div>
      </div>

      <!-- ORIENTATION SELECT -->
      <div>
        <button
          class="flex items-center gap-1 text-sm font-medium capitalize"
          on:click={() => (showOrientationsModal = !showOrientationsModal)}
        >
          {selectedOrientation === "ALL" ? "All Orientations" : selectedOrientation.toLocaleLowerCase()}
          <svg viewBox="0 0 12 12" width="12" height="12">
            <path d="M2 4 L6 8 L10 4" stroke="currentColor" stroke-width="1.5" fill="none" />
          </svg>
        </button>
        <div
          class="invisible absolute mt-1 hidden flex-col gap-3 rounded bg-black py-1 data-[active=true]:visible data-[active=true]:flex"
          data-active={showOrientationsModal}
        >
          <RadioGroup bind:value={selectedOrientation} class="flex-col gap-3">
            <RadioLabel hidden>Orientation</RadioLabel>
            {#each orientations as orientation}
              <RadioOption
                class="min-w-[120px] border border-white/10 px-4 py-1.5 text-sm font-medium capitalize transition-colors aria-checked:bg-white/80 aria-checked:text-black"
                value={orientation}
              >
                {orientation.toLocaleLowerCase()}
              </RadioOption>
            {/each}
          </RadioGroup>
        </div>
      </div>

      <!-- COLOR SELECT -->
      <div>
        <button
          class="flex items-center gap-1 text-sm font-medium capitalize"
          on:click={() => (showColorsModal = !showColorsModal)}
        >
          <!-- <svg viewBox="0 0 16 16" width="16" height="16" class="mr-1 text-blue-500">
            <rect width="14" height="14" x="1" y="1" rx="2" stroke="currentColor" stroke-width="1.5" fill="none" />
            <rect width="8" height="8" x="1" y="7" rx="2" stroke="currentColor" stroke-width="1.5" fill="none" />
          </svg> -->
          {selectedColor === "ALL" ? "All Colors" : selectedColor.toLocaleLowerCase()}
          <svg viewBox="0 0 12 12" width="12" height="12">
            <path d="M2 4 L6 8 L10 4" stroke="currentColor" stroke-width="1.5" fill="none" />
          </svg>
        </button>
        <div
          class="invisible absolute mt-1 hidden rounded bg-black data-[active=true]:visible data-[active=true]:flex"
          data-active={showColorsModal}
        >
          <RadioGroup bind:value={selectedColor} class="flex-col gap-3">
            <RadioLabel hidden>Orientation</RadioLabel>
            <div class="grid grid-cols-4 p-2">
              {#each colors as color}
                <RadioOption class="group rounded-full p-1.5 aria-checked:bg-white/[0.15]" value={color.name}>
                  <span
                    class="inline-block h-6 w-6 rounded-full border border-white/30 transition-colors group-aria-checked:border-white"
                    style:background={color.hex}
                  />
                </RadioOption>
              {/each}
            </div>
          </RadioGroup>
        </div>
      </div>
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
