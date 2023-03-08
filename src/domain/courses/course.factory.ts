import { Student } from '../specialization/model/student';
import { Professor } from '../specialization/model/professor';
import { Course } from './course';

export class CourseFactory {
  static create(data: {
    id?: number;
    title?: string;
    year?: number;
    espb?: number;
    description?: string;
    students: Student[];
    professors: Professor[];
  }): Course {
    const id = data.id ?? null;
    const title = data.title ?? null;
    const year = data.year ?? null;
    const espb = data.espb ?? null;
    const description = data.description ?? '';
    const students = data.students ?? [];
    const professors = data.professors ?? [];
    return new Course(id, title, year, espb, description, students, professors);
  }
}
