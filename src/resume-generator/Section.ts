import Margin from "./margins";
import tailwindColors from "tailwindcss/colors";
import { type ITheme, type IDocCursor, DEFAULT_THEME } from "./types";
import jsPDF from "jspdf";

export default class Section {
  protected parent?: Section;
  protected doc: jsPDF;
  protected cursor: IDocCursor = { x: 0, y: 0 };
  theme: ITheme;
  fontSize: number;
  margin: Margin;
  spacing: number;
  _width: number;
  _height: number;
  _offsetX: number;
  _offsetY: number;

  constructor({
    parent = undefined,
    width = 595,
    height = 842,
    fontSize = 12,
    margin = new Margin(),
    spacing = 8,
    offsetX = 0,
    offsetY = 0,
    theme = DEFAULT_THEME,
  } = {}) {
    this.theme = theme;
    this.doc = this._constructDoc(width, height);
    if (parent) {
      this.setParent(parent);
    }
    this._offsetX = offsetX;
    this._offsetY = offsetY;
    this.fontSize = fontSize;
    this.margin = margin;
    this.spacing = spacing;
    this._height = height;
    this._width = width;
  }

  get x(): number {
    return this.parent
      ? this.parent.x + this.parent.margin.left + this._offsetX
      : 0 + this._offsetX;
  }

  get y(): number {
    return this.parent
      ? this.parent.y + this.parent.margin.top + this._offsetY
      : 0 + this._offsetY;
  }

  get width(): number {
    return this.parent
      ? Math.min(
          this._width,
          this.parent._width - this.parent.margin.x - this._offsetX
        )
      : this._width - this._offsetX;
  }

  get maxWidth(): number {
    return this.width - this.margin.x;
  }

  get height(): number {
    return this.parent
      ? Math.min(
          this._height,
          this.parent._height - this.parent.margin.y - this._offsetY
        )
      : this._height - this._offsetY;
  }

  get maxHeigth(): number {
    return this.height - this.margin.y;
  }

  setParent(parent: Section): Section {
    this.parent = parent;
    this.doc = parent.doc;
    this.theme = parent.theme;
    return this;
  }

  setOffset({ x = 0, y = 0 } = {}): Section {
    this._offsetX = x;
    this._offsetY = y;
    return this;
  }

  setSize({
    width = 595,
    height = 842,
  }: {
    width?: number;
    height?: number;
  } = {}): Section {
    if (!this.parent) {
      this.doc = this._constructDoc(width, height);
    } else {
      this._width = width;
      this._height = height;
    }
    return this;
  }

  setFontSize(size: number): this {
    this.fontSize = size;
    this.doc.setFontSize(size);
    return this;
  }

  setBackgroundColor(
    {
      color,
      isDarkMode,
      round,
    }: {
      color: "primary" | "secondary";
      isDarkMode?: boolean;
      round?: number;
    } = {
      color: "primary",
      isDarkMode: false,
      round: undefined,
    }
  ): Section {
    const COLOR = this.theme.background[color][isDarkMode ? "dark" : "light"];
    return this.addRect({
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      color: this._getThemeColor("background", color, isDarkMode),
      round: round,
    });
  }

  _getThemeColor(type: string, color: string, isDarkMode: boolean): string {
    switch (type) {
      case "background":
        return this.theme.background[color][isDarkMode ? "dark" : "light"];
      case "text":
        return this.theme.textOptions.color[isDarkMode ? "dark" : "light"];
      case "border":
        return this.theme.borderColors[isDarkMode ? "dark" : "light"];
      default:
        return "white";
    }
  }

  addRect(
    {
      x,
      y,
      width,
      height,
      color,
      round,
    }: {
      x: number;
      y: number;
      width: number;
      height: number;
      color?: string;
      round?: number;
    } = {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      color: undefined,
      round: undefined,
    }
  ): Section {
    const _defaults = this._getDefaults();
    console.log("addRect", x, y, width, height, color, round);
    if (color) {
      this.setFillColor(color);
    }
    if (round) {
      this.doc?.roundedRect(x, y, width, height, round, round, "F");
    } else {
      this.doc?.rect(x, y, width, height, "F");
    }
    this._resetDefaults(_defaults);
    return this;
  }

  setMargin(margin: Margin): Section {
    this.margin = margin;
    return this;
  }

  addIcon({ icon, x, y, linkOptions = null, size = 16 }) {
    const _defaults = this._getDefaults();

    // Draw the icon
    this.doc.setFont("fa-brands-400");
    this.doc.setFontSize(size);

    if (linkOptions) {
      this.doc.textWithLink(icon, x, y, linkOptions);
    } else {
      this.doc.text(icon, x, y);
    }

    // Reset font
    this._resetDefaults(_defaults);
  }

