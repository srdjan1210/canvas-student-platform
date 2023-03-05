import { Specialization } from '../model/specialization';
import { User } from '../../auth/user';
import { Student } from '../model/student';

export class StudentFactory {
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
