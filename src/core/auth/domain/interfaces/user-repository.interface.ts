import { User } from '../user';

export interface IUserRepository {
  create(user: User): Promise<User>;
  findById(id: number): Promise<User>;
  findByEmail(email: string): Promise<User>;
}
