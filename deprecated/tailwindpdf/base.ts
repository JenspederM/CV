import type jsPDF from "jspdf";

export default class Base {
  protected doc: jsPDF;

  constructor(doc: jsPDF) {
    this.doc = doc;
  }
}
