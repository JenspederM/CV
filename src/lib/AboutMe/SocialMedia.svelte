<script lang="ts">
  import Fa from "svelte-fa";
  import {
    faGithub,
    faLinkedin,
    faTwitter,
  } from "@fortawesome/free-brands-svg-icons";
</script>

<div
  class={`flex space-x-6 justify-center items-center ${$$props.class || ""}`}
>
  <a href="https://github.com/jenspederm"><Fa icon={faGithub} /></a>
  <a href="https://linkedin.com/in/jenspederm"><Fa icon={faLinkedin} /></a>
  <a href="https://twitter.com/peder0202"><Fa icon={faTwitter} /></a>
</div>
