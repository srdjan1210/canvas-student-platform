import { UserRole } from './role.enum';
import { AggregateRoot } from '@nestjs/cqrs';
import { Student } from '../../specialization/domain/student';
import { Professor } from '../../specialization/domain/professor';
import { AccountCreatedEvent } from '../events/account-created/account-created.event';

export class User extends AggregateRoot {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly password: string,
    public readonly role: UserRole,
    public readonly student: Student,
    public readonly professor: Professor,
  ) {
    super();
  }

  createAccount() {
    this.apply(new AccountCreatedEvent(this.email));
  }
}
