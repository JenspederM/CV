<script lang="ts">
  export let link: string = "";
  export let text: string = "";
</script>

<div
  class="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg px-4 py-2 text-center"
>
  {#if link !== ""}
    <a
      class="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg px-4 py-2"
      target="_blank"
      href={link}
    >
      Visit website
    </a>
  {:else}
    <button class=" ">
      {text}
    </button>
  {/if}
</div>
