import { TestScore } from '../model/test-score';
import { MyCourseScore } from '../types/my-course-score';

export interface IScoreRepository {
  findById(
    courseId: number,
    studentId: number,
    testId: number,
  ): Promise<TestScore>;
  create(score: TestScore): Promise<TestScore>;
  update(score: TestScore): Promise<TestScore>;
  delete(score: TestScore): Promise<void>;
  findOrCreate(score: TestScore): Promise<TestScore>;
  findStudentScores(studentId: number, courseId: number): Promise<TestScore[]>;
  findStudentsScoresWithNotSubmitted(
    studentId: number,
    courseId: number,
  ): Promise<MyCourseScore[]>;
}
