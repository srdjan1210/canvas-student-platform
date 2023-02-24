import { User } from "../user";

export interface IUserRepository {
  create(user: User)
  findById(id: number): User

}