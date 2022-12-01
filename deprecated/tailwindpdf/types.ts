import type { Font } from "jspdf";

export type rgbIntensity = [string, string, string];

export interface ITextOptions {
  color: IColor;
  font: string;
  fontSize: number;
}

export interface IColor {
  light: string;
  dark: string;
}

export interface IColorArgs {
  type?: "background" | "text" | "border";
  color: string;
}

export interface IDefaults {
  font: Font;
  fontSize: number;
  textColor: string;
  fillColor: string;
}

export interface ITheme {
  background?: {
    primary: IColor;
    secondary: IColor;
  };
  textOptions?: ITextOptions;
  borderColors?: IColor;
  width: number;
  height: number;
}

export const DEFAULT_THEME: ITheme = {
  background: {
    primary: {
      light: "white",
      dark: "black",
    },
    secondary: {
      light: "white",
      dark: "black",
    },
  },
  textOptions: {
    color: {
      light: "black",
      dark: "white",
    },
    font: "Roboto",
    fontSize: 12,
  },
  borderColors: {
    light: "black",
    dark: "white",
  },
  width: 595,
  height: 842,
};

export interface IDocCursor {
  x: number;
  y: number;
}
