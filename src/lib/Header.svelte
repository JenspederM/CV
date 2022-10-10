<script lang="ts">
  import SlidedownMenu from "./components/SlidedownMenu.svelte";

  export let width = "w-full sm:w-1/3";

  const languages = [
    {
      language: "Danish",
      level: "Native",
    },
    {
      language: "English",
      level: "Fully proficient",
    },
    {
      language: "German",
      level: "Fundamental",
    },
  ];

  const personalDetails = [
    {
      title: "Residence",
      value: "Denmark",
    },
    {
      title: "City",
      value: "Copenhagen",
    },
    {
      title: "Age",
      value: "30",
    },
  ];

  const programming = [
    {
      title: "Python",
      value: "100%",
    },
    {
      title: "R",
      value: "100%",
    },
    {
      title: "Helm",
      value: "90%",
    },
    {
      title: "js/ts",
      value: "60%",
    },
    {
      title: "Rust",
      value: "40%",
    },
  ];
</script>

<div class="flex flex-col {width} bg-gray-600 rounded-xl overflow-hidden">
  <div class="flex flex-col items-center bg-gray-700 p-4">
    <div
      class="flex w-20 h-20 items-center justify-center bg-white rounded-full mb-4"
    />
    <div class="text-sm font-bold text-white">Jens Peder Meldgaard</div>
    <div class="text-xs text-gray-400">DevOps Engineer</div>
    <div class="text-xs text-gray-400">Fullstack Developer</div>
    <div class="text-xs text-gray-400">Data Scientist</div>
  </div>
  <SlidedownMenu title="About me" parent>
    <SlidedownMenu title="Personal details">
      {#each personalDetails as detail}
        <div class="flex flex-row justify-between text-xs">
          <div class="text-white font-bold">{detail.title}:</div>
          <div class="text-gray-400">{detail.value}</div>
        </div>
      {/each}
    </SlidedownMenu>
    <SlidedownMenu title="Languages">
      {#each languages as language}
        <div class="flex flex-row justify-between text-xs">
          <div class="text-white font-bold">{language.language}:</div>
          <div class="text-gray-400">{language.level}</div>
        </div>
      {/each}
    </SlidedownMenu>
  </SlidedownMenu>
  <div class="px-4 py-2">
    <div class="font-bold text-white border-b-2 py-1 mb-2">Programming</div>
    {#each programming as _programming}
      <div class="flex flex-row justify-between text-xs">
        <div class="text-white font-bold w-4/12">{_programming.title}:</div>
        <div class="w-8/12 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            class="bg-yellow-500 h-2.5 rounded-full"
            style="width: {_programming.value}"
          />
        </div>
      </div>
    {/each}
  </div>
</div>
