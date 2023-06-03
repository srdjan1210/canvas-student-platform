import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ReuploadTestFileCommand } from './reupload-test-file.command';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { SCORE_REPOSITORY } from '../../../../domain/scores/score.constants';
import { IScoreRepository } from '../../../../domain/scores/interfaces/score-repository.interface';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { Course } from '../../../../domain/courses/course';
import { IUserRepository } from '../../../../domain/auth/interfaces/user-repository.interface';
import { USER_REPOSITORY } from '../../../auth/auth.constants';
import { User } from 'src/domain/auth/user';
import { STORAGE_SERVICE } from '../../../shared/shared.constants';
import { IStorageService } from '../../../shared/interfaces/storage-service.interface';
import { TestScore } from '../../../../domain/scores/model/test-score';

@CommandHandler(ReuploadTestFileCommand)
export class ReuploadTestFileCommandHandler
  implements ICommandHandler<ReuploadTestFileCommand>
{
  constructor(
    @Inject(SCORE_REPOSITORY)
    private readonly scoreRepository: IScoreRepository,
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: IStorageService,
  ) {}
  async execute({
    title,
    testId,
    file,
    authorized,
  }: ReuploadTestFileCommand): Promise<void> {
    const course = await this.courseRepository.findByTitleIncluding(title, {
      students: true,
    });
    const user = await this.userRepository.findByIdPopulated(authorized);

    Course.throwIfNull(course);
    course.throwIfNotEnrolled(authorized);
    User.throwIfNull(user);

    const studentId = user.student.id;
    const folder = `test-scores-${testId}`;
    const filename = `${Date.now()}-${course.id}-${studentId}-${testId}.zip`;
    await this.storageService.uploadFile(file, folder, filename);

    const fileUrl = await this.storageService.getSignedDownloadLink(
      `${folder}/${filename}`,
    );

    const scoreObj = TestScore.create({
      studentId: user.student.id,
      courseId: course.id,
      testId,
      fileUrl,
    });

    const existing = await this.scoreRepository.findOrCreate(scoreObj);
    existing.upload(fileUrl);

    await this.scoreRepository.update(existing);
  }
}
