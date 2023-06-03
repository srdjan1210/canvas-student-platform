import { IQueryBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAnnouncementQuery } from './get-announcement.query';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { Course } from '../../../../domain/courses/course';
import { USER_REPOSITORY } from '../../../auth/auth.constants';
import { IUserRepository } from '../../../../domain/auth/interfaces/user-repository.interface';

@QueryHandler(GetAnnouncementQuery)
export class GetAnnouncementQueryHandler
  implements IQueryHandler<GetAnnouncementQuery>
{
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute({
    title,
    id,
    authenticated,
  }: GetAnnouncementQuery): Promise<any> {
    const course = await this.courseRepository.findByTitleIncluding(title, {
      students: true,
      professors: true,
    });
    const user = await this.userRepository.findById(authenticated);
    Course.throwIfNull(course);
    course.throwIfNoPermissionToSeeFiles(user);

    return this.courseRepository.findAnnouncement(title, id, {
      professor: true,
      course: true,
    });
  }
}
