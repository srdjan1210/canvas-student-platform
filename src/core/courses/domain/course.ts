import { Student } from '../../specialization/domain/student';
import { Professor } from '../../specialization/domain/professor';
import { AggregateRoot } from '@nestjs/cqrs';
import { PersonAddedToCourseEvent } from './events/person-added-to-course.event';
import { PersonDto } from '../../specialization/domain/person.dto';

export class Course extends AggregateRoot {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly year: number,
    public readonly espb: number,
    public students: Student[] = [],
    public professors: Professor[] = [],
  ) {
    super();
  }

  addStudents(studentIds: number[]) {
    const students = studentIds.map((id) => Student.create({ id }));
    this.students = [...this.students, ...students];
  }

  addProfessors(professorIds: number[]) {
    const professors = professorIds.map((id) => Professor.create({ id }));
    this.professors = [...this.professors, ...professors];
  }

  greetNewMembers(members: PersonDto[]) {
    members.forEach((mem) =>
      this.apply(new PersonAddedToCourseEvent(mem.email, this.title)),
    );
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
