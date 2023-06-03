export type MyCourseScore = {
  testId: number;
  title: string;
  maxPoints: number;
  points: number;
  testDescription: string;
  submissionDate: Date;
  lastSubmission?: string;
};
