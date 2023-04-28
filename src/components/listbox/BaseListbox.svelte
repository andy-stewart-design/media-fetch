<script lang="ts">
  import { Listbox } from "neutral-ui";
  import type { Value } from "neutral-ui/dist/listbox/types";

  export let value: Value | Value[];
  export let multiple = false;
</script>

<Listbox {multiple} bind:value class="text-sm font-semibold">
  <slot />
</Listbox>
