import { ProfessorEntity, StudentEntity, UserEntity } from '@prisma/client';
import { UserRole } from '../../../domain/auth/role.enum';
import { User } from '../../../domain/auth/user';
import { Professor } from '../../../domain/specialization/model/professor';
import { Student } from '../../../domain/specialization/model/student';
import { IEntityMapperFactory } from '../../shared/factories/entity-mapper-factory.interface';

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
    avatar,
  }: UserEntity & {
    student?: StudentEntity;
    professor?: ProfessorEntity;
  }): User {
    const studentMapped = student
      ? Student.create({
          id: student.id,
          name: student.name,
          surname: student.surname,
          specializationName: student.specializationName,
          userId: student.userId,
          indexNumber: student.indexNumber,
          year: student.indexYear,
          fullIndex: student.fullIndex,
        })
      : null;
    const professorMapped = professor
      ? Professor.create({
          id: professor.id,
          name: professor.name,
          surname: professor.surname,
          title: professor.title,
          userId: professor.userId,
        })
      : null;

    return User.create({
      id,
      email,
      password,
      avatar,
      role: this.userRoles[role],
      student: studentMapped,
      professor: professorMapped,
    });
  }

  fromModel({ id, email, role, password, avatar }: User) {
    return {
      id,
      email,
      role,
      password,
      avatar,
    } as UserEntity;
  }
}
