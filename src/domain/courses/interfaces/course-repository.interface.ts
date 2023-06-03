import { User } from 'src/domain/auth/user';
import { Professor } from '../../specialization/model/professor';
import { Student } from '../../specialization/model/student';
import { Announcement } from '../announcement';
import { Course } from '../course';
import { AnnouncementPopulateOptions } from '../types/announcement-populate.options';
import { CoursePopulateOptions } from '../types/course-populate-options.type';
import { CourseProfessorsPaginated } from '../types/course-professors-paginated.type';
import { CourseStudentsPaginated } from '../types/course-students-paginated.type';
import { Pagination } from '../types/pagination.type';

export interface ICourseRepository {
  findById(id: number): Promise<Course>;
  findByIdIncluding(
    id: number,
    including: { professors?: boolean; students?: boolean },
  ): Promise<Course>;
  findByTitle(title: string): Promise<Course>;
  update(
    course: Course,
    ignore?: { students?: boolean; professors?: boolean },
  ): Promise<void>;
  create(course: Course): Promise<Course>;
  findAllByStudent(studentId: number): Promise<Course[]>;
  findByTitleIncluding(
    title: string,
    including: CoursePopulateOptions,
  ): Promise<Course>;
  findAllByProfessor(professorId: number): Promise<Course[]>;
  findAllPaginated(data: Pagination): Promise<Course[]>;
  findCourseStudents(data: CourseStudentsPaginated): Promise<Student[]>;
  findCourseProfessors(data: CourseProfessorsPaginated): Promise<Professor[]>;
  filterStudentsNotInCourse(
    title: string,
    indexes: string[],
  ): Promise<Student[]>;
  filterProfessorsNotInCourse(
    title: string,
    ids: number[],
  ): Promise<Professor[]>;
  removeStudentFromCourse(courseId: number, studentId: number): Promise<void>;
  removeProfessorFromCourse(title: string, professorId: number): Promise<void>;
  findAnnouncement(
    title: string,
    id: number,
    populate: AnnouncementPopulateOptions,
  ): Promise<Announcement>;
  findAllMembers(courseId: number): Promise<User[]>;
}
