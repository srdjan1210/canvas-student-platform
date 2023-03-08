import { Course } from '../course';

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
}
