import jsPDF, { type jsPDFOptions } from "jspdf";
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

interface IOperation {
  doc: DocumentBase;
  operation: string;
  args: any[];
}

class Root {
  private static instance: Root;
  private _stack: IOperation[] = [];
  private _docOptions: jsPDFOptions;
  _doc: jsPDF;

  protected constructor() {}

  public static getInstance(docOptions?: jsPDFOptions): Root {
    if (!Root.instance) {
      Root.instance = new Root();
      Root.instance._docOptions = docOptions;
      Root.instance._doc = new jsPDF(docOptions);
      Root.instance._stack = [];
    }
    return Root.instance;
  }

  regenerateDoc(): void {
    Root.instance._doc = new jsPDF(Root.instance._docOptions);
  }

  pushToStack(operation: IOperation): void {
    Root.instance._stack.push(operation);
  }

  get stack(): IOperation[] {
    return Root.instance._stack;
  }

  clearStack(): void {
    Root.instance._stack = [];
  }
}

export class DocumentBase {
  name: string;
  private _root: Root;
  protected _parent: Document;
  protected cursor: IDocCursor;
  protected margin: Margin;
  protected logger: Logger;
  protected theme: ITheme = DEFAULT_THEME;
  protected darkMode: boolean = false;
  protected children: Document[];

  constructor(
    theme: ITheme = DEFAULT_THEME,
    margin: Margin = Margin.small(),
    name: string = "DocumentBase",
    darkMode: boolean = false,
    docOptions: jsPDFOptions = {
      orientation: "portrait",
      unit: "px",
      format: [theme.width, theme.height],
      precision: 1,
      floatPrecision: "smart",
    }
  ) {
    this._root = Root.getInstance(docOptions);
    this.name = name;
    this.theme = Object.assign({}, DEFAULT_THEME, theme);
    this.margin = margin;
    this.children = [];
    this.darkMode = darkMode;
    this.cursor = { x: 0, y: 0 };
    this.logger = new Logger(name);
    this.logger.debug(`Created new document: '${this.name}'`, "constructor");
    this.logger.debug(`Theme: ${JSON.stringify(this.theme)}`, "constructor");
    this.logger.debug(`Margin: ${JSON.stringify(this.margin)}`, "constructor");
    this.logger.debug(`Dark mode: ${this.darkMode}`, "constructor");
    this.logger.debug(`Cursor: ${JSON.stringify(this.cursor)}`, "constructor");
  }

  protected get root(): Root {
    return this._root;
  }

  protected get doc(): jsPDF {
    return this._root._doc;
  }

