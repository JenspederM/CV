<script lang="ts">
  import { Styles } from "../styles";
  import SlidedownMenu from "./components/SlidedownMenu.svelte";

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

<div
  class={`${$$props.class || ""} ${
    Styles.BoxStyle || ""
  } flex flex-col justify-start items-center w-full`}
>
  <div
    class="flex w-20 h-20 my-4 items-center justify-center bg-white rounded-full"
  />
  <div class="border-gray-400 my-2 border-b-2 w-full" />
  <div class="text-center space-y-1">
    <div class="font-bold">Jens Peder Meldgaard</div>
    <div class="text-xs text-gray-400">DevOps Engineer</div>
    <div class="text-xs text-gray-400">Fullstack Developer</div>
    <div class="text-xs text-gray-400">Data Scientist</div>
  </div>
  <div class="border-gray-400 my-2 border-b-2 w-full" />
  <div class="w-full">
    <SlidedownMenu title="About Me" parent>
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
      <SlidedownMenu title="Programming">
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
      </SlidedownMenu>
    </SlidedownMenu>
  </div>
</div>
