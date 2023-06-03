import { CourseTest } from '../../../domain/scores/model/course-test';

export class TestPresenter {
  public id: number;
  public title: string;
  public description: string;
  public maxPoints: number;
  public courseId: number;
  public courseTitle: string;
  public deadlineForSubmission?: Date;
  constructor({
    title,
    description,
    maxPoints,
    courseId,
    id,
    course,
    deadlineForSubmission,
  }: CourseTest) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.maxPoints = maxPoints;
    this.courseId = courseId;
    this.courseTitle = course?.title;
    this.deadlineForSubmission = deadlineForSubmission;
  }
}
