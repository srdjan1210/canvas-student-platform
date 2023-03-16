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
import { SearchStudentsNotAttendingQueryHandler } from '../../application/specialization/queries/get-students-not-attending/search-students-not-attending-query.handler';

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
];

const queries: Provider[] = [
  SearchStudentsQueryHandler,
  SearchProfessorQueryHandler,
  SearchStudentsNotAttendingQueryHandler,
];

@Module({
  controllers: [SpecializationController],
  imports: [CqrsModule, PrismaModule],
  providers: [...providers, ...queries],
  exports: [STUDENT_REPOSITORY, PROFESSOR_REPOSITORY],
})
export class SpecializationModule {}
