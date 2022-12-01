import type jsPDF from "jspdf";
import { getTextDimensions, getTextWidth, getTextHeight } from "./utils";

import { getLogger } from "./logging";
import {
  applyFontStyles,
  applyTextStyles,
  getTypographyTokens,
} from "./typography";

export const traverseDOM = (elementId: string, doc: jsPDF) => {
  const logger = getLogger("traverseDOM");
  // Get the root DOM element
  const root = document.getElementById(elementId);

  // If the root element is null, return
  if (!root) {
    logger.error("Root element not found", "traverseDOM");
    return;
  }

  const isDarkMode = document.querySelector("html").classList.contains("dark");

  isDarkMode ? logger.debug("Rendering PDF in dark mode", "traverseDOM") : null;

  let e = root.firstElementChild;
  // Margins: [top, right, bottom, left]
  const margins = [10, 10, 10, 10];
  const maxWidth = doc.internal.pageSize.getWidth() - margins[1] - margins[3];
  const defaultFont = doc.getFont();

  let align: "left" | "right" | "center" | "justify";
  let cx = margins[3];
  let rcx = margins[3];
  let cy = margins[0];

  while (e) {
    if (e) {
      logger.debug("Processing Element", "traverseDOM", e);
    }

    if (e.textContent) {
      const text = e.textContent
        .split(" ")
        .filter((word) => word !== "")
        .join(" ")
        .replaceAll("\n", "");

      const textWidth = getTextWidth(doc, text, margins);
      const typographyTokes = getTypographyTokens(Array.from(e.classList));

      Array.from(e.classList).map((style) => {
        applyTextStyles(doc, style);
        applyFontStyles(doc, style);

        if (style.startsWith("text-")) {
          const alignments: {
            [key: string]: {
              align: "left" | "right" | "center" | "justify";
              cx: number;
              rcx: number;
            };
          } = {
            "text-left": { align: "left", cx: margins[0], rcx: margins[0] },
            "text-center": {
              align: "center",
              cx: doc.internal.pageSize.getWidth() / 2,
              rcx: doc.internal.pageSize.getWidth() / 2 - textWidth / 2,
            },
            "text-right": {
              align: "right",
              cx: doc.internal.pageSize.getWidth() - margins[1],
              rcx: doc.internal.pageSize.getWidth() - margins[1] - textWidth,
            },
            "text-justify": {
              align: "justify",
              cx: margins[0],
              rcx: margins[0],
            },
            "text-start": { align: "left", cx: margins[0], rcx: margins[0] },
            "text-end": {
              align: "right",
              cx: doc.internal.pageSize.getWidth() - margins[1],
              rcx: doc.internal.pageSize.getWidth() - margins[1],
            },
          };

          if (Object.keys(alignments).includes(style)) {
            align = alignments[style].align;
            cx = alignments[style].cx;
            rcx = alignments[style].rcx;
          } else {
            align = alignments["text-left"].align;
            cx = alignments["text-left"].cx;
            rcx = alignments["text-left"].rcx;
          }
        }
      });

      const textHeight = getTextHeight(doc, text, margins);

      logger.debug("Setting text", "traverseDOM", {
        text: text,
        align: align,
        font: doc.getFont(),
        fontSize: doc.getFontSize(),
        lineHeight: doc.getLineHeight(),
        currentX: cx,
        currentY: cy,
        rectCurrentX: rcx,
        textDimensions: getTextDimensions(doc, text, margins),
      });

      doc.rect(rcx, cy, align === "justify" ? maxWidth : textWidth, textHeight);

      doc.text(text, cx, cy, {
        align,
        maxWidth,
        baseline: "top",
        lineHeightFactor: doc.getLineHeightFactor(),
      });

      cy += textHeight;
      applyTextStyles(doc, "text-base");
    }
    e = e.nextElementSibling;
  }
};
