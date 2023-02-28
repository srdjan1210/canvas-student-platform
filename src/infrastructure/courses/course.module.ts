import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { CourseController } from './course.controller';
import { UploadCourseFileCommandHandler } from '../../core/courses/application/commands/upload-course-file/upload-course-file-command.handler';
import { SharedModule } from '../shared/shared.module';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '../persistance/prisma/prisma.module';
import { DownloadCourseFileCommandHandler } from '../../core/courses/application/commands/download-course-file/download-course-file-command.handler';
import { ListCourseFolderQueryHandler } from '../../core/courses/application/queries/list-course-folder/list-course-folder-query.handler';
import { CreateCourseCommandHandler } from '../../core/courses/application/commands/create-course/create-course-command.handler';
import { AddStudentsToCourseCommandHandler } from '../../core/courses/application/commands/add-student-to-course/add-students-to-course-command.handler';
import { AddProfessorsToCourseCommandHandler } from '../../core/courses/application/commands/add-professor-to-course/add-professors-to-course-command.handler';
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { COURSE_REPOSITORY } from '../../core/courses/domain/course.constants';
import { CourseRepository } from './repositories/course.repository';
import { SpecializationModule } from '../specialization/specialization.module';
import { CourseMapperFactory } from './factories/course-mapper.factory';

const commands = [
  UploadCourseFileCommandHandler,
  DownloadCourseFileCommandHandler,
  CreateCourseCommandHandler,
  AddStudentsToCourseCommandHandler,
  AddProfessorsToCourseCommandHandler,
];

const queries = [ListCourseFolderQueryHandler];

const providers: Provider[] = [
  {
    provide: COURSE_REPOSITORY,
    useClass: CourseRepository,
  },
  CourseMapperFactory,
];

@Module({
  controllers: [CourseController],
  providers: [...commands, ...queries, ...providers],
  imports: [SharedModule, CqrsModule, PrismaModule, SpecializationModule],
})
export class CourseModule {}
