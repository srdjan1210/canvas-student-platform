import { Specialization } from './specialization';
import { User } from '../../auth/domain/user';

export class Student {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly surname: string,
    public readonly specializationName: string,
    public readonly userId: number,
    public readonly indexNumber: number,
    public readonly year: number,
    public readonly specialization: Specialization,
    public readonly user: User,
  ) {}
}
