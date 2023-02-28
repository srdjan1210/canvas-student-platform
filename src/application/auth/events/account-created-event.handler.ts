import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AccountCreatedEvent } from '../../../domain/auth/events/account-created.event';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { IEmailService } from '../../shared/interfaces/email-service.interface';
import { EMAIL_SERVICE } from '../../shared/shared.constants';

@EventsHandler(AccountCreatedEvent)
export class AccountCreatedEventHandler
  implements IEventHandler<AccountCreatedEvent>
{
  constructor(
    @Inject(EMAIL_SERVICE) private readonly emailService: IEmailService,
  ) {}
  async handle({ email }: AccountCreatedEvent): Promise<void> {
    await this.emailService.sendAccountCreatedMail(email);
  }
}
