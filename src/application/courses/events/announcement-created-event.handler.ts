import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { COURSE_REPOSITORY } from 'src/domain/courses/course.constants';
import { ICourseRepository } from 'src/domain/courses/interfaces/course-repository.interface';
import { AnnouncementCreatedEvent } from '../../../domain/courses/events/announcement-created.event';
import { IEmailService } from '../../shared/interfaces/email-service.interface';
import { EMAIL_SERVICE } from '../../shared/shared.constants';
import { AnnouncementCreatedPayload } from './internal/announcement-created-payload.dto';

@EventsHandler(AnnouncementCreatedEvent)
export class AnnouncementCreatedEventHandler
  implements IEventHandler<AnnouncementCreatedEvent>
{
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    @Inject(EMAIL_SERVICE) private readonly emailService: IEmailService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async handle({ announcement }: AnnouncementCreatedEvent): Promise<void> {
    const members = await this.courseRepository.findAllMembers(
      announcement.courseId,
    );

    const emails = members.map((s) => s.email);
    const ids = members.map((s) => s.id);
    // await this.emailService.sendAnnouncementEmail(emails, announcement);

    this.eventEmitter.emit(
      'announcement.created',
      new AnnouncementCreatedPayload(ids, announcement),
    );
  }
}
