import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetStudentTestScoresWithNotSubmittedQuery } from './get-student-test-scores-with-not-submitted.query';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { SCORE_REPOSITORY } from '../../../../domain/scores/score.constants';
import { IScoreRepository } from '../../../../domain/scores/interfaces/score-repository.interface';
import { Course } from '../../../../domain/courses/course';
import { STUDENT_REPOSITORY } from '../../../../domain/specialization/specialization.constants';
import { IStudentRepository } from '../../../../domain/specialization/interfaces/student-repository.interface';
import { IUserRepository } from '../../../../domain/auth/interfaces/user-repository.interface';
import { USER_REPOSITORY } from '../../../auth/auth.constants';
import { MyCourseScore } from '../../../../domain/scores/types/my-course-score';

@QueryHandler(GetStudentTestScoresWithNotSubmittedQuery)
export class GetStudentTestScoresWithNotSubmittedQueryHandler
  implements IQueryHandler<GetStudentTestScoresWithNotSubmittedQuery>
{
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    @Inject(SCORE_REPOSITORY)
    private readonly scoreRepository: IScoreRepository,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}
  async execute({
    title,
    authenticated,
  }: GetStudentTestScoresWithNotSubmittedQuery): Promise<MyCourseScore[]> {
    const course = await this.courseRepository.findByTitleIncluding(title, {
      students: true,
    });

    Course.throwIfNull(course);
    course.throwIfNotEnrolled(authenticated);

    const user = await this.userRepository.findByIdPopulated(authenticated);
    return this.scoreRepository.findStudentsScoresWithNotSubmitted(
      user.student.id,
      course.id,
    );
  }
}
