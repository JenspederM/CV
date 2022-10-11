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
      type: "scripting",
      title: "Python",
      value: "100%",
    },
    {
      type: "scripting",
      title: "R",
      value: "100%",
    },
    {
      type: "deployment",
      title: "Helm",
      value: "80%",
    },
    {
      type: "deployment",
      title: "Kubernetes Manifests",
      value: "80%",
    },
    {
      type: "scripting",
      title: "js/ts",
      value: "60%",
    },
    {
      type: "scripting",
      title: "Rust",
      value: "40%",
    },
    {
      type: "scripting",
      title: "Bash",
      value: "80%",
    },
    {
      type: "scripting",
      title: "Powershell",
      value: "80%",
    },
    {
      type: "integration",
      title: "Azure Pipelines",
      value: "100%",
    },
    {
      type: "integration",
      title: "Github Actions",
      value: "70%",
    },
  ];

  $: scriptingLangs = programming.filter((lang) => {
    return lang.type === "scripting";
  });
  $: integrationLangs = programming.filter((lang) => {
    return lang.type === "integration";
  });
  $: deploymentLangs = programming.filter((lang) => {
    return lang.type === "deployment";
  });
</script>

<div class="flex flex-col {width} bg-gray-600 rounded-xl overflow-auto">
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
  <SlidedownMenu title="Programming">
    <SlidedownMenu title="Scripting">
      {#each scriptingLangs as skill}
        <div class="flex flex-row justify-between text-xs">
          <div class="text-white font-bold">{skill.title}:</div>
          <div class="text-gray-400">{skill.value}</div>
        </div>
      {/each}
    </SlidedownMenu>
    <SlidedownMenu title="Continuous Integration">
      {#each integrationLangs as skill}
        <div class="flex flex-row justify-between text-xs">
          <div class="text-white font-bold">{skill.title}:</div>
          <div class="text-gray-400">{skill.value}</div>
        </div>
      {/each}
    </SlidedownMenu>
    <SlidedownMenu title="Continuous Deployment">
      {#each deploymentLangs as skill}
        <div class="flex flex-row justify-between text-xs">
          <div class="text-white font-bold">{skill.title}:</div>
          <div class="text-gray-400">{skill.value}</div>
        </div>
      {/each}
    </SlidedownMenu>
  </SlidedownMenu>
</div>
