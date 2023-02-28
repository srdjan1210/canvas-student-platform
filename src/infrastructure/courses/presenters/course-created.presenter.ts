import { Course } from '../../../domain/courses/course';

export class CourseCreatedPresenter {
  id: number;
  title: string;
  year: number;
  espb: number;

  constructor(course: Course) {
    this.id = course.id;
    this.title = course.title;
    this.espb = course.espb;
    this.year = course.year;
  }
}
