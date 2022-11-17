<script lang="ts">
  import type { Education } from "../../types";
  import EducationCard from "./EducationCard.svelte";

  export let educations: Education[];

  const toggleDetails = (education) => {
    education.showDetails = !education.showDetails;
    educations = [...educations];
  };

  $: groupedEducations = educations.reduce((acc, curr) => {
    if (!acc[curr.type]) {
      acc[curr.type] = [];
    }
    acc[curr.type].push(curr);
    return acc;
  }, {});
</script>

{#each Object.keys(groupedEducations) as group}
  <div>{group} Education</div>
  {#each groupedEducations[group] as education}
    {#if education.show}
      <EducationCard {education} {toggleDetails} />
    {/if}
  {/each}
{/each}
