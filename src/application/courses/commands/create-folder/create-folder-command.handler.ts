import { CreateFolderCommand } from './create-folder.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { STORAGE_SERVICE } from '../../../shared/shared.constants';
import { IStorageService } from '../../../shared/interfaces/storage-service.interface';
import { CourseNotFoundException } from '../../../../domain/courses/exceptions/course-not-found.exception';
import { Course } from '../../../../domain/courses/course';

@CommandHandler(CreateFolderCommand)
export class CreateFolderCommandHandler
  implements ICommandHandler<CreateFolderCommand>
{
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    @Inject(STORAGE_SERVICE) private readonly storageService: IStorageService,
  ) {}

  async execute({ authenticated, folder }: CreateFolderCommand): Promise<void> {
    const courseTitle = folder.split('/')[0];
    const course = await this.courseRepository.findByTitleIncluding(
      courseTitle,
      { professors: true },
    );
    Course.throwIfNull(course);
    course.throwIfNotCourseProfessor(authenticated);
    await this.storageService.createFolder(folder);
  }
}
