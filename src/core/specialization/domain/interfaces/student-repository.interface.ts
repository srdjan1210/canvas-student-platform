import { Student } from '../student';

export interface IStudentRepository {
  findById(id: number): Promise<Student>;
}
