import { IEntityMapperFactory } from '../../shared/factories/entity-mapper-factory.interface';
import { User } from '../../../domain/auth/user';
import { ProfessorEntity, StudentEntity, UserEntity } from '@prisma/client';
import { UserRole } from '../../../domain/auth/role.enum';
import { Student } from '../../../domain/specialization/model/student';
import { Professor } from '../../../domain/specialization/model/professor';

export class UserEntityMapperFactory
  implements
    IEntityMapperFactory<
      UserEntity & { student?: StudentEntity; professor?: ProfessorEntity },
      User
    >
{
  userRoles = {
    ADMINISTRATOR: UserRole.ADMINISTRATOR,
    PROFESSOR: UserRole.PROFESSOR,
    STUDENT: UserRole.STUDENT,
  };
  fromEntity({
    id,
    email,
    role,
    password,
    student,
    professor,
  }: UserEntity & {
    student?: StudentEntity;
    professor?: ProfessorEntity;
  }): User {
    return new User(
      id,
      email,
      password,
      this.userRoles[role],
      student
        ? new Student(
            student.id,
            student.name,
            student.surname,
            student.specializationName,
            student.userId,
            student.indexNumber,
            student.indexYear,
          )
        : null,
      professor
        ? new Professor(
            professor.id,
            professor.name,
            professor.surname,
            professor.title,
            professor.userId,
          )
        : null,
    );
  }

  fromModel({ id, email, role, password }: User) {
    return {
      id,
      email,
      role,
      password,
    } as UserEntity;
  }
}
