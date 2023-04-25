import { Student } from '../specialization/model/student';
import { Professor } from '../specialization/model/professor';
import { AggregateRoot } from '@nestjs/cqrs';
import { PersonAddedToCourseEvent } from './events/person-added-to-course.event';
import { PersonDto } from '../specialization/person.dto';
import { Announcement } from './announcement';
import { StudentFactory } from '../specialization/factories/student.factory';
import { ProfessorFactory } from '../specialization/factories/professor.factory';
import { CourseNotFoundException } from './exceptions/course-not-found.exception';
import { StudentNotEnrolledInCourseException } from './exceptions/student-not-enrolled-in-course.exception';
import { NotCourseProfessorException } from './exceptions/not-course-professor.exception';

export class Course extends AggregateRoot {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly year: number,
    public readonly espb: number,
    public readonly description: string,
    public students: Student[] = [],
    public professors: Professor[] = [],
    public announcements: Announcement[] = [],
  ) {
    super();
  }

  addStudents(studentIds: number[]) {
    const students = studentIds.map((id) => StudentFactory.create({ id }));
    this.students = [...this.students, ...students];
  }

  addProfessors(professorIds: number[]) {
    const professors = professorIds.map((id) =>
      ProfessorFactory.create({ id }),
    );
    this.professors = [...this.professors, ...professors];
  }

  greetNewMembers(members: PersonDto[]) {
    members.forEach((mem) =>
      this.apply(new PersonAddedToCourseEvent(mem.email, this.title)),
    );
  }

  addAnnouncement(announcement: Announcement) {
    this.announcements.push(announcement);
  }

  throwIfNotEnrolled(studentId: number) {
    const isEnrolled = this.students.some(
      (student) => student.userId === studentId,
    );
    if (!isEnrolled) throw new StudentNotEnrolledInCourseException();
  }

  throwIfNotCourseProfessor(professorId: number) {
    const isProfessor = this.professors.some(
      (professor) => professor.userId === professorId,
    );
    if (!isProfessor) throw new NotCourseProfessorException();
  }

  static throwIfNull(course: Course) {
    if (!course) throw new CourseNotFoundException();
  }
}