  addText(
    {
      text,
      align = "left",
      fontSize = 12,
      offsetX = 0,
      offsetY = 0,
      color,
      background,
      padding = new Margin({ top: 0, right: 0, bottom: 0, left: 0 }),
    }: {
      text: string | string[];
      align?: "left" | "center" | "right" | "justify";
      fontSize?: number;
      offsetX?: number;
      offsetY?: number;
      color?: string;
      background?: string;
      padding?: Margin;
    } = { text: "", align: "left" }
  ): Section {
    const _defaults = this._getDefaults();
    const { _x, _y } = this._getTextOffsets(offsetX, offsetY, align);
    if (background) {
      const bgDim = this._getTextDimensions(text, fontSize);
      if (background === "primary" || background === "secondary") {
        background = this._getThemeColor("background", background, false);
      }
      this.addRect({
        x: _x - this._valueOrMaxWidth(bgDim.w) / 2 - padding.left,
        y: _y,
        width: this._valueOrMaxWidth(bgDim.w) + padding.left + padding.right,
        height: this._valueOrMaxHeight(bgDim.h) + padding.top + padding.bottom,
        color: background,
        round: 4,
      });
    }

    let textColor;
    if (!color) {
      textColor = this._getThemeColor("text", "primary", false);
    }

    this.doc.setTextColor(this.getColor(textColor));
    this.doc.setFontSize(fontSize);

    this.doc.text(text, _x, _y + padding.top, {
      baseline: "top",
      maxWidth: this.maxWidth,
      align: align,
    });
    this.cursor.y += _y + padding.top + padding.bottom;
    this._resetDefaults(_defaults);
    console.log("addText", text, textColor, color);
    return this;
  }

  _valueOrMaxWidth(value: number): number {
    return value > this.maxWidth ? this.maxWidth : value;
  }

  _valueOrMaxHeight(value: number): number {
    return value > this.maxHeigth ? this.maxHeigth : value;
  }

  _getTextDimensions(
    text: string | string[],
    fontSize: number = this.fontSize
  ): { w: number; h: number } {
    let _h;
    let _dim;
    if (typeof text === "string") {
      _dim = this.doc.getTextDimensions(text, {
        fontSize: fontSize,
        scaleFactor: 1,
      });
      _h = _dim.h * 0.85;
    } else {
      const longest = text.reduce((a, b) => (a.length > b.length ? a : b));
      _dim = this.doc.getTextDimensions(longest, {
        fontSize: fontSize,
        scaleFactor: 1,
      });
      _h = _dim.h * 0.85 * text.length;
    }
    return { w: _dim.w, h: _h };
  }

  _getDefaults() {
    const color = this.doc.getFillColor();
    const font = this.doc.getFont();
    const fontSize = this.doc.getFontSize();
    const textColor = this.doc.getTextColor();
    return { color, font, fontSize, textColor };
  }

  _resetDefaults({ color, font, fontSize, textColor }) {
    this.doc.setFillColor(color);
    this.doc.setFont(font.fontName, font.fontStyle);
    this.doc.setFontSize(fontSize);
    this.doc.setTextColor(textColor);
  }

  _getTextOffsets(offsetX, offsetY, align) {
    console.log("_getTextOffsets", offsetX, offsetY, align);
    const _y =
      this.y +
      this.cursor.y +
      offsetY +
      (this.cursor.y === 0 ? this.margin.top : 0);
    let _x;
    switch (align) {
      case "left":
        _x = this.x + offsetX + this.margin.left;
        break;
      case "center":
        _x = this.x + offsetX + this.width / 2;
        break;
      case "right":
        _x = this.x + offsetX + this.width - this.margin.right;
        break;
      case "justify":
        _x = this.x + offsetX + this.margin.left;
        break;
    }

    return { _x, _y };
  }

  render(
    { filename, preview }: { filename?: string; preview?: boolean } = {
      filename: "resume",
      preview: false,
    }
  ): void {
    if (preview) {
      window.open(this.doc.output("bloburl"), "_blank");
    } else {
      if (filename.endsWith(".pdf")) {
        filename = filename.slice(0, -4);
      }
      this.doc.save(`${filename}.pdf`);
    }
  }

  private _constructDoc(width: number, height: number): jsPDF {
    return new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [width, height],
      precision: 1,
      floatPrecision: "smart",
    });
  }

  setFillColor = (color: string) => {
    const hex = this.getColor(color);
    const rgb = this.hexToRGB(hex);
    // setTextColor applies wrong RGB values when numbers are passed,
    // but correct ones when transformed to a string between 0 and 1.
    /* @ts-ignore */
    this.doc.setFillColor(rgb[0], rgb[1], rgb[2]);
  };

  setTextColor = (color: string) => {
    const hex = this.getColor(color);
    const rgb = this.hexToRGB(hex);
    // setTextColor applies wrong RGB values when numbers are passed,
    // but correct ones when transformed to a string between 0 and 1.
    /* @ts-ignore */
    this.doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  };

  getColor = (name, intensity = 400): string => {
    let split = name.split("-");
    let colorName = split[0];
    let colorIntensity = split[1] || intensity;
    const hex =
      colorName === "white" || colorName === "black"
        ? tailwindColors[colorName]
        : tailwindColors[colorName][colorIntensity];
    console.debug("getColor", name, colorName, colorIntensity, hex);
    return hex;
  };

  hexToRGB = (hex: string) => {
    if (hex.startsWith("#")) {
      hex = hex.slice(1);
    }
    if (hex.length == 3) {
      hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }
    if (hex.length != 6) {
      throw "Only six-digit hex colors are allowed.";
    }
    var rgbHex = hex.match(/.{1,2}/g);
    var rbg = [
      parseInt(rgbHex[0], 16),
      parseInt(rgbHex[1], 16),
      parseInt(rgbHex[2], 16),
    ];
    let rgbIntensity = [
      `${rbg[0] / 255}`,
      `${rbg[1] / 255}`,
      `${rbg[2] / 255}`,
    ];
    console.debug("hexToRGB", hex, rgbHex, rbg, rgbIntensity);
    return rgbIntensity;
  };
}
