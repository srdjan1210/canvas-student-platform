import { Student } from '../../specialization/domain/student';
import { Professor } from '../../specialization/domain/professor';
import { AggregateRoot } from '@nestjs/cqrs';

export class Course extends AggregateRoot {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly year: number,
    public readonly espb: number,
    public readonly students: Student[] = [],
    public readonly professors: Professor[] = [],
  ) {
    super();
  }

  addStudents(students: Student[]) {
    this.students.concat(students);
  }

  addProfessors(professors: Professor[]) {
    this.professors.concat(professors);
  }

  static create(data: {
    id?: number;
    title?: string;
    year?: number;
    espb?: number;
    students: Student[];
    professors: Professor[];
  }): Course {
    const id = data.id ?? null;
    const title = data.title ?? null;
    const year = data.year ?? null;
    const espb = data.espb ?? null;
    const students = data.students ?? [];
    const professors = data.professors ?? [];
    return new Course(id, title, year, espb, students, professors);
  }
}
