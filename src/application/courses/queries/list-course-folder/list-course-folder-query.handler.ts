import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListCourseFolderQuery } from './list-course-folder.query';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { STORAGE_SERVICE } from '../../../shared/shared.constants';
import { IStorageService } from '../../../shared/interfaces/storage-service.interface';
import { CourseNotFoundException } from '../../../../domain/courses/exceptions/course-not-found.exception';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';

@QueryHandler(ListCourseFolderQuery)
export class ListCourseFolderQueryHandler
  implements IQueryHandler<ListCourseFolderQuery>
{
  constructor(
    @Inject(STORAGE_SERVICE) private readonly storageService: IStorageService,
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
  ) {}
  async execute({ folder }: ListCourseFolderQuery): Promise<any> {
    const courseTitle = folder.split('/')[0];
    const course = await this.courseRepository.findByTitle(courseTitle);
    if (!course && folder != '') throw new CourseNotFoundException();
    //TODO: Check if user is enrolled to course(professor, student)
    return await this.storageService.listFolder(folder);
  }
}
