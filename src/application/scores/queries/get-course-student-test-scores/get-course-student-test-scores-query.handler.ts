import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCourseStudentTestScoresQuery } from './get-course-student-test-scores.query';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { COURSE_TEST_REPOSITORY } from '../../../../domain/scores/score.constants';
import { ICourseTestRepository } from '../../../../domain/scores/interfaces/course-test-repository.interface';
import { Course } from '../../../../domain/courses/course';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
} from '../../../specialization/specialization.constants';

@QueryHandler(GetCourseStudentTestScoresQuery)
export class GetCourseStudentTestScoresQueryHandler
  implements IQueryHandler<GetCourseStudentTestScoresQuery>
{
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    @Inject(COURSE_TEST_REPOSITORY)
    private readonly testRepository: ICourseTestRepository,
  ) {}
  async execute({
    authorized,
    testId,
    courseTitle,
    page,
    limit,
  }: GetCourseStudentTestScoresQuery): Promise<any> {
    const course = await this.courseRepository.findByTitleIncluding(
      courseTitle,
      {
        professors: true,
      },
    );

    Course.throwIfNull(course);
    course.throwIfNotCourseProfessor(authorized);

    const pg = page <= 0 ? DEFAULT_PAGINATION_PAGE : page;
    const lmt = limit <= 0 ? DEFAULT_PAGINATION_LIMIT : limit;

    return this.testRepository.getStudentTestScores({
      courseId: course.id,
      testId: testId,
      page: pg,
      limit: lmt,
    });
  }
}
