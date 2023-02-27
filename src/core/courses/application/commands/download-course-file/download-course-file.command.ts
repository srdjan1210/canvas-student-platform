import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { IStorageService } from '../../../../shared/interfaces/storage-service.interface';

export class DownloadCourseFileCommand {
  constructor(public readonly folder: string, public readonly file: string) {}
}
