export enum EducationTypeEnum {
  Formal,
  Online,
  SelfTaught,
}

export type Education = {
  show: boolean;
  showDetails: boolean;
  type: EducationTypeEnum;
  title: string;
  faculty: string;
  from: number;
  to: number;
  link?: string;
  grade?: string;
  GPA?: number;
  thesis?: string;
  thesisGrade?: number;
};
