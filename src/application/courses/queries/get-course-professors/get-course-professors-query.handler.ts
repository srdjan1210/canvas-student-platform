import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCourseProfessorsQuery } from './get-course-professors.query';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { Professor } from '../../../../domain/specialization/model/professor';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
} from '../../../specialization/specialization.constants';

@QueryHandler(GetCourseProfessorsQuery)
export class GetCourseProfessorsQueryHandler
  implements IQueryHandler<GetCourseProfessorsQuery>
{
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute({
    title,
    page,
    limit,
  }: GetCourseProfessorsQuery): Promise<Professor[]> {
    const pg = page < DEFAULT_PAGINATION_PAGE ? DEFAULT_PAGINATION_PAGE : page;
    const lim =
      limit < DEFAULT_PAGINATION_LIMIT ? DEFAULT_PAGINATION_LIMIT : limit;

    return this.courseRepository.findCourseProfessors({
      title,
      page: pg,
      limit: lim,
    });
  }
}
