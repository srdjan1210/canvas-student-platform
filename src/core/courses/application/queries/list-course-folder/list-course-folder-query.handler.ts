import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListCourseFolderQuery } from './list-course-folder.query';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { STORAGE_SERVICE } from '../../../../shared/shared.constants';
import { IStorageService } from '../../../../shared/interfaces/storage-service.interface';

@QueryHandler(ListCourseFolderQuery)
export class ListCourseFolderQueryHandler
  implements IQueryHandler<ListCourseFolderQuery>
{
  constructor(
    @Inject(STORAGE_SERVICE) private readonly storageService: IStorageService,
  ) {}
  async execute({ folder }: ListCourseFolderQuery): Promise<any> {
    return await this.storageService.listFolder(folder);
  }
}
