import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListCourseFolderQuery } from './list-course-folder.query';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { STORAGE_SERVICE } from '../../../shared/shared.constants';
import { IStorageService } from '../../../shared/interfaces/storage-service.interface';
import { CourseNotFoundException } from '../../../../domain/courses/exceptions/course-not-found.exception';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { Course } from '../../../../domain/courses/course';
import { USER_REPOSITORY } from '../../../auth/auth.constants';
import { IUserRepository } from '../../../../domain/auth/interfaces/user-repository.interface';
import { UserRole } from '../../../../domain/auth/role.enum';
import { User } from '../../../../domain/auth/user';

@QueryHandler(ListCourseFolderQuery)
export class ListCourseFolderQueryHandler
  implements IQueryHandler<ListCourseFolderQuery>
{
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(STORAGE_SERVICE) private readonly storageService: IStorageService,
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
  ) {}
  async execute({
    authenticated,
    folder,
  }: ListCourseFolderQuery): Promise<any> {
    const courseTitle = folder.split('/')[0];
    const course = await this.courseRepository.findByTitleIncluding(
      courseTitle,
      { students: true, professors: true },
    );
    const user = await this.userRepository.findById(authenticated);

    Course.throwIfNull(course);
    User.throwIfNull(user);
    course.throwIfNoPermissionToSeeFiles(user);

    return this.storageService.listFolder(folder);
  }

  async validateCoursePermissions(authenticated: number, course: Course) {}
}
