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
    return new Student(
      id,
      name,
      surname,
      specializationName,
      userId,
      indexNumber,
      indexYear,
      fullIndex,
      specialization
        ? new Specialization(
            specialization.id,
            specialization.shortName,
            specialization.name,
          )
        : null,
      user
        ? new User(user.id, user.email, user.password, UserRole.STUDENT)
        : null,
    );
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
