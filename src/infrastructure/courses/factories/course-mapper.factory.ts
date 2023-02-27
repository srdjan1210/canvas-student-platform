import { IEntityMapperFactory } from '../../shared/factories/entity-mapper-factory.interface';
import { Course } from '../../../core/courses/domain/course';
import { CourseEntity } from '@prisma/client';

export class CourseMapperFactory
  implements IEntityMapperFactory<CourseEntity, Course>
{
  fromEntity({ id, title, year, espb }: CourseEntity): Course {
    return new Course(id, title, year, espb);
  }
  fromModel({ id, title, year, espb }: Course) {
    return {
      id,
      title,
      year,
      espb,
    };
  }
}
