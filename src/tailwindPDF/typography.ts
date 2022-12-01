import type jsPDF from "jspdf";
import { getLogger } from "./logging";
import tailwindDefaults from "tailwindcss/defaultTheme";
import { rem2px } from "src/tailwindPDF/utils";

const logger = getLogger("Typography");

const typographyTokens = [
  "font-sans",
  "font-serif",
  "font-mono",
  "text-xs",
  "text-sm",
  "text-base",
  "text-lg",
  "text-xl",
  "text-2xl",
  "text-3xl",
  "text-4xl",
  "text-5xl",
  "text-6xl",
  "text-7xl",
  "text-8xl",
  "text-9xl",
  "font-thin",
  "font-extralight",
  "font-light",
  "font-normal",
  "font-medium",
  "font-semibold",
  "font-bold",
  "font-extrabold",
  "font-black",
];

export const getTypographyTokens = (tokens: string[]) => {
  return Array.from(tokens).filter((token) => typographyTokens.includes(token));
};

export const resolveTypographyTokens = (doc: jsPDF, tokens: string[]) => {
  const current = {
    fontName: doc.getFont().fontName,
    fontStyle: doc.getFont().fontStyle,
    fontSie: doc.getFontSize(),
  };

  const future = {};
};

export const applyTextStyles = (doc: jsPDF, style: string) => {
  if (!style.startsWith("text-")) {
    return;
  }

  let fontSize;
  let lineHeight;

  const split = style.split("-");

  if (Object.keys(tailwindDefaults.fontSize).includes(split[1])) {
    [fontSize, lineHeight] = tailwindDefaults.fontSize[split[1]];
    fontSize = rem2px(fontSize);
    lineHeight = rem2px(lineHeight.lineHeight);

    logger.debug("Setting font size", "applyTextStyles", {
      fontSize: fontSize,
      lineHeight: lineHeight,
      lineHeightFactor: lineHeight / fontSize,
    });

    doc.setFontSize(fontSize);
    doc.setLineHeightFactor(rem2px(lineHeight.lineHeight) / rem2px(fontSize));
  }
};

export const applyFontStyles = (doc: jsPDF, style: string) => {
  if (!style.startsWith("font-") || ["italic", "not-italic"].includes(style)) {
    return;
  }

  const availableFonts = doc.getFontList();
  logger.m("applyFontStyles").debug("Available fonts", availableFonts);

  let fontFamily: string[] = ["Roboto"];
  let fontWeigth: string | number = "400";
  let fontStyle: string = "normal";

  const split = style.split("-");

  if (Object.keys(tailwindDefaults.fontWeight).includes(split[1])) {
    fontWeigth = tailwindDefaults.fontWeight[split[1]];
  }

  if (Object.keys(tailwindDefaults.fontFamily).includes(split[1])) {
    fontFamily = tailwindDefaults.fontFamily[split[1]];
  }

  if (style === "italic") {
    fontStyle = "italic";
  }

  let foundFont = false;
  for (const font of Object.keys(availableFonts)) {
    if (fontFamily.includes(font)) {
      const _fontAlias = `${fontWeigth}${fontStyle}`;
      const availableSizes = availableFonts[font];
      logger.m("applyFontStyles").debug("Found font", {
        availableSizes: availableSizes,
        font: font,
        fontAlias: _fontAlias,
      });
      logger
        .m(applyFontStyles.name)
        .debug("Found font!", { font, fontWeigth, fontStyle, _fontAlias });
      doc.setFont(font, fontStyle, fontWeigth);
      logger
        .m(applyFontStyles.name)
        .debug("Found font!", { font, fontWeigth, fontStyle, _fontAlias })
        .m(applyFontStyles.name)
        .debug("Current font:", doc.getFont());
      foundFont = true;
      break;
    }
  }

  if (!foundFont) {
    logger
      .m(applyFontStyles.name)
      .warn(
        "No font found for",
        JSON.stringify(fontFamily),
        fontWeigth,
        fontStyle
      );
  }

  // _trySetFont(doc, fontFamily, fontStyle, fontWeigth);
};

const _trySetFont = (
  doc: jsPDF,
  fontFamily: string[],
  fontStyle: string,
  fontWeight: string | number
): string => {
  // jdPDF does not support all fonts, and will throw a warning if the font is not found.
  // Since we are not able to "catch" the warning, we temporarily subsitute the console.warn function
  // with a noop function, and restore it after the font is set.
  const originalWarn = console.warn;
  const availableFonts = doc.getFontList();
  const originalFont = doc.getFont();

  logger.debug("Switching from font", "_trySetFont", {
    originalFont: originalFont,
  });

  let assignArgs = [originalFont, fontStyle, fontWeight];
  let succes = false;

  console.warn = (message) => {
    if (message.startsWith("Unable to look up font label for font")) {
      return doc.setFont(originalFont.fontName, originalFont.fontStyle);
    }
    return originalWarn(message);
  };

  fontFamily.forEach((font) => {
    if (Object.keys(availableFonts).includes(font)) {
      console.log("Yaeh! We found a font!", "applyFontStyles", {
        font: font,
        fontStyle: fontStyle,
        fontWeight: fontWeight,
      });
      assignArgs = [font, fontStyle, fontWeight];
      doc.setFont(font, fontStyle, fontWeight);
      if (doc.getFont().fontName === font) {
        succes = true;
      }
    }
  });

  console.warn = originalWarn;

  if (!succes) {
    doc.setFont(originalFont.fontName, originalFont.fontStyle);
    logger.warn("Unable to set font", "_trySetFont", {
      fontFamily: fontFamily,
      fontStyle: fontStyle,
      fontWeight: fontWeight,
    });
  }
  doc.setFont.apply(this, assignArgs);
  return doc.getFont().fontName;
};
