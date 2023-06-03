import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCourseAnnouncementsQuery } from './get-course-announcements.query';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import {
  ANNOUNCEMENT_REPOSITORY,
  COURSE_REPOSITORY,
} from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { USER_REPOSITORY } from '../../../auth/auth.constants';
import { IUserRepository } from '../../../../domain/auth/interfaces/user-repository.interface';
import { Course } from '../../../../domain/courses/course';
import { User } from '../../../../domain/auth/user';
import { IAnnouncementRepository } from '../../../../domain/courses/interfaces/announcement-repository.interface';

@QueryHandler(GetCourseAnnouncementsQuery)
export class GetCourseAnnouncementsQueryHandler
  implements IQueryHandler<GetCourseAnnouncementsQuery>
{
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(ANNOUNCEMENT_REPOSITORY)
    private readonly announcementRepository: IAnnouncementRepository,
  ) {}
  async execute({
    authenticated,
    title,
  }: GetCourseAnnouncementsQuery): Promise<any> {
    const course = await this.courseRepository.findByTitleIncluding(title, {
      students: true,
      professors: true,
    });
    const user = await this.userRepository.findById(authenticated);

    Course.throwIfNull(course);
    User.throwIfNull(user);
    course.throwIfNoPermissionToSeeFiles(user);

    return this.announcementRepository.getCourseAnnouncements(title);
  }
}
