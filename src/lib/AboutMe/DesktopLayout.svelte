<script lang="ts">
  import SocialMedia from "./SocialMedia.svelte";
  import Name from "./Name.svelte";
  import ProfilePicture from "../../assets/Profile.jpeg";
</script>

<div class="sm:flex hidden">
  <!-- Left Section (large or higher) -->
  <div class="w-1/2 xl:w-1/3">
    <img class="object-fill" src={ProfilePicture} alt="Profile" />
  </div>

  <!-- Right Section -->
  <div class="flex flex-col w-full space-y-4 text-center p-4">
    <Name class="flex-grow" />
    <SocialMedia />
  </div>
</div>
