import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCourseTestsQuery } from './get-course-tests.query';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { Course } from '../../../../domain/courses/course';
import { COURSE_TEST_REPOSITORY } from '../../../../domain/scores/score.constants';
import { ICourseTestRepository } from '../../../../domain/scores/interfaces/course-test-repository.interface';

@QueryHandler(GetCourseTestsQuery)
export class GetCourseTestsQueryHandler
  implements IQueryHandler<GetCourseTestsQuery>
{
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    @Inject(COURSE_TEST_REPOSITORY)
    private readonly testRepository: ICourseTestRepository,
  ) {}
  async execute({ authorized, title }: GetCourseTestsQuery): Promise<any> {
    const course = await this.courseRepository.findByTitleIncluding(title, {
      professors: true,
    });
    Course.throwIfNull(course);
    course.throwIfNotCourseProfessor(authorized);

    return this.testRepository.findAllByCourse(title);
  }
}
