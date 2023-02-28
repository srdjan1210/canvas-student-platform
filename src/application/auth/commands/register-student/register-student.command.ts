import { UserRole } from '../../../../domain/auth/role.enum';

export class RegisterStudentCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly role: UserRole,
    public readonly name: string,
    public readonly surname: string,
    public readonly specializationName: string,
    public readonly indexNumber: number,
    public readonly year: number,
  ) {}
}
