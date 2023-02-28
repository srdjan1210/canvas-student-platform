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
    public readonly specialization: Specialization = null,
    public readonly user: User = null,
  ) {}

  static create(data: {
    id?: number;
    name?: string;
    surname?: string;
    userId?: number;
    specializationName?: string;
    indexNumber?: number;
    year?: number;
    specialization?: Specialization;
    user?: User;
  }) {
    const id = data.id ?? null;
    const name = data.name ?? null;
    const surname = data.surname ?? null;
    const specializationName = data.specializationName ?? null;
    const indexNumber = data.indexNumber ?? null;
    const year = data.year ?? null;
    const userId = data.userId ?? null;
    const specialization = data.specialization ?? null;
    const user = data.user ?? null;
    return new Student(
      id,
      name,
      surname,
      specializationName,
      indexNumber,
      year,
      userId,
      specialization,
      user,
    );
  }
}
