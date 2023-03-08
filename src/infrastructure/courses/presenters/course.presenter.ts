import { Course } from '../../../domain/courses/course';

export class CoursePresenter {
  id: number;
  title: string;
  description: string;
  constructor({ id, title, description }: Course) {
    this.id = id;
    this.title = title;
    this.description = description;
  }
}
