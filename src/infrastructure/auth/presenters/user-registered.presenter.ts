import { User } from '../../../core/auth/domain/user';

export class UserRegisteredPresenter {
  public readonly email: string;
  public readonly id: number;
  constructor({ email, id }: User) {
    this.email = email;
    this.id = id;
  }
}
