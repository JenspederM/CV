<script lang="ts">
  import Fa from "svelte-fa";
  import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
  import { isDarkMode } from "../stores";

  let elem;
  let y;
  let isDark = true;

  isDarkMode.subscribe((value) => {
    isDark = value;
  });

  const toggleDarkMode = () => {
    isDarkMode.update((value) => !value);
  };

  let background = "bg-gray-300 dark:bg-gray-700";
  let text = "text-gray-700 dark:text-gray-300";
  let border = "border-gray-400 dark:border-gray-600";

  const onScroll = () => {
    y = window.scrollY;
  };

  $: dynamicOpacity = Math.max(1 - Math.max(0, y / 40), 0);
</script>

<svelte:window on:scroll={onScroll} />

<div class="min-w-full min-h-screen {isDark ? 'dark' : ''}">
  <!-- Dark Mode Button-->
  <button
    on:click={() => toggleDarkMode()}
    hidden={dynamicOpacity < 0.1}
    class="z-50 absolute top-6 right-6 float-right px-2 py-1 rounded-full bg-gray-700"
    style="opacity: {dynamicOpacity}"
  >
    {isDark ? "☀️" : "🌙"}
  </button>

  <!-- Main Container-->
  <div
    class="flex flex-col items-center overflow-auto p-4 {background} {text} {border}"
  >
    <div class="w-full h-full space-y-4 md:w-4/5 lg:w-2/3 border-inherit">
      <slot />
    </div>

    <!-- Scroll indicator -->
    <div
      class="absolute bottom-0"
      hidden={dynamicOpacity < 0.1}
      style="opacity: {dynamicOpacity}"
    >
      <div class="flex flex-col text-xs">
        <div class="hidden sm:flex">Scroll to see more</div>
        <Fa icon={faCaretDown} />
      </div>
    </div>
  </div>
</div>
