export enum QuestionType {
  SingleSelect = "ss",
  MultiSelect = "ms",
  TrueFalse = "tf",
  Fill = "f",
}

export interface Question {
  id: number;
  t: QuestionType;
  q: string;
  s: string;
  a: string;
}
