import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCourseStudentsQuery } from './get-course-students.query';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
} from '../../../specialization/specialization.constants';
import { Student } from '../../../../domain/specialization/model/student';

@QueryHandler(GetCourseStudentsQuery)
export class GetCourseStudentsQueryHandler
  implements IQueryHandler<GetCourseStudentsQuery>
{
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
  ) {}
  async execute({
    courseTitle,
    page,
    limit,
  }: GetCourseStudentsQuery): Promise<Student[]> {
    const pg = page < DEFAULT_PAGINATION_PAGE ? DEFAULT_PAGINATION_PAGE : page;
    const lim =
      limit < DEFAULT_PAGINATION_LIMIT ? DEFAULT_PAGINATION_LIMIT : limit;
    return this.courseRepository.findCourseStudents({
      title: courseTitle,
      page: pg,
      limit: lim,
    });
  }
}
