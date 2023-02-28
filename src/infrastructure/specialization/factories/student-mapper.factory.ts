import { IEntityMapperFactory } from '../../shared/factories/entity-mapper-factory.interface';
import { StudentEntity } from '@prisma/client';
import { Student } from '../../../domain/specialization/student';

export class StudentMapperFactory
  implements IEntityMapperFactory<StudentEntity, Student>
{
  fromEntity({
    id,
    surname,
    name,
    specializationName,
    indexNumber,
    indexYear,
    userId,
  }: StudentEntity): Student {
    return new Student(
      id,
      name,
      surname,
      specializationName,
      userId,
      indexNumber,
      indexYear,
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
  }: Student): StudentEntity {
    return {
      id,
      name,
      surname,
      specializationName,
      userId,
      indexNumber,
      indexYear,
    };
  }
}
