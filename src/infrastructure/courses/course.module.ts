import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { CourseController } from './controllers/course.controller';
import { UploadCourseFileCommandHandler } from '../../application/courses/commands/upload-course-file/upload-course-file-command.handler';
import { SharedModule } from '../shared/shared.module';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '../persistance/prisma/prisma.module';
import { DownloadCourseFileCommandHandler } from '../../application/courses/commands/download-course-file/download-course-file-command.handler';
import { ListCourseFolderQueryHandler } from '../../application/courses/queries/list-course-folder/list-course-folder-query.handler';
import { CreateCourseCommandHandler } from '../../application/courses/commands/create-course/create-course-command.handler';
import { AddStudentsToCourseCommandHandler } from '../../application/courses/commands/add-student-to-course/add-students-to-course-command.handler';
import { AddProfessorsToCourseCommandHandler } from '../../application/courses/commands/add-professor-to-course/add-professors-to-course-command.handler';
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { COURSE_REPOSITORY } from '../../domain/courses/course.constants';
import { CourseRepository } from './repositories/course.repository';
import { SpecializationModule } from '../specialization/specialization.module';
import { CourseMapperFactory } from './factories/course-mapper.factory';
import { CourseFactory } from '../../domain/courses/course.factory';
import { AddAnnouncementCommandHandler } from '../../application/courses/commands/add-announcement/add-announcement-command.handler';
import { AnnouncementCreatedEventHandler } from '../../application/courses/events/announcement-created-event.handler';
import { GetStudentCoursesQueryHandler } from '../../application/courses/queries/get-student-courses/get-student-courses-query.handler';
import { CreateFolderCommandHandler } from '../../application/courses/commands/create-folder/create-folder-command.handler';
import { GetProfessorCorusesQueryHandler } from '../../application/courses/queries/get-professor-courses/get-professor-coruses-query.handler';
import { GetAllPaginatedQueryHandler } from '../../application/courses/queries/get-all-paginated/get-all-paginated-query.handler';
import { GetCourseProfessorsQueryHandler } from '../../application/courses/queries/get-course-professors/get-course-professors-query.handler';
import { GetCourseStudentsQueryHandler } from '../../application/courses/queries/get-course-students/get-course-students-query.handler';
import { DeleteFolderCommandHandler } from '../../application/courses/commands/delete-folder/delete-folder-command.handler';

const commands = [
  UploadCourseFileCommandHandler,
  DownloadCourseFileCommandHandler,
  CreateCourseCommandHandler,
  AddStudentsToCourseCommandHandler,
  AddProfessorsToCourseCommandHandler,
  AddAnnouncementCommandHandler,
  CreateFolderCommandHandler,
  DeleteFolderCommandHandler,
];

const queries = [
  ListCourseFolderQueryHandler,
  GetStudentCoursesQueryHandler,
  GetProfessorCorusesQueryHandler,
  GetAllPaginatedQueryHandler,
  GetCourseProfessorsQueryHandler,
  GetCourseStudentsQueryHandler,
];

const events = [AnnouncementCreatedEventHandler];

const providers: Provider[] = [
  {
    provide: COURSE_REPOSITORY,
    useClass: CourseRepository,
  },
  CourseFactory,
  CourseMapperFactory,
];

@Module({
  controllers: [CourseController],
  providers: [...commands, ...queries, ...events, ...providers],
  imports: [SharedModule, CqrsModule, PrismaModule, SpecializationModule],
})
export class CourseModule {}
