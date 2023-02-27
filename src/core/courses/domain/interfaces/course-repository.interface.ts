import { Course } from '../course';

export interface ICourseRepository {
  findById(id: number): Promise<Course>;
  update(course: Course): Promise<void>;
  create(course: Course): Promise<Course>;
}
