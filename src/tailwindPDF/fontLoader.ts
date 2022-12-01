import jsPDF from "jspdf";
import { getLogger } from "./logging";

const logger = getLogger("FontLoader");

export const fontSpecs = [
  { path: "fonts/Roboto/Roboto-Black.ttf", id: "Roboto" },
  { path: "fonts/Roboto/Roboto-BlackItalic.ttf", id: "Roboto" },
  { path: "fonts/Roboto/Roboto-Bold.ttf", id: "Roboto" },
  { path: "fonts/Roboto/Roboto-BoldItalic.ttf", id: "Roboto" },
  { path: "fonts/Roboto/Roboto-Italic.ttf", id: "Roboto" },
  { path: "fonts/Roboto/Roboto-Light.ttf", id: "Roboto" },
  { path: "fonts/Roboto/Roboto-LightItalic.ttf", id: "Roboto" },
  { path: "fonts/Roboto/Roboto-Medium.ttf", id: "Roboto" },
  { path: "fonts/Roboto/Roboto-MediumItalic.ttf", id: "Roboto" },
  { path: "fonts/Roboto/Roboto-Regular.ttf", id: "Roboto" },
  { path: "fonts/Roboto/Roboto-Thin.ttf", id: "Roboto" },
  { path: "fonts/Roboto/Roboto-ThinItalic.ttf", id: "Roboto" },
  { path: "fonts/Noto_Sans/NotoSans-Black.ttf", id: '"Noto Sans"' },
  { path: "fonts/Noto_Sans/NotoSans-BlackItalic.ttf", id: '"Noto Sans"' },
  { path: "fonts/Noto_Sans/NotoSans-Bold.ttf", id: '"Noto Sans"' },
  { path: "fonts/Noto_Sans/NotoSans-BoldItalic.ttf", id: '"Noto Sans"' },
  { path: "fonts/Noto_Sans/NotoSans-ExtraBold.ttf", id: '"Noto Sans"' },
  { path: "fonts/Noto_Sans/NotoSans-ExtraBoldItalic.ttf", id: '"Noto Sans"' },
  { path: "fonts/Noto_Sans/NotoSans-ExtraLight.ttf", id: '"Noto Sans"' },
  { path: "fonts/Noto_Sans/NotoSans-ExtraLightItalic.ttf", id: '"Noto Sans"' },
  { path: "fonts/Noto_Sans/NotoSans-Italic.ttf", id: '"Noto Sans"' },
  { path: "fonts/Noto_Sans/NotoSans-Light.ttf", id: '"Noto Sans"' },
  { path: "fonts/Noto_Sans/NotoSans-LightItalic.ttf", id: '"Noto Sans"' },
  { path: "fonts/Noto_Sans/NotoSans-Medium.ttf", id: '"Noto Sans"' },
  { path: "fonts/Noto_Sans/NotoSans-MediumItalic.ttf", id: '"Noto Sans"' },
  { path: "fonts/Noto_Sans/NotoSans-Regular.ttf", id: '"Noto Sans"' },
  { path: "fonts/Noto_Sans/NotoSans-SemiBold.ttf", id: '"Noto Sans"' },
  { path: "fonts/Noto_Sans/NotoSans-SemiBoldItalic.ttf", id: '"Noto Sans"' },
  { path: "fonts/Noto_Sans/NotoSans-Thin.ttf", id: '"Noto Sans"' },
  { path: "fonts/Noto_Sans/NotoSans-ThinItalic.ttf", id: '"Noto Sans"' },
];

export interface IGoogleFontSpec {
  path: string;
  id: string;
}

const _arrayBufferToBase64 = (buffer) => {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const loadFont = async (spec: IGoogleFontSpec) => {
  // logger.m(loadFont.name).debug("Loading font", spec);
  const weightMap = {
    thin: "100",
    extralight: "200",
    light: "300",
    normal: "400",
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  };
  const postScriptName = spec.path.split("/").pop();
  const tmp = postScriptName
    .split("-")[1]
    .split(".")[0]
    .split(/(?=[A-Z])/);
  const lastElement = tmp.pop();
  let style = "normal";
  if (lastElement.toLowerCase() === "italic") {
    style = "italic" === lastElement.toLowerCase() ? "italic" : "normal";
  } else {
    tmp.push(lastElement);
  }

  const weight = tmp.join("")?.toLowerCase();

  const fontData = await fetch(spec.path)
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      return _arrayBufferToBase64(buffer);
    });

  const result = {
    path: spec.path,
    name: postScriptName,
    id: spec.id,
    weight: weightMap[weight.toLowerCase().trim()] || "400",
    style: style,
    data: fontData,
  };

  // logger.m(loadFont.name).debug("Loaded font", result);

  return result;
};

export const loadFontsV2 = (fontSpecs: IGoogleFontSpec[]) => {
  const fontPromises = fontSpecs.map((spec) => {
    return loadFont(spec).then((font) => {
      var callAddFont = function () {
        this.addFileToVFS(font.name, font.data);
        this.addFont(font.name, font.id, font.style, font.weight);
        this.addFont(font.name, font.id.toLowerCase(), font.style, font.weight);
      };
      jsPDF.API.events.push(["addFonts", callAddFont]);
      return font;
    });
  });

  return Promise.all(fontPromises);
};

export const loadFonts = async (fontSpecs: IGoogleFontSpec[]) => {
  const fontPromises = fontSpecs.map((font) => loadFont(font));
  const fonts = await Promise.all(fontPromises);

  return fonts;
};
