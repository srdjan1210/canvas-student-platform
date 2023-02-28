import { PersonAddedToCourseEvent } from '../domain/events/person-added-to-course.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EMAIL_SERVICE } from '../../shared/shared.constants';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { IEmailService } from '../../shared/interfaces/email-service.interface';

@EventsHandler(PersonAddedToCourseEvent)
export class PersonAddedToCourseEventHandler
  implements IEventHandler<PersonAddedToCourseEvent>
{
  constructor(
    @Inject(EMAIL_SERVICE) private readonly emailService: IEmailService,
  ) {}
  async handle({ email, course }: PersonAddedToCourseEvent) {
    await this.emailService.sendAddedToCourseEmail(email, course);
  }
}
