import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { CqrsModule } from '@nestjs/cqrs';
import { AddAnnouncementCommandHandler } from '../../application/courses/commands/add-announcement/add-announcement-command.handler';
import { AddProfessorsToCourseCommandHandler } from '../../application/courses/commands/add-professor-to-course/add-professors-to-course-command.handler';
import { AddStudentsToCourseCommandHandler } from '../../application/courses/commands/add-student-to-course/add-students-to-course-command.handler';
import { CreateCourseCommandHandler } from '../../application/courses/commands/create-course/create-course-command.handler';
import { CreateFolderCommandHandler } from '../../application/courses/commands/create-folder/create-folder-command.handler';
import { DeleteFileCommandHandler } from '../../application/courses/commands/delete-file/delete-file-command.handler';
import { DeleteFolderCommandHandler } from '../../application/courses/commands/delete-folder/delete-folder-command.handler';
import { DownloadCourseFileCommandHandler } from '../../application/courses/commands/download-course-file/download-course-file-command.handler';
import { ImportProfessorsFromCsvCommandHandler } from '../../application/courses/commands/import-professors-from-csv/import-professors-from-csv-command.handler';
import { ImportStudentsFromCsvCommandHandler } from '../../application/courses/commands/import-students-from-csv/import-students-from-csv-command.handler';
import { ParseStudentsFromCsvCommandHandler } from '../../application/courses/commands/parse-students-from-csv/parse-students-from-csv-command.handler';
import { RemoveProfessorFromCourseCommandHandler } from '../../application/courses/commands/remove-professor-from-course/remove-professor-from-course-command.handler';
import { RemoveStudentFromCourseCommandHandler } from '../../application/courses/commands/remove-student-from-course/remove-student-from-course-command.handler';
import { UploadCourseFileCommandHandler } from '../../application/courses/commands/upload-course-file/upload-course-file-command.handler';
import { AnnouncementCreatedEventHandler } from '../../application/courses/events/announcement-created-event.handler';
import { ExportProfessorsToCsvQueryHandler } from '../../application/courses/queries/export-professors-to-csv/export-professors-to-csv-query.handler';
import { ExportStudentsToCsvQueryHandler } from '../../application/courses/queries/export-students-to-csv/export-students-to-csv-query.handler';
import { GetAllPaginatedQueryHandler } from '../../application/courses/queries/get-all-paginated/get-all-paginated-query.handler';
import { GetAnnouncementQueryHandler } from '../../application/courses/queries/get-announcement/get-announcement-query.handler';
import { GetCourseProfessorsQueryHandler } from '../../application/courses/queries/get-course-professors/get-course-professors-query.handler';
import { GetCourseStudentsQueryHandler } from '../../application/courses/queries/get-course-students/get-course-students-query.handler';
import { GetPersonalAnnouncementsQueryHandler } from '../../application/courses/queries/get-personal-announcements/get-personal-announcements-query.handler';
import { GetProfessorCorusesQueryHandler } from '../../application/courses/queries/get-professor-courses/get-professor-coruses-query.handler';
import { GetStudentCoursesQueryHandler } from '../../application/courses/queries/get-student-courses/get-student-courses-query.handler';
import { ListCourseFolderQueryHandler } from '../../application/courses/queries/list-course-folder/list-course-folder-query.handler';
import {
  ANNOUNCEMENT_REPOSITORY,
  COURSE_REPOSITORY,
} from '../../domain/courses/course.constants';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../persistance/prisma/prisma.module';
import { SharedModule } from '../shared/shared.module';
import { SpecializationModule } from '../specialization/specialization.module';
import { AnnouncementController } from './controllers/announcement.controller';
import { CourseController } from './controllers/course.controller';
import { AnnouncementMapperFactory } from './factories/announcement-mapper.factory';
import { CourseMapperFactory } from './factories/course-mapper.factory';
import { AnnouncementRepository } from './repositories/announcement.repository';
import { CourseRepository } from './repositories/course.repository';
import { CreateTestCommandHandler } from '../../application/scores/commands/create-test/create-test-command.handler';
import { GetCourseTestsQueryHandler } from '../../application/scores/queries/get-course-tests/get-course-tests-query.handler';
import { ScoresModule } from '../scores/scores.module';
import { ListCourseFileTreeQuery } from '../../application/courses/queries/list-course-file-tree/list-course-file-tree.query';
import { ListCourseFileTreeQueryHandler } from '../../application/courses/queries/list-course-file-tree/list-course-file-tree-query.handler';
import { GetCourseAnnouncementsQueryHandler } from '../../application/courses/queries/get-course-announcements/get-course-announcements-query.handler';

const commands = [
  UploadCourseFileCommandHandler,
  DownloadCourseFileCommandHandler,
  CreateCourseCommandHandler,
  AddStudentsToCourseCommandHandler,
  AddProfessorsToCourseCommandHandler,
  AddAnnouncementCommandHandler,
  CreateFolderCommandHandler,
  DeleteFolderCommandHandler,
  ParseStudentsFromCsvCommandHandler,
  ExportStudentsToCsvQueryHandler,
  ExportProfessorsToCsvQueryHandler,
  ImportStudentsFromCsvCommandHandler,
  ImportProfessorsFromCsvCommandHandler,
  RemoveStudentFromCourseCommandHandler,
  RemoveProfessorFromCourseCommandHandler,
  DeleteFileCommandHandler,
  ListCourseFileTreeQueryHandler,
];

const queries = [
  ListCourseFolderQueryHandler,
  GetStudentCoursesQueryHandler,
  GetProfessorCorusesQueryHandler,
  GetAllPaginatedQueryHandler,
  GetCourseProfessorsQueryHandler,
  GetCourseStudentsQueryHandler,
  GetAnnouncementQueryHandler,
  GetPersonalAnnouncementsQueryHandler,
  GetCourseAnnouncementsQueryHandler,
];

const events = [AnnouncementCreatedEventHandler];

const providers: Provider[] = [
  {
    provide: COURSE_REPOSITORY,
    useClass: CourseRepository,
  },
  {
    provide: ANNOUNCEMENT_REPOSITORY,
    useClass: AnnouncementRepository,
  },
  CourseMapperFactory,
  AnnouncementMapperFactory,
];

@Module({
  controllers: [CourseController, AnnouncementController],
  providers: [...commands, ...queries, ...events, ...providers],
  imports: [
    SharedModule,
    CqrsModule,
    PrismaModule,
    SpecializationModule,
    AuthModule,
  ],
  exports: [COURSE_REPOSITORY],
})
export class CourseModule {}
