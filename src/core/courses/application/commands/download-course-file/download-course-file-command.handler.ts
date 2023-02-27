import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DownloadCourseFileCommand } from './download-course-file.command';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { IStorageService } from '../../../../shared/interfaces/storage-service.interface';
import { STORAGE_SERVICE } from '../../../../shared/shared.constants';

@CommandHandler(DownloadCourseFileCommand)
export class DownloadCourseFileCommandHandler
  implements ICommandHandler<DownloadCourseFileCommand>
{
  constructor(
    @Inject(STORAGE_SERVICE) private readonly storageService: IStorageService,
  ) {}
  async execute({
    folder,
    file,
  }: DownloadCourseFileCommand): Promise<ReadableStream<Uint8Array>> {
    const url = `${folder}/${file}`;
    return this.storageService.downloadFile(url);
  }
}
