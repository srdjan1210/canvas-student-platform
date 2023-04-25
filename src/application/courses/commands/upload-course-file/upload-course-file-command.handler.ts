import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UploadCourseFileCommand } from './upload-course-file.command';
import { IStorageService } from '../../../shared/interfaces/storage-service.interface';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { STORAGE_SERVICE } from '../../../shared/shared.constants';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { ProfessorNotInCourseException } from '../../../../domain/courses/exceptions/professor-not-in-course.exception';
import { CourseNotFoundException } from '../../../../domain/courses/exceptions/course-not-found.exception';
import { Course } from '../../../../domain/courses/course';

@CommandHandler(UploadCourseFileCommand)
export class UploadCourseFileCommandHandler
  implements ICommandHandler<UploadCourseFileCommand>
{
  constructor(
    @Inject(STORAGE_SERVICE) private readonly storageService: IStorageService,
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
  ) {}
  async execute({
    professorId,
    folder,
    filename,
    file,
  }: UploadCourseFileCommand): Promise<any> {
    const title = folder.split('/')[0];
    const course = await this.courseRepository.findByTitleIncluding(title, {
      professors: true,
    });

    Course.throwIfNull(course);
    course.throwIfNotCourseProfessor(professorId);

    return await this.storageService.uploadFile(file, folder, filename);
  }
}
