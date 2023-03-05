import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UploadCourseFileCommand } from './upload-course-file.command';
import { IStorageService } from '../../../shared/interfaces/storage-service.interface';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { STORAGE_SERVICE } from '../../../shared/shared.constants';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { ProfessorNotInCourseException } from '../../../../domain/courses/exceptions/professor-not-in-course.exception';
import { CourseNotFoundException } from '../../../../domain/courses/exceptions/course-not-found.exception';

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
    courseId,
    filename,
    file,
  }: UploadCourseFileCommand): Promise<any> {
    const course = await this.courseRepository.findByIdIncluding(courseId, {
      professors: true,
    });

    if (!course) throw new CourseNotFoundException();
    if (!course.professors.some((p) => p.id == professorId))
      throw new ProfessorNotInCourseException();

    return await this.storageService.uploadFile(file, course.title, filename);
  }
}
