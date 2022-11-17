<script lang="ts">
  export let title: string = "";
</script>

<div
  class={`w-full flex flex-col rounded-md shadow-lg p-4 bg-gray-200 dark:bg-gray-800 border-inherit ${
    $$props.class || ""
  }`}
>
  {#if title !== ""}
    <div class="font-normal text-lg border-b-2 pb-2 mb-3 w-full text-center">
      {title}
    </div>
  {/if}
  <slot />
</div>
