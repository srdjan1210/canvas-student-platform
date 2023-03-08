import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DownloadCourseFileCommand } from './download-course-file.command';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { IStorageService } from '../../../shared/interfaces/storage-service.interface';
import { STORAGE_SERVICE } from '../../../shared/shared.constants';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { CourseNotFoundException } from '../../../../domain/courses/exceptions/course-not-found.exception';

@CommandHandler(DownloadCourseFileCommand)
export class DownloadCourseFileCommandHandler
  implements ICommandHandler<DownloadCourseFileCommand>
{
  constructor(
    @Inject(STORAGE_SERVICE) private readonly storageService: IStorageService,
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
  ) {}
  async execute({ folder, file }: DownloadCourseFileCommand): Promise<string> {
    const url = `${folder}/${file}`;
    const course = await this.courseRepository.findByTitle(folder);
    if (!course) throw new CourseNotFoundException();
    return await this.storageService.getSignedDownloadLink(url);
  }
}
