<script lang="ts">
  import { slide } from "svelte/transition";
  import Fa from "svelte-fa";
  import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";

  export let title = "";
  export let parent = false;
  export let show = false;
  export let textStyle = "text-white font-bold";
  export let borderStyle = "border-t-2 border-gray-400";

  const toggleShow = () => {
    show = !show;
  };
</script>

<button class="flex lg:hidden w-full py-2 px-4" on:click={toggleShow}>
  <div
    class="flex text-xs w-full items-center justify-center space-x-2 {textStyle}"
  >
    <div>{title ? title : "Slidedown menu"}</div>
    <div>
      <Fa icon={show ? faArrowUp : faArrowDown} />
    </div>
  </div>
</button>
{#if show}
  <div
    transition:slide
    class="flex lg:hidden flex-col py-2 space-y-1 {borderStyle}"
  >
    <slot />
  </div>
{/if}
<div class="hidden lg:flex lg:flex-col py-2 px-4">
  <div
    class="{parent
      ? 'hidden'
      : ''} flex text-xs w-full  items-center justify-center pb-1 {textStyle}"
  >
    <div>{title ? title : "Slidedown menu"}</div>
  </div>
  <div class="py-2 space-y-1">
    <slot />
  </div>
</div>
