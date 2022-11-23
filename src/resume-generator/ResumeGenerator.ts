import { jsPDF } from "jspdf";
import "../assets/fonts/fa-brands-400-normal";

import Margin from "./Margins";
import Colors from "./Colors";

export default class ResumeGenerator {
  doc: jsPDF;
  defaults: SectionType;

  constructor() {
    this.doc = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [this.defaults.width, this.defaults.height],
      precision: 1,
      floatPrecision: "smart",
    });
  }

  setBackground(color: string) {
    this.drawRect({
      x: 0,
      y: 0,
      w: this.defaults.width,
      h: this.defaults.height,
      color: color,
      style: "F",
    });
  }

  drawRect({ x, y, w, h, color, style = "F", round = null }) {
    console.log("drawRect", x, y, w, h, color, style, round);
    let rgb;

    switch (color) {
      case "black":
        rgb = { r: 0, g: 0, b: 0 };
        break;
      case "gray":
        rgb = { r: 209, g: 213, b: 219 };
        break;
      case "red":
        rgb = { r: 252, g: 165, b: 165 };
        break;
      case "green":
        rgb = { r: 134, g: 239, b: 172 };
        break;
      case "blue":
        rgb = { r: 147, g: 197, b: 253 };
        break;
      default:
        rgb = { r: 255, g: 255, b: 255 };
        break;
    }
    this._setFillColor(rgb.r, rgb.g, rgb.b);
    if (round) {
      this.doc.roundedRect(x, y, w, h, 2, 2, style);
    } else {
      this.doc.rect(x, y, w, h, style);
    }
  }

  addIcon({ icon, x, y, linkOptions = null, size = 16 }) {
    // Get the current font
    const oldFont = this.doc.getFont();
    const oldFontSize = this.doc.getFontSize();

    // Draw the icon
    this.doc.setFont("fa-brands-400");
    this.doc.setFontSize(size);

    if (linkOptions) {
      this.doc.textWithLink(icon, x, y, linkOptions);
    } else {
      this.doc.text(icon, x, y);
    }

    // Reset font
    this.doc.setFont(oldFont.fontName, oldFont.fontStyle);
    this.doc.setFontSize(oldFontSize);
  }

  drawTextBubble(
    text: string | string[],
    x: number,
    y: number,
    color: string,
    round = null,
    style = "F",
    textOptions: { align?: string; maxWidth?: number } = {
      align: "left",
      maxWidth: 0,
    }
  ) {
    const _dim = this._getTextDimensions(text);

    this.drawRect({
      x: x,
      y: y,
      w: _dim.w + this.defaults.margin.x,
      h: _dim.h + this.defaults.margin.y,
      color,
      round,
      style,
    });

    const _maxWidth = Math.min(
      textOptions.maxWidth === 0 ? Infinity : textOptions.maxWidth,
      this.defaults.width
    );

    if (textOptions.align === "center") {
      this.doc.text(
        text,
        x + this.defaults.margin.left + _dim.w / 2,
        y + this.defaults.margin.top + _dim.h,
        {
          baseline: "top",
          align: "center",
          maxWidth: _maxWidth,
        }
      );
    } else if (textOptions.align === "right") {
      this.doc.text(
        text,
        x + this.defaults.margin.left + _dim.w,
        y + this.defaults.margin.top + _dim.h,
        {
          baseline: "top",
          align: "right",
          maxWidth: _maxWidth,
        }
      );
    } else {
      this.doc.text(
        text,
        x + this.defaults.margin.left,
        y + this.defaults.margin.top,
        {
          baseline: "top",
          align: "left",
          maxWidth: _maxWidth,
        }
      );
    }
  }

  _setFillColor(r, g, b) {
    /* @ts-ignore */
    // setFillColor applies wrong RGB values when numbers are passed,
    // but correct ones when transformed to a string between 0 and 1.
    this.doc.setFillColor(`${r / 255}`, `${g / 255}`, `${b / 255}`);
  }

  _getTextDimensions(text: string | string[]) {
    let _h;
    let _dim;
    if (typeof text === "string") {
      _dim = this.doc.getTextDimensions(text, {
        fontSize: this.defaults.fontSize,
        scaleFactor: 1,
      });
      _h = _dim.h * 0.85;
    } else {
      const longest = this._findLongestString(text);
      _dim = this.doc.getTextDimensions(longest, {
        fontSize: this.defaults.fontSize,
        scaleFactor: 1,
      });
      _h = _dim.h * 0.85 * text.length;
    }
    return { w: _dim.w, h: _h };
  }

  _findLongestString(strings: string[]) {
    return strings.reduce((a, b) => (a.length > b.length ? a : b));
  }

  _getDynamicWidth(size) {
    return (size / 100) * this.defaults.width;
  }

  _getDynamicHeight(size) {
    return (size / 100) * this.defaults.height;
  }

  generate(name: string = "resume") {
    if (name.endsWith(".pdf")) {
      name = name.slice(0, -4);
    }
    this.doc.save(`${name}.pdf`);
  }
}
