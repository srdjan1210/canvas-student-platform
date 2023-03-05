import { UserRole } from './role.enum';
import { User } from './user';
import { Student } from '../specialization/model/student';
import { Professor } from '../specialization/model/professor';

export class UserFactory {
  static create(data: {
    id?: number;
    password?: string;
    email?: string;
    role?: UserRole;
    student?: Student;
    professor?: Professor;
  }): User {
    const id = data.id ?? null;
    const password = data.password ?? null;
    const email = data.email ?? null;
    const role = data.role ?? null;
    const student = data.student ?? null;
    const professor = data.professor ?? null;
    return new User(id, email, password, role, student, professor);
  }
}
