import { User } from '../user';
import { Announcement } from '../../courses/announcement';

export interface IUserRepository {
  create(user: User): Promise<User>;
  createProfessor(user: User): Promise<User>;
  createStudent(user: User): Promise<User>;
  findById(id: number): Promise<User>;
  findByIdPopulated(id: number): Promise<User>;
  findByEmail(email: string): Promise<User>;
}
