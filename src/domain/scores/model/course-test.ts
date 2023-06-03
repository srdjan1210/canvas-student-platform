import { TestScore } from './test-score';
import { Course } from '../../courses/course';
import { TestNotFoundException } from '../exceptions/test-not-found.exception';

export class CourseTest {
  protected constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly description: string,
    public readonly maxPoints: number,
    public readonly courseId: number,
    public readonly deadlineForSubmission: Date,
    public readonly testScores: TestScore[] = [],
    public readonly course: Course = null,
  ) {}

  static create({
    id,
    description,
    title,
    maxPoints,
    courseId,
    deadlineForSubmission,
    testScores = [],
    course,
  }: Partial<CourseTest>) {
    return new CourseTest(
      id,
      title,
      description,
      maxPoints,
      courseId,
      deadlineForSubmission,
      testScores,
      course,
    );
  }

  static throwIfNull(test: CourseTest) {
    if (!test) throw new TestNotFoundException();
  }
}
