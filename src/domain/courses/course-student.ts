import { Course } from './course';
import { Student } from '../specialization/model/student';
import { TestScore } from '../scores/model/test-score';

export class CourseStudent {
  protected constructor(
    public readonly courseId: number,
    public readonly studentId: number,
    public readonly score: number,
    public readonly course: Course,
    public readonly student: Student,
    public readonly tests: TestScore[],
  ) {}

  static create({
    courseId,
    studentId,
    score,
    course,
    student,
    tests = [],
  }: Partial<CourseStudent>) {
    return new CourseStudent(
      courseId,
      studentId,
      score,
      course,
      student,
      tests,
    );
  }
}
