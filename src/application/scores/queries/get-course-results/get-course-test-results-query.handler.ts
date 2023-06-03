import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCourseTestResultsQuery } from './get-course-test-results.query';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { USER_REPOSITORY } from '../../../auth/auth.constants';
import { IUserRepository } from '../../../../domain/auth/interfaces/user-repository.interface';
import { SCORE_REPOSITORY } from '../../../../domain/scores/score.constants';
import { IScoreRepository } from '../../../../domain/scores/interfaces/score-repository.interface';
import { Course } from 'src/domain/courses/course';
import { User } from '../../../../domain/auth/user';
import { TestScore } from '../../../../domain/scores/model/test-score';

@QueryHandler(GetCourseTestResultsQuery)
export class GetCourseTestResultsQueryHandler
  implements IQueryHandler<GetCourseTestResultsQuery>
{
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(SCORE_REPOSITORY)
    private readonly scoreRepository: IScoreRepository,
  ) {}
  async execute({
    authorized,
    courseId,
  }: GetCourseTestResultsQuery): Promise<TestScore[]> {
    const user = await this.userRepository.findByIdPopulated(authorized);
    const course = await this.courseRepository.findByIdIncluding(courseId, {
      students: true,
    });

    Course.throwIfNull(course);
    User.throwIfNull(user);
    course.throwIfNotEnrolled(user.student.id);

    return this.scoreRepository.findStudentScores(user.student.id, courseId);
  }
}
