import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { CourseController } from './course.controller';
import { UploadCourseFileCommandHandler } from '../../core/courses/application/commands/upload-course-file/upload-course-file-command.handler';
import { SharedModule } from '../shared/shared.module';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '../persistance/prisma/prisma.module';
import { DownloadCourseFileCommandHandler } from '../../core/courses/application/commands/download-course-file/download-course-file-command.handler';
import { ListCourseFolderQueryHandler } from '../../core/courses/application/queries/list-course-folder/list-course-folder-query.handler';

const commands = [
  UploadCourseFileCommandHandler,
  DownloadCourseFileCommandHandler,
];

const queries = [ListCourseFolderQueryHandler];

@Module({
  controllers: [CourseController],
  providers: [...commands, ...queries],
  imports: [SharedModule, CqrsModule, PrismaModule],
})
export class CourseModule {}