  protected get parent(): Document {
    return this._parent;
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

  protected pushToStack(op: IOperation): void {
    this._root.pushToStack(op);
  }

  protected executeStack() {
    this._root.regenerateDoc();
    let fullStack = this._root.stack;
    this.logger.debug(
      `Executing stack: ${JSON.stringify(
        fullStack.map((op) => {
          return { name: op.doc.name, operation: op.operation };
        })
      )}`,
      "executeStack"
    );

    const defaults = this._getDefaults();
    for (const op of fullStack) {
      this.logger.debug(
        `Executing operation: ${op.operation} on ${op.doc.name}`,
        "executeStack"
      );
      op.doc[op.operation](...op.args);
      this._setDefaults(defaults);
    }
    return this;
  }

  private _getDefaults(): IDefaults {
    this.logger.debug(`Getting defaults`, "_getDefaults");
    return {
      fontSize: this.doc.getFontSize(),
      font: this.doc.getFont(),
      textColor: this.doc.getTextColor(),
      fillColor: this.doc.getFillColor(),
    };
  }

  private _setDefaults({ fontSize, font, textColor, fillColor }): IDefaults {
    this.logger.debug(`Setting defaults`, "_setDefaults");
    this.doc.setFontSize(fontSize);
    this.doc.setFont(font.fontName, font.fontStyle);
    this.doc.setTextColor(textColor);
    this.doc.setFillColor(fillColor);
    return { fontSize, font, textColor, fillColor };
  }

  get isDarkMode(): boolean {
    return this._parent ? this._parent.isDarkMode : this.darkMode;
  }

  adjustCursor(x: number, y: number) {
    this.logger.debug(
      `Adjusting cursor on ${this.name} from ${this.cursor.x}, ${this.cursor.y} to ${x}, ${y}`,
      "adjustCursor"
    );
    this.cursor.x += x;
    this.cursor.y += y;
    return this;
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
    this.executeStack();
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
  constructor(
    theme: ITheme = DEFAULT_THEME,
    margin: Margin = Margin.small(),
    darkMode: boolean = false,
    name: string = "DocumentDrawer"
  ) {
    super(theme, margin, name, darkMode);
  }

  setBackground({
    color = "primary",
  }: {
    color?: "primary" | "secondary" | string;
  } = {}) {
    this.logger.debug(
      `Setting background to '${color}' at (${this.cursor.x}, ${this.cursor.y})`,
      "setBackground"
    );
    this.pushToStack({
      doc: this,
      operation: "_setBackground",
      args: [
        {
          color: color,
        },
      ],
    });
    return this;
  }

  protected _setBackground({ color = "white" }: { color: string }) {
    this.logger.debug(
      `Setting background to '${color}' at (${this.cursor.x}, ${this.cursor.y})`,
      "_setBackground"
    );
    this.setFillColor(this._getColor({ type: "background", color: color }));
    this.doc?.rect(
      this.cursor.x + this.margin.left,
      this.cursor.y + this.margin.top,
      this.width - this.margin.x,
      this.height - this.margin.y,
      "F"
    );
    return this;
  }

  addRect({
    x = 0,
    y = 0,
    width = undefined,
    height = undefined,
    color = undefined,
    round = undefined,
  }: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    color?: string;
    round?: number;
  }) {
    this.pushToStack({
      doc: this,
      operation: "_addRect",
      args: [
        {
          x: x,
          y: y,
          width: width,
          height: height,
          color: color,
          round: round,
        },
      ],
    });

    return this;
  }

  protected _addRect({
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
    color?: string;
    round?: number;
  }) {
    let xPos = this.cursor.x + x;
    let yPos = this.cursor.y + y;
    let tallestElement = 0;

    if (xPos + width > this.maxWidth) {
      console.warn("Element is too wide to fit on page");
      this.root.stack.forEach((op) => {
        if (op.operation !== "_setBackground") {
          const rect = op.args[0];
          if (rect.y + rect.height > tallestElement) {
            tallestElement = rect.y + rect.height;
          }
        }
      });
      console.log("Tallest element", tallestElement);

      yPos = this.cursor.y + tallestElement + this.margin.top;
      xPos = this.parent.margin.left + this.margin.left;
      //xPos = this._parent.margin.left + this.margin.left;
      //yPos = yPos + tallestElement + this.margin.top;
    }

    if (yPos + height > this.maxHeight) {
      height = this.maxHeight - yPos + this.margin.top;
    }

    if (!width) {
      width = this.maxWidth - xPos + this.margin.left;
    }
    try {
      this.setFillColor(this._getColor({ type: "background", color: color }));
      this.logger.debug(
        `Adding rect (${width}, ${height}) at (${x}, ${y}) with ${JSON.stringify(
          color
        )} color with round '${round}'`,
        "addRect"
      );
      if (round) {
        this.doc?.roundedRect(xPos, yPos, width, height, round, round, "F");
      } else {
        this.doc?.rect(xPos, yPos, width, height, "F");
      }
    } catch (e) {
      new Error(e);
    }

    this.adjustCursor(tallestElement > 0 ? width : width + this.margin.left, 0);
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
}

export class Document extends DocumentDrawer {
  constructor({
    theme = DEFAULT_THEME,
    margin = Margin.small(),
    name = "document",
  }: { theme?: ITheme; margin?: Margin; name?: string } = {}) {
    super(theme, margin, false, name);
  }

  addChild(child: Document) {
    this.logger.debug(`Adding child '${child.name}'`, "addChild");
    child._parent = this;
    this.children.push(child);
    this._adjustChildren();
    return this;
  }

  private _adjustChildren() {
    this.children.forEach((child) => {
      this.logger.debug(`Adjusting '${child.name}'`, "_adjustChildren");

      // Move cursor based on parent's cursor and margin
      child.cursor.x = this.cursor.x + this.margin.left;
      child.cursor.y = this.cursor.y + this.margin.top;

      // Adjust child's width and height based on parent's width and height
      if (child.width > this.maxWidth) {
        const newWidth = this.maxWidth;
        this.logger.debug(
          `Adjusting width of ${child.name} from ${child.width} to ${newWidth}`,
          "_adjustChildren"
        );
        child.theme.width = newWidth;
      }

      if (child.height > this.maxHeight) {
        const newHeight = this.maxHeight;
        this.logger.debug(
          `Adjusting height of ${child.name} from ${child.height} to ${newHeight}`,
          "_adjustChildren"
        );
        child.theme.height = newHeight;
      }

      child._adjustChildren();
    });
  }
}
