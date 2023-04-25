import { IEntityMapperFactory } from '../../shared/factories/entity-mapper-factory.interface';
import {
  SpecializationEntity,
  StudentEntity,
  UserEntity,
} from '@prisma/client';
import { Student } from '../../../domain/specialization/model/student';
import { Specialization } from '../../../domain/specialization/model/specialization';
import { User } from '../../../domain/auth/user';
import { UserRole } from '../../../domain/auth/role.enum';

export class StudentMapperFactory
  implements
    IEntityMapperFactory<
      StudentEntity & {
        user?: UserEntity;
        specialization?: SpecializationEntity;
      },
      Student
    >
{
  fromEntity({
    id,
    surname,
    name,
    specializationName,
    indexNumber,
    indexYear,
    userId,
    specialization,
    user,
    fullIndex,
  }: StudentEntity & {
    user?: UserEntity;
    specialization?: SpecializationEntity;
  }): Student {
    const userMapped = user
      ? User.create({
          id: user.id,
          email: user.email,
          password: user.password,
          role: UserRole.STUDENT,
        })
      : null;
    const specializationMapped = specialization
      ? Specialization.create({
          id: specialization.id,
          shortName: specialization.shortName,
          fullName: specialization.name,
        })
      : null;

    return Student.create({
      id,
      name,
      surname,
      specializationName,
      userId,
      indexNumber,
      year: indexYear,
      fullIndex,
      specialization: specializationMapped,
      user: userMapped,
    });
  }

  fromModel({
    id,
    name,
    surname,
    specializationName,
    userId,
    indexNumber,
    year: indexYear,
    fullIndex,
  }: Student): StudentEntity & {
    user?: UserEntity;
    specialization?: SpecializationEntity;
  } {
    return {
      id,
      name,
      surname,
      specializationName,
      userId,
      indexNumber,
      indexYear,
      fullIndex,
    };
  }
}
