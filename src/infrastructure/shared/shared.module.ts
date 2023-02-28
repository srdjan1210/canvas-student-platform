import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import {
  EMAIL_SERVICE,
  STORAGE_SERVICE,
} from '../../application/shared/shared.constants';
import { SendgridEmailService } from './emails/sendgrid-email.service';
import { ConfigModule } from '@nestjs/config';
import { SupabaseStorageService } from './storage/supabase-storage.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: EMAIL_SERVICE,
      useClass: SendgridEmailService,
    },
    {
      provide: STORAGE_SERVICE,
      useClass: SupabaseStorageService,
    },
  ],
  exports: [EMAIL_SERVICE, STORAGE_SERVICE],
})
export class SharedModule {}
