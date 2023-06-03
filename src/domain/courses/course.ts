import { AggregateRoot } from '@nestjs/cqrs';
import { User } from '../auth/user';
import { CourseTest } from '../scores/model/course-test';
import { Score } from '../scores/model/score';
import { Professor } from '../specialization/model/professor';
import { PersonDto } from '../specialization/person.dto';
import { Announcement } from './announcement';
import { CourseStudent } from './course-student';
import { AnnouncementCreatedEvent } from './events/announcement-created.event';
import { PersonAddedToCourseEvent } from './events/person-added-to-course.event';
import { CourseNotFoundException } from './exceptions/course-not-found.exception';
import { NotCourseProfessorException } from './exceptions/not-course-professor.exception';
import { StudentNotEnrolledInCourseException } from './exceptions/student-not-enrolled-in-course.exception';

export class Course extends AggregateRoot {
  protected constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly year: number,
    public readonly espb: number,
    public readonly description: string,
    public students: CourseStudent[] = [],
    public professors: Professor[] = [],
    public announcements: Announcement[] = [],
    public readonly scores: Score[],
    public readonly tests: CourseTest[],
  ) {
    super();
  }

  addStudents(studentIds: number[]) {
    const students = studentIds.map((id) =>
      CourseStudent.create({ studentId: id, courseId: this.id }),
    );
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

  addAnnouncement(announcement: Announcement) {
    this.announcements.push(announcement);
    this.apply(new AnnouncementCreatedEvent(announcement));
  }

  throwIfNotEnrolled(studentId: number) {
    const isEnrolled = this.students.some(
      (student) => student.student.userId === studentId,
    );
    if (!isEnrolled) throw new StudentNotEnrolledInCourseException();
  }

  throwIfNotCourseProfessor(professorId: number) {
    const isProfessor = this.professors.some(
      (professor) => professor.userId === professorId,
    );
    if (!isProfessor) throw new NotCourseProfessorException();
  }

  throwIfNoPermissionToSeeFiles(user: User) {
    if (user.isProfessor()) return this.throwIfNotCourseProfessor(user.id);
    if (user.isStudent()) return this.throwIfNotEnrolled(user.id);
  }

  addTest(test: CourseTest) {
    this.tests.push(test);
  }

  static throwIfNull(course: Course) {
    if (!course) throw new CourseNotFoundException();
  }

  static create({
    id,
    title,
    year,
    espb,
    description,
    students = [],
    professors = [],
    announcements = [],
    scores = [],
    tests = [],
  }: Partial<Course>) {
    return new Course(
      id,
      title,
      year,
      espb,
      description,
      students,
      professors,
      announcements,
      scores,
      tests,
    );
  }
}
