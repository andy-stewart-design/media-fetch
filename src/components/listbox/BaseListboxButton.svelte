<script lang="ts">
  import { ListboxButton } from "neutral-ui";
</script>

<ListboxButton
  class="flex w-full items-center justify-between rounded border border-foreground/10 px-2 py-1.5 capitalize transition-colors ease-out hover:border-foreground focus:border-foreground focus:outline-none data-[state=true]:border-foreground"
>
  <slot />
</ListboxButton>
