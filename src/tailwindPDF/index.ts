import jsPDF from "jspdf";
import type { jsPDFOptions } from "jspdf";
import logger from "./logging";
import {
  applyTextStyles,
  applyFontStyles,
  getTypographyTokens,
} from "./typography";
import { traverseDOM } from "./traverseDOM";
import { loadFonts, loadFontsV2, type IGoogleFontSpec } from "./fontLoader";

export {
  applyTextStyles,
  applyFontStyles,
  getTypographyTokens,
  initializeDoc,
  traverseDOM,
};

// const logger = new Logger("tailwindPDF");

const defaultOptions: jsPDFOptions = {
  orientation: "portrait",
  unit: "pt",
  format: "a4",
  putOnlyUsedFonts: true,
  compress: false,
  precision: 16,
  userUnit: 1.0,
  hotfixes: ["px_scaling"],
  encryption: {},
  floatPrecision: 16,
};

const initializeDoc = async (
  options: jsPDFOptions,
  fontOptions?: IGoogleFontSpec[]
): Promise<jsPDF> => {
  const pdfOptions = Object.assign({}, defaultOptions, options);
  if (pdfOptions.unit === "pt" && !pdfOptions.hotfixes.includes("px_scaling")) {
    pdfOptions.hotfixes.push("px_scaling");
  }

  logger
    .m(initializeDoc.name)
    .debug(`Preparing PDF with:\n${JSON.stringify(pdfOptions, null, 2)}`);

  if (fontOptions) {
    logger.m(initializeDoc.name).info("Loading fonts");
    const fonts = await loadFontsV2(fontOptions);
    /*
    fonts.forEach((font) => {
      var callAddFont = function () {
        this.addFileToVFS(font.name, font.data);
        this.addFont(font.name, font.id, font.style, font.weight);
        this.addFont(font.name, font.id.toLowerCase(), font.style, font.weight);
      };
      jsPDF.API.events.push(["addFonts", callAddFont]);
    });
    */
  }
  const doc = new jsPDF(pdfOptions);
  return doc;
};
