import { Professor } from '../specialization/model/professor';
import { Course } from './course';

export class Announcement {
  protected constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly body: string,
    public readonly courseId: number,
    public readonly professorId: number,
    public readonly createdAt: Date,
    public readonly professor: Professor = null,
    public readonly course: Course = null,
  ) {}

  static create({
    id,
    title,
    body,
    courseId,
    professorId,
    professor,
    course,
    createdAt,
  }: Partial<Announcement>) {
    return new Announcement(
      id,
      title,
      body,
      courseId,
      professorId,
      createdAt,
      professor,
      course,
    );
  }
}
