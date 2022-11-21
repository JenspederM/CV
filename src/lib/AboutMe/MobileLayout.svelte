<script lang="ts">
  import { onMount } from "svelte";
  import ProfilePicture from "../../assets/Profile.jpeg";
  import Name from "./Name.svelte";
  import SocialMedia from "./SocialMedia.svelte";
</script>

<div
  class="sm:hidden relative flex flex-col flex-grow justify-around w-full h-full items-center"
>
  <div
    class="flex flex-col flex-grow space-y-4 items-center justify-center w-full py-4"
  >
    <div class="h-32 w-32 rounded-full overflow-hidden">
      <img class="object-cover" src={ProfilePicture} alt="Profile" />
    </div>
    <Name />
  </div>
  <SocialMedia class="pb-4" />
</div>
