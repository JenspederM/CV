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

<div class="flex flex-col lg:hidden py-2 px-4">
  <button on:click={toggleShow}>
    <div
      class="flex text-xs w-full items-center justify-center space-x-2 py-2 {textStyle}"
    >
      <div>{title ? title : "Slidedown menu"}</div>
      <div>
        <Fa icon={show ? faArrowUp : faArrowDown} />
      </div>
    </div>
  </button>
  <div>
    {#if show}
      <div transition:slide class="flex flex-col {borderStyle}">
        <slot />
      </div>
    {/if}
  </div>
</div>
<div transition:slide class="hidden lg:flex lg:flex-col px-4 py-2">
  <div
    class="{parent
      ? 'hidden'
      : ''} flex text-xs w-full  items-center justify-center pb-1 {textStyle}"
  >
    <div>{title ? title : "Slidedown menu"}</div>
  </div>
  <div class="pt-2">
    <slot />
  </div>
</div>
