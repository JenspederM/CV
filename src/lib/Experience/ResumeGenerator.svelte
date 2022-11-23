<script lang="ts">
  import { Section, Margin } from "../../resume-generator";

  const resume = new Section().setMargin(
    new Margin({ top: 0, bottom: 0, left: 0, right: 0 })
  );

  const sidebar = new Section(resume)
    .setSize({ width: 200, height: 842 })
    .setMargin(Margin.large())
    .setBackgroundColor("slate-700");

  const contact = new Section(sidebar, { width: 200, height: 200 })
    .setMargin(Margin.medium())
    .setBackgroundColor("slate-800", 4)
    .addText({
      text: "Jens Peder Meldgaard",
      fontSize: 18,
      align: "center",
      color: "gray-300",
      background: "white",
    })
    .addText({
      text: "Jack of All Trades",
      fontSize: 12,
      align: "center",
      color: "gray-300",
      background: "gray-400",
    });

  const content = new Section(resume)
    .setSize()
    .setMargin(Margin.medium())
    .setOffset({ x: 200 })
    .setBackgroundColor("gray-800");

  const brands = [
    { icon: "\uf09b", url: "www.github.com/jenspederm" },
    { icon: "\uf08c", url: "www.linkedin.com/in/jenspederm" },
    { icon: "\uf099", url: "www.twitter.com/Peder0202" },
  ];

  const download = () => {
    // Set Default Font

    /*
    resume.doc.line(
      resume._getDynamicWidth(30),
      resume.defaults.margins.top,
      resume._getDynamicWidth(30),
      resume.defaults.height - resume.defaults.margins.bottom
    );

    resume.drawTextBubble(
      ["Jens Peder Meldgaard"],
      resume.defaults.margins.left + resume.defaults.margins.left,
      resume.defaults.margins.top + resume.defaults.margins.top,
      "black",
      false,
      "S"
    );

    */

    // Add Header
    /*
    resume.drawTextBubble(
      [
        "Jens Peder Meldgaard",
        "DevOps Engineer",
        "Data Scientist",
        "Fullstack Developer",
        "Another thing",
        "A third thing",
      ],
      resume.defaults.outerMargins.left,
      16,
      "white",
      true,
      "S",
      { align: "center", maxWidth: 0 }
    );
    */

    // Add Social Media Icons
    /*
    brands.forEach((brand, index) => {
      resume.addIcon({
        icon: brand.icon,
        x: resume.defaults.width - 32 - 16 * (index + 1),
        y: 24,
        linkOptions: {
          url: brand.url,
          baseline: "top",
        },
      });
    });
    */

    // Save PDF
    //resume.generate();

    resume.render({ preview: true });
    //resume.doc.output("pdfobjectnewwindow");
  };
</script>

<button
  class="py-2 px-4 text-xs bg-gray-600 hover:bg-gray-500 rounded-lg"
  on:click={() => download()}
>
  Download Resume
</button>
