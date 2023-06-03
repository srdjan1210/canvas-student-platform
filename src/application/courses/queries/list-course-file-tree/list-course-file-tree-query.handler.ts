import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListCourseFileTreeQuery } from './list-course-file-tree.query';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { Course } from '../../../../domain/courses/course';
import { User } from '../../../../domain/auth/user';
import { USER_REPOSITORY } from '../../../auth/auth.constants';
import { IUserRepository } from '../../../../domain/auth/interfaces/user-repository.interface';
import { STORAGE_SERVICE } from '../../../shared/shared.constants';
import { IStorageService } from '../../../shared/interfaces/storage-service.interface';

@QueryHandler(ListCourseFileTreeQuery)
export class ListCourseFileTreeQueryHandler
  implements IQueryHandler<ListCourseFileTreeQuery>
{
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(STORAGE_SERVICE) private readonly storageService: IStorageService,
  ) {}
  async execute({
    title,
    authenticated,
  }: ListCourseFileTreeQuery): Promise<any> {
    const course = await this.courseRepository.findByTitleIncluding(title, {
      students: true,
      professors: true,
    });
    const user = await this.userRepository.findById(authenticated);

    Course.throwIfNull(course);
    User.throwIfNull(user);
    course.throwIfNoPermissionToSeeFiles(user);

    return this.storageService.listFileTree(title);
  }
}
