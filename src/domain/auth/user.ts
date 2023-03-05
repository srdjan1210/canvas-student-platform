import { UserRole } from './role.enum';
import { AggregateRoot } from '@nestjs/cqrs';
import { Student } from '../specialization/model/student';
import { Professor } from '../specialization/model/professor';
import { AccountCreatedEvent } from './events/account-created.event';

export class User extends AggregateRoot {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly password: string,
    public readonly role: UserRole,
    public readonly student: Student = null,
    public readonly professor: Professor = null,
  ) {
    super();
  }

  createAccount() {
    this.apply(new AccountCreatedEvent(this.email));
  }
}
