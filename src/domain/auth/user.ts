import { UserRole } from './role.enum';
import { AggregateRoot } from '@nestjs/cqrs';
import { Student } from '../specialization/model/student';
import { Professor } from '../specialization/model/professor';
import { AccountCreatedEvent } from './events/account-created.event';
import { UserDoesntExistException } from './exceptions/user-doesnt-exist.exception';

export class User extends AggregateRoot {
  protected constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly password: string,
    public readonly role: UserRole,
    public readonly avatar: string | null,
    public readonly student: Student = null,
    public readonly professor: Professor = null,
  ) {
    super();
  }

  createAccount() {
    this.apply(new AccountCreatedEvent(this.email));
  }

  isStudent() {
    return this.role === UserRole.STUDENT;
  }

  isProfessor() {
    return this.role === UserRole.PROFESSOR;
  }

  static throwIfNull(user: User) {
    if (!user) throw new UserDoesntExistException();
  }

  static create({
    id,
    email,
    password,
    role,
    student,
    professor,
    avatar,
  }: Partial<User>) {
    return new User(id, email, password, role, avatar, student, professor);
  }
}
