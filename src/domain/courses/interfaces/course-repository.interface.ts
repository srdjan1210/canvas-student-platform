import { Course } from '../course';
import { Pagination } from '../types/pagination.type';
import { CourseStudentsPaginated } from '../types/course-students-paginated.type';
import { Student } from '../../specialization/model/student';
import { Professor } from '../../specialization/model/professor';
import { CourseProfessorsPaginated } from '../types/course-professors-paginated.type';

export interface ICourseRepository {
  findById(id: number): Promise<Course>;
  findByIdIncluding(
    id: number,
    including: { professors?: boolean; students?: boolean },
  ): Promise<Course>;
  findByTitle(title: string): Promise<Course>;
  update(course: Course): Promise<void>;
  create(course: Course): Promise<Course>;
  findAllByStudent(studentId: number): Promise<Course[]>;
  findByTitleIncluding(
    title: string,
    including: { professors?: boolean; students?: boolean },
  );
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
  removeStudentFromCourse(title: string, studentId: number): Promise<void>;
  removeProfessorFromCourse(title: string, professorId: number): Promise<void>;
}
