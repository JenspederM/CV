<script lang="ts">
  import Title from "./lib/common/Title.svelte";
  import EducationList from "./lib/Education/EducationList.svelte";
  import ExperienceList from "./lib/Experience/ExperienceList.svelte";
  import AboutMe from "./lib/AboutMe/AboutMe.svelte";
  import DataProvider from "./DataProvider";
  import ContactInformation from "./lib/ContactInformation/ContactInformation.svelte";

  import Theme from "./lib/Theme.svelte";
  import ResumeGenerator from "./lib/Experience/ResumeGenerator.svelte";
</script>

<Theme>
  <!-- About Me / Landing Page -->
  <AboutMe />

  <!-- Experience -->
  <Title text="Experience" />
  <ExperienceList />

  <!-- Education -->
  <Title text="Education" />
  <EducationList educations={DataProvider.getEducations()} />

  <!-- Contact Information -->
  <Title text="Contact Information" />
  <ContactInformation />
</Theme>
