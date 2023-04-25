import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import {
  EMAIL_SERVICE,
  STORAGE_SERVICE,
} from '../../application/shared/shared.constants';
import { SendgridEmailService } from './emails/sendgrid-email.service';
import { ConfigModule } from '@nestjs/config';
import { SupabaseStorageService } from './storage/supabase-storage.service';
import { CsvParsingService } from './csv/csv-parsing.service';
import { CSV_PARSING_SERVICE } from './csv/csv.constants';
import { CsvModule, CsvParser } from 'nest-csv-parser';

@Module({
  imports: [ConfigModule, CsvModule],
  providers: [
    {
      provide: EMAIL_SERVICE,
      useClass: SendgridEmailService,
    },
    {
      provide: STORAGE_SERVICE,
      useClass: SupabaseStorageService,
    },
    {
      provide: CSV_PARSING_SERVICE,
      useClass: CsvParsingService,
    },
  ],
  exports: [EMAIL_SERVICE, STORAGE_SERVICE, CSV_PARSING_SERVICE],
})
export class SharedModule {}
