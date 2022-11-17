<script lang="ts">
  let xp = {
    picture: "../assets/velux_logo_600x300.png",
    period: "2019 - 2021",
    title: "Data Scientist",
    company: "Velux A/S",
    location: "Denmark",
    description:
      "During my time, I have developed core functionalities for the Velux IoT platform and configured and deployed Confluent Kafka for Velux globally. My final position in Velux was as Team Lead for Velux Supply Data, where I was responsible for the data pipelines and data lake structure for all data related the Velux IoT platform.",
    technogolies: [
      "Python",
      "Spark",
      "DeltaTable",
      "DataBricks",
      "Kafka",
      "Azure Cloud",
      "Kubernetes",
      "Docker",
      "JS/TS",
      "Vue",
      "R",
    ],
  };

  const getImageUrl = (name: string) => {
    return new URL(name, import.meta.url).href;
  };
</script>

<div class={`${$$props.class || ""}`}>
  <div class="space-y-2">
    <div class="flex items-center justify-center w-full">
      <img
        src={getImageUrl(xp.picture)}
        class="w-4/12 sm:w-2/12 object-contain"
        alt="velux logo"
      />
    </div>
    <div class="flex space-x-4">
      <div class="flex flex-col w-1/3 items-center justify-center">
        <div class="text-xs font-bold">{xp.period}</div>
        <div class="text-xs font-normal text-gray-300">{xp.title}</div>
        <div class="text-xs font-normal text-gray-300">{xp.company}</div>
        <div class="text-xs font-normal text-gray-300">{xp.location}</div>
      </div>
      <div
        class="flex flex-col flex-grow justify-center items-center w-2/3 font-normal text-xs"
      >
        {xp.description}
      </div>
    </div>
    <hr />
    <div>
      <div class="text-xs">Technologies by usage:</div>
      <div class="text-xs font-extralight italic">
        {xp.technogolies.join(", ")}
      </div>
    </div>
  </div>
</div>
