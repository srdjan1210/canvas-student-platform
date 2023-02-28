import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UploadCourseFileCommand } from './upload-course-file.command';
import { IStorageService } from '../../../shared/interfaces/storage-service.interface';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { STORAGE_SERVICE } from '../../../shared/shared.constants';

@CommandHandler(UploadCourseFileCommand)
export class UploadCourseFileCommandHandler
  implements ICommandHandler<UploadCourseFileCommand>
{
  constructor(
    @Inject(STORAGE_SERVICE) private readonly storageService: IStorageService,
  ) {}
  async execute({
    courseName,
    filename,
    file,
  }: UploadCourseFileCommand): Promise<any> {
    return await this.storageService.uploadFile(file, courseName, filename);
  }
}
