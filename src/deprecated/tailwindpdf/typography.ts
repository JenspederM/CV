import tailwindDefaultsTheme from "tailwindcss/defaultTheme";
import Base from "./base";

class Typography extends Base {
  setFontSize(fontSize: string) {
    const availableSizes = Object.keys(tailwindDefaultsTheme.fontSize);

    tailwindDefaultsTheme.fontSize[fontSize];
    const fontSizeNumber = Number(fontSize.replace("px", ""));
    this.doc.setFontSize(fontSizeNumber);
  }
}
