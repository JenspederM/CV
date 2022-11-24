<script lang="ts">
  import { Section, Margin, Document } from "../../resume-generator";
  import { isDarkMode } from "../../stores";

  let darkMode: boolean;
  let nPressed = {
    value: 0,
    lastDarkMode: false,
  };
  isDarkMode.subscribe((value) => {
    darkMode = value;
  });

  const brands = [
    { icon: "\uf09b", url: "www.github.com/jenspederm" },
    { icon: "\uf08c", url: "www.linkedin.com/in/jenspederm" },
    { icon: "\uf099", url: "www.twitter.com/Peder0202" },
  ];

  const theme = {
    background: {
      primary: {
        light: "gray-300",
        dark: "gray-700",
      },
      secondary: {
        light: "gray-200",
        dark: "gray-800",
      },
    },
    textOptions: {
      color: {
        light: "gray-300",
        dark: "gray-700",
      },
      font: "Roboto",
      fontSize: 12,
    },
    borderColors: {
      light: "gray-400",
      dark: "gray-600",
    },
    width: 595,
    height: 842,
  };

  const resume = new Document({
    theme: theme,
    margin: Margin.none(),
    name: "root",
  })
    .setIsDarkMode(darkMode)
    .setBackground()
    .addChild(
      new Document({
        theme: theme,
        margin: Margin.large(),
        name: "container",
      })
        .setBackground({
          color: "secondary",
        })
        .addChild(
          new Document({
            theme: theme,
            margin: Margin.medium(),
            name: "sidebar",
          })
            .setBackground({ color: "white" })
            .addChild(
              new Document({
                theme: Object.assign(theme, { width: 200, height: 100 }),
                margin: Margin.medium(),
                name: "test",
              })
                .setBackground({
                  color: "black",
                })
                .addChild(
                  new Document({
                    theme: theme,
                    margin: Margin.small(),
                    name: "name",
                  }).setBackground({ color: "blue-300" })
                )
            )
        )
    );

  const download = () => {
    if (nPressed.value === 0) {
      nPressed.value++;
      nPressed.lastDarkMode = darkMode;
    } else if (nPressed.value > 1 && nPressed.lastDarkMode === darkMode) {
      nPressed.value++;
    } else {
      nPressed.value = 0;
    }

    /*
    const resume = new Section({ theme: theme })
      .setMargin(Margin.medium())
      .setBackgroundColor({ color: "primary", isDarkMode: darkMode });

    const sidebar = new Section({ parent: resume })
      .setSize({ width: 200, height: 842 })
      .setMargin(Margin.large())
      .setBackgroundColor({
        color: "secondary",
        isDarkMode: darkMode,
        round: 4,
      });

    new Section({ parent: sidebar, width: 200, height: 100 })
      .setMargin(Margin.medium())
      .setBackgroundColor({ color: "primary", isDarkMode: darkMode, round: 4 })
      .addText({
        text: ["Jens Peder Meldgaard"],
        fontSize: 18,
        align: "center",
        background: "secondary",
        padding: new Margin({ top: 4, bottom: 4, left: 0 }),
      })
      .addText({
        text: "Jack of All Trades",
        fontSize: 12,
        align: "center",
      });

    const content = new Section({ parent: resume })
      .setMargin(Margin.medium())
      .setOffset({ x: 208 })
      .setBackgroundColor({
        color: "secondary",
        isDarkMode: darkMode,
        round: 4,
      });

      */

    resume.render({ preview: true });

    //resume.render({ preview: true });
  };
</script>

<div class="flex items-center space-x-2">
  <button
    class="py-2 px-4 text-xs bg-gray-600 hover:bg-gray-500 rounded-lg"
    on:click={() => download()}
  >
    Download Resume
  </button>
  <div class="text-xs" hidden={nPressed.value === 0}>
    {`(try switching to ${
      darkMode ? "light" : "dark"
    } mode and download the resume again)`}
  </div>
</div>
