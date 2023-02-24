import { UserRole } from "./role.enum";

export class User {
  private readonly _id: number;
  private readonly _email: string;

  private readonly _password: string;
  private readonly _role: UserRole;
  private readonly _name: string;
  private readonly _surname: string;

  constructor(
    id: number,
    email: string,
    password: string,
    role: UserRole,
    name: string,
    surname: string
  ) {
    this._id = id;
    this._email = email;
    this._password = password;
    this._role = role;
    this._name = name;
    this._surname = surname;
  }


  get id() {
    return this._id
  }

  get email() {
    return this._email
  }

  get password() {
    return this._password;
  }

  get role() {
    return this._role;
  }

  get name() {
    return this._name;
  }

  get surname() {
    return this._surname;
  }
}