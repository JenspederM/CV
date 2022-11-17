<script lang="ts">
  import Fa from "svelte-fa";
  export let faIcon;
  export let info;
</script>

<div class={`flex w-full items-center space-x-2 ${$$props.class || ""}`}>
  <Fa icon={faIcon} />
  <div class="text-xs 2xl:text-lg font-normal dark:text-gray-300">
    {info}
  </div>
</div>
