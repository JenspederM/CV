import jsPDF from "jspdf";
import tailwindColors from "tailwindcss/colors";
import tailwindDefaultsTheme from "tailwindcss/defaultTheme";
import Logger from "./logger";
import type { rgbIntensity } from "./types";

const tailwindFontSizes = tailwindDefaultsTheme.fontSize;

class TailwindPDFSingleton {
  private static instance: TailwindPDFSingleton;
  private _doc: jsPDF;
  private _isDarkMode = false;
  private logger: Logger;

  private constructor() {
    if (!TailwindPDFSingleton.instance) {
      this._doc = new jsPDF();
      this.logger = new Logger("TailwindPDFSingleton");
      this.logger.debug(`Creating new instance`, "constructor");
      TailwindPDFSingleton.instance = this;
    }
    return TailwindPDFSingleton.instance;
  }

  public static getInstance() {
    return new TailwindPDFSingleton();
  }

  public get isDarkMode() {
    return this._isDarkMode;
  }

  public get doc() {
    return this._doc;
  }

  public setDarkMode(isDarkMode: boolean) {
    if (typeof isDarkMode === "boolean") {
      this._isDarkMode = isDarkMode;
    } else {
      throw new Error("isDarkMode must be a boolean");
    }
    this._isDarkMode = isDarkMode;
  }
}

export class TailwindPDF {
  instance: TailwindPDFSingleton;
  logger: Logger;
  styler: StyleProvider;

  constructor() {
    this.instance = TailwindPDFSingleton.getInstance();
    this.styler = new StyleProvider(this.instance.doc);
    this.logger = new Logger("TailwindPDF");
  }

  public get isDarkMode() {
    return this.instance.isDarkMode;
  }

  public get doc() {
    return this.instance.doc;
  }

  render(
    { filename, preview }: { filename?: string; preview?: boolean } = {
      filename: "resume",
      preview: false,
    }
  ): void {
    if (preview) {
      this.logger.debug("Rendering preview", "render");
      window.open(this.doc.output("bloburl"), "_blank");
    } else {
      this.logger.debug("Rendering to file", "render");
      if (filename.endsWith(".pdf")) {
        filename = filename.slice(0, -4);
      }
      this.doc.save(`${filename}.pdf`);
    }
  }
}

class StyleProvider {
  private doc: jsPDF;
  logger: Logger;

  constructor(doc: jsPDF) {
    this.doc = doc;
    this.logger = new Logger("StyleProvider");
  }

  public parseClass(style: string) {
    this.logger.debug(`Parsing style '${style}'`, "parseClass");
    const inputStyles = style.split(" ");
    let fontStyles = [];
    let backgroundStyles = [];

    for (let inputStyle of inputStyles) {
      let [parseType, ...rest] = inputStyle.split("-");
      if (parseType === "text" || parseType === "font") {
        fontStyles.push(inputStyle);
      } else if (parseType === "bg") {
        backgroundStyles.push(inputStyle);
      }
    }

    for (let bgStyle of backgroundStyles) {
      let [parseType, ...rest] = bgStyle.split("-");
      if (parseType === "bg") {
        let color = rest.join("-");
        this.setBackground(color);
      }
    }

    const _fontStyle = Object.assign(
      [],
      tailwindFontSizes["base"],
      tailwindFontSizes
    );

    console.log(_fontStyle);

    this.doc.text("Hello world!", this._remToPx(1), this._remToPx(1));

    this.logger.debug(`Font styles: ${fontStyles}`, "parseClass");

    let styles: any = {};
  }

  public setBackground(color: string) {
    this.logger.debug(`Setting background to '${color}'`, "setBackground");
    const current = this.doc.getFillColor();
    this._setFillColor(color);
    this.doc.rect(
      0,
      0,
      this.doc.internal.pageSize.getWidth(),
      this.doc.internal.pageSize.getHeight(),
      "F"
    );
    this.doc.setFillColor(current);
  }

