<script lang="ts">
  import { Listbox } from "neutral-ui";
  import type { Value } from "neutral-ui/dist/listbox/types";

  export let value: Value | Value[];
  export let multi = false;
</script>

<Listbox {multi} atLeast="1" bind:value class="text-sm font-semibold">
  <slot />
</Listbox>
