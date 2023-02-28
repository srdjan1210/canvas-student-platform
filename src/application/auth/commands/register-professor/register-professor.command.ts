import { UserRole } from '../../../../domain/auth/role.enum';

export class RegisterProfessorCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly role: UserRole,
    public readonly name: string,
    public readonly surname: string,
    public readonly title: string,
  ) {}
}
