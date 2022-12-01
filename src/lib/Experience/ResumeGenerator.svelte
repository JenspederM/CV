<script lang="ts">
  import TailwindPDF from "../../tailwindPDF/Svelte/index.svelte";
  import { isDarkMode } from "../../stores";

  let darkMode: boolean;

  isDarkMode.subscribe((value) => {
    darkMode = value;
  });
</script>

<div class="flex items-center justify-center space-x-2">
  <TailwindPDF preview bind:darkMode>
    <button slot="downloadButton" class="bg-gray-800 rounded-lg">
      Download
    </button>
    <div class="bg-gray-300 text-black font-sans">This is a test</div>
    <div class="bg-blue-600 text-white text-xs">This is another test</div>
    <div class="bg-blue-600 text-white text-xs">
      This is another another another another another another another another
      another another another another another another another another another
      another another another another another test
    </div>
    <div class="bg-blue-600 text-white">This is another test</div>
    <div class="bg-gray-300 text-black text-right">
      This is a very very very very very very very very very very very very very
      very long string
    </div>
    <div class="bg-gray-300 text-black text-2xl text-justify">
      This is a very very very very very very very very very very very very very
      very long string This is a very very very very very very very very very
      very very very very very long string This is a very very very very very
      very very very very very very very very very long string This is a very
      very very very very very very very very very very very very very long
      string
    </div>
    <div class="bg-gray-300 text-black text-center font-bold">
      This is a very very very very very very very very very very very very very
      very long string This is a very very very very very very very very very
      very very very very very long string This is a very very very very very
      very very very very very very very very very long string This is a very
      very very very very very very very very very very very very very long
      string
    </div>
  </TailwindPDF>
</div>
