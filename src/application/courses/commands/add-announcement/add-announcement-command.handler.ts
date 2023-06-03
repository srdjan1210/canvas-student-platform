import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AnnouncementCreatedEvent } from 'src/domain/courses/events/announcement-created.event';
import { IAnnouncementRepository } from 'src/domain/courses/interfaces/announcement-repository.interface';
import { Announcement } from '../../../../domain/courses/announcement';
import {
  ANNOUNCEMENT_REPOSITORY,
  COURSE_REPOSITORY,
} from '../../../../domain/courses/course.constants';
import { CourseNotFoundException } from '../../../../domain/courses/exceptions/course-not-found.exception';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { ISanitizationService } from '../../../../domain/shared/sanitization-service.interface';
import { SANITIZATION_SERVICE } from '../../../../infrastructure/shared/sanitization/sanitization.constants';
import { AddAnnouncementCommand } from './add-announcement.command';

@CommandHandler(AddAnnouncementCommand)
export class AddAnnouncementCommandHandler
  implements ICommandHandler<AddAnnouncementCommand>
{
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    @Inject(SANITIZATION_SERVICE)
    private readonly sanitizationService: ISanitizationService,
    @Inject(ANNOUNCEMENT_REPOSITORY)
    private readonly announcementRepository: IAnnouncementRepository,
    private readonly eventBus: EventBus,
  ) {}
  async execute({
    title,
    body,
    course: courseName,
    professorId,
  }: AddAnnouncementCommand): Promise<void> {
    const course = await this.courseRepository.findByTitle(courseName);

    title = this.sanitizationService.sanitizeHtml(title);
    body = this.sanitizationService.sanitizeHtml(body);

    if (!course) throw new CourseNotFoundException();

    const announcement = Announcement.create({
      title,
      body,
      courseId: course.id,
      professorId,
    });

    const saved = await this.announcementRepository.create(announcement);
    this.eventBus.publish(new AnnouncementCreatedEvent(saved));
  }
}
