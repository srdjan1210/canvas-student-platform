import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateScorePointsCommand } from './update-score-points.command';
import { ICourseTestRepository } from '../../../../domain/scores/interfaces/course-test-repository.interface';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import {
  COURSE_TEST_REPOSITORY,
  SCORE_REPOSITORY,
} from '../../../../domain/scores/score.constants';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { Course } from '../../../../domain/courses/course';
import { TestScore } from '../../../../domain/scores/model/test-score';
import { IScoreRepository } from '../../../../domain/scores/interfaces/score-repository.interface';
import { Score } from '../../../../domain/scores/model/score';
import { PointsNegativeValueException } from '../../../../domain/scores/exceptions/points-negative-value.exception';

@CommandHandler(UpdateScorePointsCommand)
export class UpdateScorePointsCommandHandler
  implements ICommandHandler<UpdateScorePointsCommand>
{
  constructor(
    @Inject(SCORE_REPOSITORY)
    private readonly scoreRepository: IScoreRepository,
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
  ) {}
  async execute({
    authorized,
    courseTitle,
    studentId,
    testId,
    points,
  }: UpdateScorePointsCommand): Promise<void> {
    const course = await this.courseRepository.findByTitleIncluding(
      courseTitle,
      {
        professors: true,
      },
    );

    Course.throwIfNull(course);
    course.throwIfNotCourseProfessor(authorized);

    if (points < 0) throw new PointsNegativeValueException();

    const scoreObj = TestScore.create({
      courseId: course.id,
      studentId,
      testId,
    });

    const existing = await this.scoreRepository.findOrCreate(scoreObj);
    existing.evaluate(points);

    await this.scoreRepository.update(existing);
  }
}
