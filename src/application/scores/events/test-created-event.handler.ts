import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TestCreatedEvent } from '../../../domain/scores/events/test-created.event';
import { AnnouncementCreatedPayload } from '../../courses/events/internal/announcement-created-payload.dto';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import {
  ANNOUNCEMENT_REPOSITORY,
  COURSE_REPOSITORY,
} from '../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../domain/courses/interfaces/course-repository.interface';
import { EMAIL_SERVICE } from '../../shared/shared.constants';
import { IEmailService } from '../../shared/interfaces/email-service.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Announcement } from '../../../domain/courses/announcement';
import { IAnnouncementRepository } from '../../../domain/courses/interfaces/announcement-repository.interface';

@EventsHandler(TestCreatedEvent)
export class TestCreatedEventHandler
  implements IEventHandler<TestCreatedEvent>
{
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    @Inject(ANNOUNCEMENT_REPOSITORY)
    private readonly announcementRepository: IAnnouncementRepository,
    @Inject(EMAIL_SERVICE) private readonly emailService: IEmailService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async handle({ test, professorId }: TestCreatedEvent): Promise<void> {
    const members = await this.courseRepository.findAllMembers(test.courseId);
    const course = await this.courseRepository.findById(test.courseId);

    const emails = members.map((s) => s.email);
    const ids = members.map((s) => s.id);
    // await this.emailService.sendAnnouncementEmail(emails, announcement);

    const announcement = Announcement.create({
      courseId: course.id,
      title: test.title,
      body: test.description,
      professorId,
    });

    const { id, title, createdAt, professor, body, courseId } =
      await this.announcementRepository.create(announcement);

    const forSending = Announcement.create({
      id,
      title,
      createdAt,
      professor,
      professorId,
      body,
      courseId,
      course,
    });

    this.eventEmitter.emit(
      'announcement.created',
      new AnnouncementCreatedPayload(ids, forSending),
    );
  }
}
