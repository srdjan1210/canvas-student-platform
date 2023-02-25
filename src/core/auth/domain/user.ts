import { UserRole } from './role.enum';
import { AggregateRoot } from '@nestjs/cqrs';

export class User extends AggregateRoot {
  private readonly _id: number;
  private readonly _email: string;
  private readonly _password: string;
  private readonly _role: UserRole;

  constructor(id: number, email: string, password: string, role: UserRole) {
    super();
    this._id = id;
    this._email = email;
    this._password = password;
    this._role = role;
  }

  get id() {
    return this._id;
  }

  get email() {
    return this._email;
  }

  get password() {
    return this._password;
  }

  get role() {
    return this._role;
  }
}
