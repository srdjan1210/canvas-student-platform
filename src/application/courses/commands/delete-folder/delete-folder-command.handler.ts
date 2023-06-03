import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteFolderCommand } from './delete-folder.command';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { STORAGE_SERVICE } from '../../../shared/shared.constants';
import { IStorageService } from '../../../shared/interfaces/storage-service.interface';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { CourseNotFoundException } from '../../../../domain/courses/exceptions/course-not-found.exception';
import { PROFESSOR_REPOSITORY } from '../../../../domain/specialization/specialization.constants';
import { IProfessorRepository } from '../../../../domain/specialization/interfaces/professor-repository.interface';
import { IUserRepository } from '../../../../domain/auth/interfaces/user-repository.interface';
import { USER_REPOSITORY } from '../../../auth/auth.constants';
import { ProfessorNotInCourseException } from '../../../../domain/courses/exceptions/professor-not-in-course.exception';
import { Course } from '../../../../domain/courses/course';

@CommandHandler(DeleteFolderCommand)
export class DeleteFolderCommandHandler
  implements ICommandHandler<DeleteFolderCommand>
{
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    @Inject(STORAGE_SERVICE) private readonly storageService: IStorageService,
  ) {}

  async execute({ authenticated, folder }: DeleteFolderCommand): Promise<void> {
    const title = folder.split('/')[0];
    console.log(folder);
    const course = await this.courseRepository.findByTitleIncluding(title, {
      professors: true,
    });

    Course.throwIfNull(course);
    course.throwIfNotCourseProfessor(authenticated);

    await this.storageService.deleteFolder(folder);
  }
}
