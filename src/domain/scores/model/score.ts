import { Course } from '../../courses/course';
import { Student } from '../../specialization/model/student';
import { TestScore } from './test-score';

export class Score {
  protected constructor(
    public readonly studentId: number,
    public readonly courseId: number,
    public readonly score: number,
    public readonly tests: TestScore[],
    public readonly course: Course,
    public readonly student: Student,
  ) {}

  static create({
    studentId,
    courseId,
    score,
    tests = [],
    course,
    student,
  }: Partial<Score>) {
    return new Score(studentId, courseId, score, tests, course, student);
  }
}
