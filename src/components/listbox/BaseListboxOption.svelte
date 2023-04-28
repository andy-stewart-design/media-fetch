<script lang="ts">
  import { ListboxOption } from "neutral-ui";
  import type { Value } from "neutral-ui/dist/listbox/types";

  export let value: Value;
  export let grid = false;
</script>

<ListboxOption
  {value}
  class={grid
    ? "group flex items-center rounded-sm p-1.5 hover:bg-white/10 data-[active=true]:bg-white/10"
    : "group relative flex select-none items-center gap-2 px-4 py-2 capitalize hover:bg-white/10 data-[active=true]:bg-white/10"}
>
  <slot />
</ListboxOption>
