import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { StudentRepository } from './repositories/student.repository';
import {
  PROFESSOR_REPOSITORY,
  STUDENT_REPOSITORY,
} from '../../domain/specialization/specialization.constants';
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { StudentMapperFactory } from './factories/student-mapper.factory';
import { ProfessorRepository } from './repositories/professor.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '../persistance/prisma/prisma.module';
import { ProfessorMapperFactory } from '../courses/factories/professor-mapper.factory';
import { StudentFactory } from '../../domain/specialization/factories/student.factory';
import { ProfessorFactory } from '../../domain/specialization/factories/professor.factory';
import { SpecializationController } from './specialization.controller';
import { SearchStudentsQueryHandler } from '../../application/specialization/queries/search-students/search-students-query.handler';
import { SearchProfessorQueryHandler } from '../../application/specialization/queries/search-professors/search-professor-query.handler';
import { GetStudentsNotAttendingCourseQueryHandler } from '../../application/specialization/queries/get-students-not-attending/get-students-not-attending-course-query.handler';
import { GetProfessorsNotCourseMembersQueryHandler } from '../../application/specialization/queries/get-professors-not-course-members/get-professors-not-course-members-query.handler';
import { ExportStudentsQueryHandler } from '../../application/specialization/queries/export-students/export-students-query.handler';
import { SharedModule } from '../shared/shared.module';
import { ExportProfessorsQueryHandler } from '../../application/specialization/queries/export-professors/export-professors-query.handler';

const providers: Provider[] = [
  {
    provide: STUDENT_REPOSITORY,
    useClass: StudentRepository,
  },
  {
    provide: PROFESSOR_REPOSITORY,
    useClass: ProfessorRepository,
  },
  StudentMapperFactory,
  StudentFactory,
  ProfessorFactory,
  ProfessorMapperFactory,
  ExportStudentsQueryHandler,
  ExportProfessorsQueryHandler,
];

const queries: Provider[] = [
  SearchStudentsQueryHandler,
  SearchProfessorQueryHandler,
  GetStudentsNotAttendingCourseQueryHandler,
  GetProfessorsNotCourseMembersQueryHandler,
];

@Module({
  controllers: [SpecializationController],
  imports: [CqrsModule, PrismaModule, SharedModule],
  providers: [...providers, ...queries],
  exports: [
    STUDENT_REPOSITORY,
    PROFESSOR_REPOSITORY,
    ProfessorMapperFactory,
    StudentMapperFactory,
  ],
})
export class SpecializationModule {}
