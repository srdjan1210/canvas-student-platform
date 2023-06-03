import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateScoreCommand } from './update-score.command';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { SCORE_REPOSITORY } from '../../../../domain/scores/score.constants';
import { IScoreRepository } from '../../../../domain/scores/interfaces/score-repository.interface';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { Course } from '../../../../domain/courses/course';
import { TestScore } from '../../../../domain/scores/model/test-score';
import { STORAGE_SERVICE } from '../../../shared/shared.constants';
import { IStorageService } from '../../../shared/interfaces/storage-service.interface';

@CommandHandler(UpdateScoreCommand)
export class UpdateScoreCommandHandler
  implements ICommandHandler<UpdateScoreCommand>
{
  constructor(
    @Inject(SCORE_REPOSITORY)
    private readonly scoreRepository: IScoreRepository,
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: IStorageService,
  ) {}

  async execute({
    authorized,
    courseTitle,
    studentId,
    testId,
    file,
    points,
  }: UpdateScoreCommand) {
    const course = await this.courseRepository.findByTitleIncluding(
      courseTitle,
      {
        professors: true,
      },
    );

    Course.throwIfNull(course);
    course.throwIfNotCourseProfessor(authorized);
    let fileUrl;
    if (file) {
      const filename = `${Date.now()}-${course.id}-${studentId}-${testId}`;
      const folder = `test-scores-${testId}`;
      fileUrl = await this.storageService.uploadFile(file, folder, filename);
    }

    const score = TestScore.create({
      courseId: course.id,
      studentId,
      testId,
      fileUrl,
      points,
    });
    await this.scoreRepository.update(score);
  }
}
