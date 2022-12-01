<script lang="ts">
  import type { jsPDF, jsPDFOptions } from "jspdf";
  import { afterUpdate } from "svelte";
  import { getLogger } from "../logging";
  import { initializeDoc, traverseDOM } from "..";
  import { onMount } from "svelte";
  import { fontSpecs } from "../fontLoader";

  export let preview = false;
  export let options: jsPDFOptions = {};

  const logger = getLogger("Component");

  let building = false;
  let doc: jsPDF;

  onMount(() => {
    logger.method("onMount").debug("Initializing document");
    logger.m("onMount").debug("Initializing document");
    initializeDoc(options, fontSpecs).then((d) => {
      doc = d;
    });
  });

  afterUpdate(() => {
    logger.method("afterUpdate").debug("Building document");
    const downloadButton = document.getElementById("__tailwindPDFDownload");
    if (downloadButton) {
      logger.debug("Download button found", "afterUpdate");
      downloadButton.addEventListener("click", () => {
        // Traverse the DOM to get and apply styles
        traverseDOM("__tailwindPDF", doc);

        // If preview is true, open the PDF in a new tab
        // Otherwise, download the PDF
        if (preview) {
          logger.debug("Rendering PDF", "previewPDF");
          building = true;
          window.open(doc.output("bloburl"), "_blank");
          building = false;
        } else {
          logger.debug("Rendering PDF", "downloadPDF");
          building = true;
          doc.save("document.pdf");
          building = false;
        }
      });
    }
  });
</script>

{#if $$slots.downloadButton}
  <div id="__tailwindPDFDownload">
    {#if !building}
      <slot name="downloadButton" />
    {:else}
      building...
    {/if}
  </div>
{/if}
<div class={`${$$props.class || ""} hidden`} id="__tailwindPDF">
  <slot />
</div>
