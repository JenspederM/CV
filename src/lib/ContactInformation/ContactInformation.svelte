<script lang="ts">
  import {
    faPhone,
    faEnvelope,
    faHouse,
  } from "@fortawesome/free-solid-svg-icons";
  import ContactDetail from "./ContactDetail.svelte";
  import Box from "../common/Box.svelte";
</script>

<Box
  class="flex flex-col items-center space-y-1 sm:space-y-0 sm:flex-row sm:justify-between"
>
  <a href="tel:+4560964106">
    <ContactDetail faIcon={faPhone} info="(+45) 60 46 91 06" />
  </a>
  <a href="mailto:Jenspederm@gmail.com">
    <ContactDetail faIcon={faEnvelope} info="Jenspederm@gmail.com" />
  </a>
  <div>
    <ContactDetail faIcon={faHouse} info="Copenhagen, Denmark" />
  </div>
</Box>
