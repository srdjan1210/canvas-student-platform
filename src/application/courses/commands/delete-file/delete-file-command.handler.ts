import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteFileCommand } from './delete-file.command';
import { CourseNotFoundException } from '../../../../domain/courses/exceptions/course-not-found.exception';
import { ProfessorNotInCourseException } from '../../../../domain/courses/exceptions/professor-not-in-course.exception';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { USER_REPOSITORY } from '../../../auth/auth.constants';
import { IUserRepository } from '../../../../domain/auth/interfaces/user-repository.interface';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { STORAGE_SERVICE } from '../../../shared/shared.constants';
import { IStorageService } from '../../../shared/interfaces/storage-service.interface';

@CommandHandler(DeleteFileCommand)
export class DeleteFileCommandHandler
  implements ICommandHandler<DeleteFileCommand>
{
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    @Inject(STORAGE_SERVICE) private readonly storageService: IStorageService,
  ) {}
  async execute({ path, authenticated }: DeleteFileCommand): Promise<void> {
    const title = path.split('/')[0];
    const course = await this.courseRepository.findByTitle(title);
    if (!course) throw new CourseNotFoundException();

    const user = await this.userRepository.findByIdPopulated(authenticated);
    const courses = await this.courseRepository.findAllByProfessor(
      user.professor.id,
    );
    const containsCourse = courses.filter((course) => course.title === title);

    if (!containsCourse) throw new ProfessorNotInCourseException();

    await this.storageService.deleteFile(path);
  }
}
