import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { EMAIL_SERVICE } from '../../core/shared/shared.constants';
import { SendgridEmailService } from './emails/sendgrid-email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: EMAIL_SERVICE,
      useClass: SendgridEmailService,
    },
  ],
  exports: [EMAIL_SERVICE],
})
export class SharedModule {}
