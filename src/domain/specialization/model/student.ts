import { Specialization } from './specialization';
import { User } from '../../auth/user';

export class Student {
  protected constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly surname: string,
    public readonly specializationName: string,
    public readonly userId: number,
    public readonly indexNumber: number,
    public readonly year: number,
    public readonly fullIndex: string,
    public readonly specialization: Specialization = null,
    public readonly user: User = null,
  ) {}

  static create({
    id,
    name,
    surname,
    userId,
    specializationName,
    indexNumber,
    year,
    fullIndex,
    specialization,
    user,
  }: Partial<Student>) {
    return new Student(
      id,
      name,
      surname,
      specializationName,
      userId,
      indexNumber,
      year,
      fullIndex,
      specialization,
      user,
    );
  }
}
