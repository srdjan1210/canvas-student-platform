import { UserRole } from '../../../domain/role.enum';

export class CreateUserCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public role: UserRole,
  ) {}
}
