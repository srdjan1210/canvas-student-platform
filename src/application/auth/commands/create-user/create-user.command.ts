import { UserRole } from '../../../../domain/auth/role.enum';

export class CreateUserCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public role: UserRole,
  ) {}
}
