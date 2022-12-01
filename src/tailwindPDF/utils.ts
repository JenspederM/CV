import type jsPDF from "jspdf";

export const rem2px = (rem: string) => {
  let _px;
  if (typeof rem === "string") {
    if (rem.endsWith("rem")) {
      _px = rem.slice(0, -3).replaceAll(" ", "").replaceAll(",", ".");
    } else {
      _px = rem.replaceAll(" ", "").replaceAll(",", ".");
    }
  } else {
    _px = rem;
  }
  return parseFloat(_px) * 16;
};

export const getTextDimensions = (
  doc: jsPDF,
  text: string,
  margins: number[]
) => {
  return {
    width: getTextWidth(doc, text, margins),
    height: getTextHeight(doc, text, margins),
  };
};

export const getTextHeight = (doc: jsPDF, text: string, margins: number[]) => {
  const maxWidth = doc.internal.pageSize.getWidth() - margins[1] - margins[3];
  const textHeight =
    doc.splitTextToSize(text, maxWidth).length * doc.getLineHeight();

  return textHeight;
};

export const getTextWidth = (doc: jsPDF, text: string, margins: number[]) => {
  const maxWidth = doc.internal.pageSize.getWidth() - margins[1] - margins[3];
  const textWidth = Math.min(
    doc.getTextDimensions(text, {
      maxWidth,
      fontSize: doc.getFontSize(),
    }).w,
    maxWidth
  );

  return textWidth;
};
