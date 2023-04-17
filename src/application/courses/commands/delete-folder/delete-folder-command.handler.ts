import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteFolderCommand } from './delete-folder.command';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { STORAGE_SERVICE } from '../../../shared/shared.constants';
import { IStorageService } from '../../../shared/interfaces/storage-service.interface';

@CommandHandler(DeleteFolderCommand)
export class DeleteFolderCommandHandler
  implements ICommandHandler<DeleteFolderCommand>
{
  constructor(
    @Inject(STORAGE_SERVICE) private readonly storageService: IStorageService,
  ) {}

  async execute({ folder }: DeleteFolderCommand): Promise<any> {
    await this.storageService.deleteFolder(folder);
  }
}
