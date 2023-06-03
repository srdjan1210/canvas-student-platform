import { TestScore } from '../../../domain/scores/model/test-score';
import { CourseTest } from '../../../domain/scores/model/course-test';

export class CourseResultPresenter {
  public courseId: number;
  public studentId: number;
  public testId: number;
  public points: number;
  public fileUrl: string;
  public test: CourseTest;

  constructor({
    courseId,
    studentId,
    testId,
    points,
    fileUrl,
    test,
  }: TestScore) {
    this.courseId = courseId;
    this.studentId = studentId;
    this.points = points;
    this.fileUrl = fileUrl;
    this.testId = testId;
    this.test = test;
  }
}
