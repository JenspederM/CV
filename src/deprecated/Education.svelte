<script lang="ts">
  import Box from "../lib/common/Box.svelte";
  import { slide } from "svelte/transition";

  enum EducationType {
    Formal,
    Online,
    SelfTaught,
  }

  interface IEducation {
    show: boolean;
    showDetails: boolean;
    type: EducationType;
    title: string;
    faculty: string;
    from: number;
    to: number;
    grade?: string;
    GPA?: number;
    thesis?: string;
    thesisGrade?: number;
  }

  let educations: IEducation[] = [
    {
      show: true,
      showDetails: false,
      type: EducationType.Formal,
      title: "MSc., Operations & Supply Chain Management",
      faculty: "Aalborg University",
      grade: "11.63",
      GPA: 3.9,
      from: 2017,
      to: 2019,
      thesis:
        "The Effect of Temporal Aggregation & External Factors on Forecast Performance at Norsk Hydro ASA",
      thesisGrade: 12,
    },
    {
      show: true,
      showDetails: false,
      type: EducationType.Formal,
      title: "BSc., Global Business Engineering",
      faculty: "Aalborg University",
      grade: "7.92",
      GPA: 3.21,
      from: 2014,
      to: 2017,
      thesis:
        "Improving Shareholder Value & Creating Overview at Greenland Facility Services A/S",
      thesisGrade: 7,
    },
    {
      show: true,
      showDetails: false,
      type: EducationType.Online,
      title: "Computer Science: Programming with a Purpose",
      faculty: "Princeton University",
      from: 2018,
      to: 2018,
      grade: "91.3%",
    },
    {
      show: true,
      showDetails: false,
      type: EducationType.Online,
      title: "Data Scientist with Python",
      faculty: "DataCamp",
      from: 2017,
      to: 2017,
    },
    {
      show: true,
      showDetails: false,
      type: EducationType.Online,
      title: "Data Scientist with R",
      faculty: "DataCamp",
      from: 2017,
      to: 2017,
    },
    {
      show: true,
      showDetails: false,
      type: EducationType.Online,
      title: "R Programmer",
      faculty: "DataCamp",
      from: 2017,
      to: 2017,
    },
    {
      show: true,
      showDetails: false,
      type: EducationType.Online,
      title: "Python Programmer",
      faculty: "DataCamp",
      from: 2017,
      to: 2017,
    },
    {
      show: false,
      showDetails: false,
      type: EducationType.Formal,
      title: "Mathematics & Physics",
      faculty: "Holstebro Gymnasium",
      from: 2009,
      to: 2012,
    },
  ];

  const toggleShowMore = (education) => {
    education.showDetails = !education.showDetails;
    educations = [...educations];
  };

  $: groupedEducations = educations.reduce((acc, curr) => {
    const typeStr = EducationType[curr.type];
    if (!acc[typeStr]) {
      acc[typeStr] = [];
    }
    acc[typeStr].push(curr);
    return acc;
  }, {});

  $: console.log(groupedEducations);
</script>

<div class="w-full font-normal text-lg border-b-2 pb-2 text-center">
  Education
</div>
{#each Object.keys(groupedEducations) as group}
  <div>{group} Education</div>
  {#each groupedEducations[group] as education}
    {#if education.show}
      <Box class="rounded-lg text-xs space-y-1">
        <div class="font-bold">
          {education.title}
        </div>
        <div
          class="flex w-full justify-between items-center text-xs font-light"
        >
          <div>
            {education.faculty}
          </div>
          <button on:click={() => toggleShowMore(education)}>Show More</button>
        </div>
        {#if education.showDetails}
          <div class="border-t-2 mt-2" transition:slide>
            Here are more details
          </div>
        {/if}
      </Box>
    {/if}
  {/each}
{/each}
