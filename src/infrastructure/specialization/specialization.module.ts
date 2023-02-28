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
];
@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [...providers],
  exports: [STUDENT_REPOSITORY, PROFESSOR_REPOSITORY],
})
export class SpecializationModule {}
