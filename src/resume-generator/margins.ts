type MarginType = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  x: number;
  y: number;
};

export default class Margin implements MarginType {
  top: number;
  right: number;
  bottom: number;
  left: number;

  constructor({ top = 0, right = 0, bottom = 0, left = 0 } = {}) {
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
  }

  get y(): number {
    return this.top + this.bottom;
  }

  get x(): number {
    return this.left + this.right;
  }

  static small(): Margin {
    return new Margin({ top: 4, right: 4, bottom: 4, left: 4 });
  }

  static medium(): Margin {
    return new Margin({ top: 8, right: 8, bottom: 8, left: 8 });
  }

  static large(): Margin {
    return new Margin({ top: 16, right: 16, bottom: 16, left: 16 });
  }
}
