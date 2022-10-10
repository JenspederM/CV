<script>
  import Header from "./lib/Header.svelte";
</script>

<div class="flex flex-col items-center w-full absolute inset-0 bg-gray-800 p-4">
  <div
    class="flex flex-col lg:flex-row w-full space-y-4 lg:space-x-4 lg:space-y-0 overflow-auto"
  >
    <Header width="w-full lg:w-3/12 xl:w-2/12" />
    <div
      class="flex flex-col flex-grow w-full lg:w-9/12 xl:w-10/12 text-white p-4 bg-gray-600 rounded-xl"
    >
      <div class="">Content</div>
    </div>
  </div>
</div>