  public addText(text: string, fontStyle: any) {
    this.doc.text(text, this._remToPx(1), this._remToPx(1));
  }

  private _setFillColor(color: string | rgbIntensity) {
    let _color = color;
    if (typeof _color === "string") {
      _color = this._getColorIntesity(_color);
    }
    this.logger.debug(`Setting fill color to [${_color}]`, "setFillColor");
    // setTextColor applies wrong RGB values when numbers are passed,
    // but correct ones when transformed to a string between 0 and 1.
    /* @ts-ignore */
    this.doc.setFillColor(..._color);
  }

  private _setTextColor(color: string | rgbIntensity) {
    let _color = color;
    if (typeof _color === "string") {
      _color = this._getColorIntesity(_color);
    }
    this.logger.debug(`Setting text color to [${_color}]`, "setTextColor");
    // setTextColor applies wrong RGB values when numbers are passed,
    // but correct ones when transformed to a string between 0 and 1.
    /* @ts-ignore */
    this.doc.setTextColor(..._color);
  }

  private _getColorIntesity(color: string): rgbIntensity {
    const twColor = this._getTailwindColor(color);
    const intensity = this._hexToIntensity(twColor);
    this.logger.debug(
      `Color intensity for '${color}' = [${intensity}]`,
      "_getColorIntesity"
    );
    return intensity;
  }

  private _getTailwindColor(color: string, defaultIntensity = 400): string {
    let split = color.split("-");
    let colorName = split[0];
    let colorIntensity = split[1] || defaultIntensity;
    const twColor =
      colorName === "white" || colorName === "black"
        ? tailwindColors[colorName]
        : tailwindColors[colorName][colorIntensity];
    this.logger.debug(
      `Getting tailwind color '${color}' = '${twColor}'`,
      "_getTailwindColor"
    );
    return twColor;
  }

  private _hexToIntensity(hex: string): rgbIntensity {
    if (hex.startsWith("#")) {
      hex = hex.slice(1);
    }
    if (hex.length == 3) {
      hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }
    if (hex.length != 6) {
      throw "Only six-digit hex colors are allowed.";
    }
    let rgbHex = hex.match(/.{1,2}/g);
    let rbg = [
      parseInt(rgbHex[0], 16),
      parseInt(rgbHex[1], 16),
      parseInt(rgbHex[2], 16),
    ];
    let rgbIntensity: rgbIntensity = [
      `${rbg[0] / 255}`,
      `${rbg[1] / 255}`,
      `${rbg[2] / 255}`,
    ];
    this.logger.debug(
      `Getting hex to intensity for '#${hex}' = [${rgbIntensity}]`,
      "_hexToIntensity"
    );
    return rgbIntensity;
  }

  private _remToPx(rem: number | string): number {
    if (typeof rem === "string") {
      if (rem.endsWith("rem")) {
        rem = parseFloat(rem.slice(0, -3));
      } else {
        rem = parseFloat(rem);
      }
    }
    return rem * 16;
  }
}

interface IDivStyle {
  width?: number;
  height?: number;
  padding?: number[];
  margin?: number[];
  border?: number[];
  background?: string;
  font?: {
    family?: string;
    style?: string;
    weight?: string;
    size?: number;
  };
}

class Div {
  private doc: TailwindPDF;
  private parent: Div;
  protected children: Div[];
  class: string;
  content: string;
  logger: Logger;

  constructor({ className }: { className: string }) {
    this.class = className;
    this.children = [];
    this.content = "";
    this.logger = new Logger("Div");
  }

  get minWidth(): number {
    return this.children.reduce((acc, child) => {
      return acc + child.minWidth;
    }, 0);
  }

  get minHeight(): number {
    return this.children.reduce((acc, child) => {
      return acc + child.minHeight;
    }, 0);
  }

  get maxWidth(): number {
    return -1;
  }

  get maxHeight(): number {
    return -1;
  }
}
