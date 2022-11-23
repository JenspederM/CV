import jsPDF from "jspdf";
import Logger from "./logger";
import Margin from "./margins";
import {
  DEFAULT_THEME,
  type IColorArgs,
  type IDefaults,
  type IDocCursor,
  type ITheme,
  type rgbIntensity,
} from "./types";
import tailwindColors from "tailwindcss/colors";

export class DocumentBase {
  protected doc: jsPDF;
  protected cursor: IDocCursor;
  protected margin: Margin;
  protected children: Document[];
  protected theme: ITheme = DEFAULT_THEME;
  protected darkMode: boolean = false;
  protected logger: Logger = new Logger("DocumentBase");

  constructor(
    theme: ITheme = DEFAULT_THEME,
    margin: Margin = Margin.small(),
    darkMode: boolean = false
  ) {
    this.doc = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [theme.width, theme.height],
      precision: 1,
      floatPrecision: "smart",
    });
    this.cursor = { x: 0, y: 0 };
    this.theme = theme;
    this.margin = margin;
    this.children = [];
    this.darkMode = darkMode;
  }

  protected get width(): number {
    return this.theme.width;
  }

  protected get height(): number {
    return this.theme.height;
  }

  protected get minWidth(): number {
    return (
      this.margin.x +
      this.children.reduce((acc, child) => {
        return acc + child.maxWidth;
      }, 0)
    );
  }

  protected get minHeight(): number {
    return (
      this.margin.y +
      this.children.reduce((acc, child) => {
        return acc + child.maxWidth;
      }, 0)
    );
  }

  protected get maxWidth(): number {
    return this.theme.width - this.margin.x;
  }

  protected get maxHeight(): number {
    return this.theme.height - this.margin.y;
  }

  get isDarkMode(): boolean {
    return this.darkMode;
  }

  setIsDarkMode(value: boolean) {
    this.logger.debug(
      `Setting dark mode to '${value}' from '${this.darkMode}'`,
      "setIsDarkMode"
    );
    this.darkMode = value;
    return this;
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

class DocumentDrawer extends DocumentBase {
  logger = new Logger("DocumentDrawer");

  constructor(
    theme: ITheme = DEFAULT_THEME,
    margin: Margin = Margin.small(),
    darkMode: boolean = false
  ) {
    super(theme, margin, darkMode);
  }

  setBackground({
    color = "primary",
  }: {
    color?: "primary" | "secondary" | string;
  } = {}) {
    this.logger.debug(`Setting background to '${color}'`, "setBackground");
    try {
      this.addRect({
        x: this.cursor.x,
        y: this.cursor.y,
        width: this.width,
        height: this.height,
        color: { type: "background", color: color },
      });
    } catch (e) {
      new Error(e);
    }
    return this;
  }

  addRect({
    x,
    y,
    width = this.maxWidth,
    height = this.maxHeight,
    color = undefined,
    round = undefined,
  }: {
    x: number;
    y: number;
    width?: number;
    height?: number;
    color?: IColorArgs;
    round?: number;
  }) {
    return this.applyWithDefaults(
      new Promise(() => {
        try {
          this.setFillColor(this._getColor(color));
          this.logger.debug(
            `Adding rect (${width}, ${height}) at (${x}, ${y}) with ${JSON.stringify(
              color
            )} color with round '${round}'`,
            "addRect"
          );
          if (round) {
            this.doc?.roundedRect(x, y, width, height, round, round, "F");
          } else {
            this.doc?.rect(x, y, width, height, "F");
          }
        } catch (e) {
          new Error(e);
        }
      })
    );
  }

  private applyWithDefaults(p: Promise<any>) {
    const defaults = this._getDefaults();
    p.then(() => {
      this._setDefaults(defaults);
    });
    return this;
  }

  setFillColor(color: string | rgbIntensity) {
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

  setTextColor(color: string | rgbIntensity) {
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

  private _getColor({ type = undefined, color = "primary" }: IColorArgs) {
    if (color === "primary" || color === "secondary") {
      return this._getThemeColor(type || "background", color);
    } else {
      return this._getColorIntesity(color);
    }
  }

  private _getThemeColor(
    type: string,
    color: "primary" | "secondary" = "primary"
  ): rgbIntensity {
    const mode = this.isDarkMode ? "dark" : "light";

    let themeColor;
    switch (type) {
      case "background":
        themeColor = this.theme.background[color][mode];
        break;
      case "text":
        themeColor = this.theme.textOptions.color[mode];
        break;
      case "border":
        themeColor = this.theme.borderColors[mode];
        break;
      default:
        themeColor = "white";
        break;
    }

    this.logger.debug(
      `Getting theme color '${color} (${mode})' for '${type}' = '${themeColor}'`,
      "_getThemeColor"
    );
    return this._getColorIntesity(themeColor);
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

  private _getDefaults(): IDefaults {
    return {
      fontSize: this.doc.getFontSize(),
      font: this.doc.getFont(),
      textColor: this.doc.getTextColor(),
      fillColor: this.doc.getFillColor(),
    };
  }

  private _setDefaults({ fontSize, font, textColor, fillColor }): IDefaults {
    this.doc.setFontSize(fontSize);
    this.doc.setFont(font.fontName, font.fontStyle);
    this.doc.setTextColor(textColor);
    this.doc.setFillColor(fillColor);
    return { fontSize, font, textColor, fillColor };
  }
}

export class Document extends DocumentDrawer {
  logger = new Logger("Document");
  constructor(theme: ITheme = DEFAULT_THEME, margin: Margin = Margin.small()) {
    super(theme, margin);
  }

  add(child: Document): Document {
    child.cursor.x = this.cursor.x + this.margin.left;
    child.cursor.y = this.cursor.y + this.margin.top;
    child.doc = this.doc;
    this.children.push(child);
    return this;
  }

  remove(child: Document): Document {
    this.children = this.children.filter((c) => c !== child);
    return this;
  }
}
