<script lang="ts">
  import Box from "../common/Box.svelte";
  import MobileLayout from "./MobileLayout.svelte";
  import DesktopLayout from "./DesktopLayout.svelte";
</script>

<div
  class="flex flex-col flex-grow w-full items-center justify-center h-[calc(100vh-2rem)]"
>
  <Box
    class="flex-grow p-0 sm:flex-grow-0 items-center justify-center overflow-hidden"
  >
    <MobileLayout />
    <DesktopLayout />
  </Box>
</div>
