<script lang="ts">
  import { jsPDF } from "jspdf";
  import "../fonts/fa-brands-400-normal";

  const PAGE_WIDTH = 595;
  const PAGE_HEIGHT = 842;
  const DEF_FONT_SIZE = 12;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [PAGE_WIDTH, PAGE_HEIGHT],
    precision: 1,
    floatPrecision: "smart",
  });

  const brands = [
    { icon: "\uf09b", url: "www.github.com/jenspederm" },
    { icon: "\uf08c", url: "www.linkedin.com/in/jenspederm" },
    { icon: "\uf099", url: "www.twitter.com/Peder0202" },
  ];

  doc.setFontSize(10);

  const drawRect = (x, y, w, h, color, round = null) => {
    switch (color) {
      case "black":
        doc.setFillColor(0, 0, 0);
        break;
      case "gray":
        doc.setFillColor(209, 213, 219);
        break;
      case "red":
        doc.setFillColor(255, 0, 0);
        break;
      case "green":
        doc.setFillColor(0, 255, 0);
        break;
      case "blue":
        doc.setFillColor(0, 0, 255);
        break;
      default:
        doc.setFillColor(255, 255, 255);
        break;
    }
    if (round) {
      doc.roundedRect(x, y, w, h, 2, 2, "F");
    } else {
      doc.rect(x, y, w, h, "F");
    }
  };

  const download = () => {
    // Set Default Font
    doc.setFontSize(DEF_FONT_SIZE);

    // Add Background
    drawRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "gray");

    // Add Header
    drawRect(32, 16, PAGE_WIDTH - 32 * 2, 56, "white", true);
    doc.text(
      [
        "Jens Peder Meldgaard",
        "DevOps Engineer",
        "Data Scientist",
        "Fullstack Developer",
      ],
      48,
      24,
      { baseline: "top" }
    );
    doc.setFont("fa-brands-400");

    // Add Social Media Icons
    doc.setFontSize(16);
    brands.forEach((brand, index) => {
      doc.textWithLink(brand.icon, PAGE_WIDTH - 56 - index * 24, 24, {
        url: brand.url,
        baseline: "top",
      });
    });
    doc.setFontSize(DEF_FONT_SIZE);

    // Save PDF
    doc.save("resume.pdf");
  };
</script>

<button
  class="py-2 px-4 text-xs bg-gray-600 hover:bg-gray-500 rounded-lg"
  on:click={() => download()}
>
  Download Resume
</button>
