import { UserRole } from '../../../domain/auth/role.enum';
import { User } from '../../../domain/auth/user';
import { Student } from '../../../domain/specialization/model/student';
import { Professor } from '../../../domain/specialization/model/professor';

export class ProfilePresenter {
  public id: number;
  public email: string;
  public name: string;
  public surname: string;
  public role: string;
  constructor({ id, email, role, professor, student }: User) {
    this.id = id;
    this.email = email;
    this.role = role.toString();
    if (role === UserRole.STUDENT)
      this.setNameAndSurname(student.name, student.surname);
    if (role === UserRole.PROFESSOR)
      this.setNameAndSurname(professor.name, professor.surname);
    if (role === UserRole.ADMINISTRATOR)
      this.setNameAndSurname('admin', 'admin');
  }

  private setNameAndSurname(name: string, surname: string) {
    this.name = name;
    this.surname = surname;
  }
}
