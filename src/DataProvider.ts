import EducationData from "./data/educations.json";
import type { Education } from "./types";

class DataProvider {
  getEducations(): Education[] {
    return EducationData as unknown as Education[];
  }
}

export default new DataProvider();
