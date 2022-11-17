<script lang="ts">
  export let title: string;
  export let text: string | number;
</script>

{#if text}
  <div class="flex space-x-1">
    <div class="font-bold w-1/4">{title}</div>
    <div class="flex w-full font-light">{text}</div>
  </div>
{/if}
