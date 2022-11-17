<script lang="ts">
  import { slide } from "svelte/transition";
  import type { Education } from "../../types";
  import Box from "../common/Box.svelte";
  import BoxButton from "../common/BoxButton.svelte";
  import EducationDetail from "./EducationDetail.svelte";

  export let education: Education;
  export let toggleDetails: (education: Education) => void;
</script>

<Box class="rounded-lg text-xs space-y-1">
  <div class="font-bold">
    {education.title}
  </div>
  <div class="flex w-full justify-between items-center text-xs font-light">
    <div>
      {education.faculty}
    </div>
    <button on:click={() => toggleDetails(education)}>Show More</button>
  </div>
  {#if education.showDetails}
    <div class="border-t-2 pt-1 border-inherit" transition:slide>
      <div class="pb-2">
        <EducationDetail
          title="Duration:"
          text={`${education.from} - ${education.to}`}
        />
        <EducationDetail title="Grade:" text={education.grade} />
        <EducationDetail title="GPA:" text={education.GPA} />
        {#if education.thesis}
          <EducationDetail title="Thesis:" text={education.thesis} />
          <EducationDetail title="Thesis Grade:" text={education.thesisGrade} />
        {/if}
      </div>
      {#if education.link}
        <BoxButton link={education.link} text="Visit Website" />
      {/if}
    </div>
  {/if}
</Box>
