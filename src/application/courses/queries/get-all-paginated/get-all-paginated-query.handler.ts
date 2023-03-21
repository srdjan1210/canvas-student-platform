import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllPaginatedQuery } from './get-all-paginated.query';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { Course } from '../../../../domain/courses/course';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
} from '../../../specialization/specialization.constants';

@QueryHandler(GetAllPaginatedQuery)
export class GetAllPaginatedQueryHandler
  implements IQueryHandler<GetAllPaginatedQuery>
{
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute({ page, limit }: GetAllPaginatedQuery): Promise<Course[]> {
    const pg =
      !page || page < DEFAULT_PAGINATION_PAGE ? DEFAULT_PAGINATION_PAGE : page;
    const lim =
      limit < DEFAULT_PAGINATION_LIMIT ? DEFAULT_PAGINATION_LIMIT : limit;

    console.log(pg, lim);

    return this.courseRepository.findAllPaginated({
      page: pg,
      limit: lim,
    });
  }
}
