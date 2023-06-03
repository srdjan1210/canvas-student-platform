import { Course } from '../../courses/course';
import { Student } from '../../specialization/model/student';
import { CourseTest } from './course-test';
import { PointsNegativeValueException } from '../exceptions/points-negative-value.exception';

export class TestScore {
  protected constructor(
    public readonly studentId: number,
    public readonly courseId: number,
    public readonly testId: number,
    public points: number,
    public fileUrl: string,
    public readonly student: Student,
    public readonly course: Course,
    public readonly test: CourseTest,
  ) {}

  upload(url: string) {
    this.fileUrl = url;
  }

  evaluate(points: number) {
    if (!points || points < 0) throw new PointsNegativeValueException();
    this.points = points;
  }

  static create({
    studentId,
    courseId,
    testId,
    student,
    fileUrl,
    course,
    test,
    points,
  }: Partial<TestScore>) {
    return new TestScore(
      studentId,
      courseId,
      testId,
      points,
      fileUrl,
      student,
      course,
      test,
    );
  }
}
