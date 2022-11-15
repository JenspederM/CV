<script>
  import Blog from "./lib/Blog.svelte";
  import Projects from "./lib/Projects.svelte";
  import Profile from "./lib/Profile.svelte";
  import Experience from "./lib/Experience.svelte";

  let bp = "lg";
</script>

<div
  class="flex flex-col items-center w-full absolute overflow-auto inset-0 bg-slate-700 p-4"
>
  <div
    class="flex flex-col flex-grow w-full space-y-4 xl:w-3/4 lg:space-y-0 lg:space-x-4 lg:flex-row"
  >
    <Profile class="w-full lg:w-1/3 lg:flex-grow" />
    <Experience />
    <Blog class="lg:hidden" />
    <Projects class="lg:hidden" />
    <div class="hidden lg:flex w-2/3 flex-col space-y-4">
      <Blog class="lg:h-2/5" />
      <Projects class="lg:h-3/5" />
    </div>
  </div>
</div>
