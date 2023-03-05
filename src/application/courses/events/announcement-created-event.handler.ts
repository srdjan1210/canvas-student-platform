import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AnnouncementCreatedEvent } from '../../../domain/courses/events/announcement-created.event';
import { IEmailService } from '../../shared/interfaces/email-service.interface';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { EMAIL_SERVICE } from '../../shared/shared.constants';
import { STUDENT_REPOSITORY } from '../../../domain/specialization/specialization.constants';
import { IStudentRepository } from '../../../domain/specialization/interfaces/student-repository.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AnnouncementCreatedPayload } from './internal/announcement-created-payload.dto';

@EventsHandler(AnnouncementCreatedEvent)
export class AnnouncementCreatedEventHandler
  implements IEventHandler<AnnouncementCreatedEvent>
{
  constructor(
    @Inject(EMAIL_SERVICE) private readonly emailService: IEmailService,
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async handle({ announcement }: AnnouncementCreatedEvent): Promise<void> {
    const students = await this.studentRepository.findAllForCourse(
      announcement.courseId,
    );
    const emails = students.map((s) => s.user.email);
    const ids = students.map((s) => s.id);
    await this.emailService.sendAnnouncementEmail(emails, announcement);

    this.eventEmitter.emit(
      'announcement.created',
      new AnnouncementCreatedPayload(ids, announcement),
    );
  }
}
